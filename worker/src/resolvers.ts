import { Env } from './index';
import { generateId, getCurrentTimestamp } from './utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  sessionId?: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface Context {
  env: Env;
  ctx: ExecutionContext;
}

export const resolvers = {
  Query: {
    getChatHistory: async (
      _: any,
      { sessionId }: { sessionId?: string },
      context: Context
    ): Promise<Message[]> => {
      try {
        if (!sessionId) {
          return [];
        }

        if (!context.env.CHAT_HISTORY) {
          console.warn('KV storage not configured, returning empty history');
          return [];
        }

        const sessionData = await context.env.CHAT_HISTORY.get(`session:${sessionId}`);
        if (!sessionData) {
          return [];
        }

        const session: ChatSession = JSON.parse(sessionData);
        return session.messages || [];
      } catch (error) {
        console.error('Error getting chat history:', error);
        return [];
      }
    },

    getChatSessions: async (_: any, __: any, context: Context): Promise<ChatSession[]> => {
      try {
        if (!context.env.CHAT_HISTORY) {
          console.warn('KV storage not configured, returning empty sessions');
          return [];
        }

        const sessions = await context.env.CHAT_HISTORY.list({ prefix: 'session:' });
        const chatSessions: ChatSession[] = [];

        for (const key of sessions.keys) {
          const sessionData = await context.env.CHAT_HISTORY.get(key.name);
          if (sessionData) {
            chatSessions.push(JSON.parse(sessionData));
          }
        }

        return chatSessions.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      } catch (error) {
        console.error('Error getting chat sessions:', error);
        return [];
      }
    },
  },

  Mutation: {
    sendMessage: async (
      _: any,
      { message, sessionId }: { message: string; sessionId?: string },
      context: Context
    ): Promise<{ message: string; sessionId: string }> => {
      try {
        const currentSessionId = sessionId || generateId();
        const timestamp = getCurrentTimestamp();

        const userMessage: Message = {
          id: generateId(),
          content: message,
          sender: 'user',
          timestamp,
          sessionId: currentSessionId,
        };

        let session: ChatSession;
        if (context.env.CHAT_HISTORY && sessionId) {
          const existingSessionData = await context.env.CHAT_HISTORY.get(`session:${sessionId}`);
          if (existingSessionData) {
            session = JSON.parse(existingSessionData);
          } else {
            session = {
              id: currentSessionId,
              messages: [],
              createdAt: timestamp,
              updatedAt: timestamp,
            };
          }
        } else {
          session = {
            id: currentSessionId,
            messages: [],
            createdAt: timestamp,
            updatedAt: timestamp,
          };
        }

        session.messages.push(userMessage);

        const aiResponse = await callDeepSeekAPI(message, context.env);
        
        const aiMessage: Message = {
          id: generateId(),
          content: aiResponse,
          sender: 'ai',
          timestamp: getCurrentTimestamp(),
          sessionId: currentSessionId,
        };

        session.messages.push(aiMessage);
        session.updatedAt = getCurrentTimestamp();

        if (context.env.CHAT_HISTORY) {
          await context.env.CHAT_HISTORY.put(
            `session:${currentSessionId}`,
            JSON.stringify(session)
          );
        } else {
          console.warn('KV storage not configured, session not persisted');
        }

        return {
          message: aiResponse,
          sessionId: currentSessionId,
        };
      } catch (error) {
        console.error('Error in sendMessage:', error);
        const errorResponse = '抱歉，我现在无法回答您的问题。请稍后再试。';
        
        return {
          message: errorResponse,
          sessionId: sessionId || generateId(),
        };
      }
    },

    createChatSession: async (_: any, __: any, context: Context): Promise<ChatSession> => {
      const sessionId = generateId();
      const timestamp = getCurrentTimestamp();
      
      const session: ChatSession = {
        id: sessionId,
        messages: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      if (context.env.CHAT_HISTORY) {
        await context.env.CHAT_HISTORY.put(
          `session:${sessionId}`,
          JSON.stringify(session)
        );
      } else {
        console.warn('KV storage not configured, session not persisted');
      }

      return session;
    },

    deleteChatSession: async (
      _: any,
      { sessionId }: { sessionId: string },
      context: Context
    ): Promise<boolean> => {
      try {
        if (!context.env.CHAT_HISTORY) {
          console.warn('KV storage not configured, cannot delete session');
          return false;
        }

        await context.env.CHAT_HISTORY.delete(`session:${sessionId}`);
        return true;
      } catch (error) {
        console.error('Error deleting chat session:', error);
        return false;
      }
    },
  },
};

async function callDeepSeekAPI(message: string, env: Env): Promise<string> {
  try {
    const response = await fetch(env.DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个有用的AI助手，请用中文回答用户的问题。支持Markdown格式输出。',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '抱歉，我无法理解您的问题。';
  } catch (error) {
    console.error('DeepSeek API call failed:', error);
    throw error;
  }
}