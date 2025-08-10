import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useMutation, useQuery } from '@apollo/client';
import { SEND_MESSAGE, GET_CHAT_HISTORY, CREATE_CHAT_SESSION } from '../graphql/queries';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  sessionId?: string;
}

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [createChatSession] = useMutation(CREATE_CHAT_SESSION);
  
  const { data: chatHistory, refetch: refetchHistory } = useQuery(GET_CHAT_HISTORY, {
    variables: { sessionId: currentSessionId },
    skip: !currentSessionId,
  });

  useEffect(() => {
    if (chatHistory?.getChatHistory) {
      setMessages(chatHistory.getChatHistory.map((msg: any) => ({
        ...msg,
        timestamp: msg.timestamp,
      })));
    }
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = async () => {
    try {
      const { data } = await createChatSession();
      if (data?.createChatSession) {
        setCurrentSessionId(data.createChatSession.id);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error creating new chat session:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    let sessionId = currentSessionId;
    
    if (!sessionId) {
      try {
        const { data } = await createChatSession();
        if (data?.createChatSession) {
          sessionId = data.createChatSession.id;
          setCurrentSessionId(sessionId);
        }
      } catch (error) {
        console.error('Error creating session:', error);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
      sessionId: sessionId || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data } = await sendMessage({
        variables: { 
          message: inputValue,
          sessionId: sessionId
        }
      });

      if (data?.sendMessage) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.sendMessage.message,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          sessionId: data.sendMessage.sessionId,
        };
        setMessages(prev => [...prev, aiMessage]);
        
        if (!currentSessionId) {
          setCurrentSessionId(data.sendMessage.sessionId);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，发生了错误，请稍后重试。',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        sessionId: sessionId || undefined,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-interface ${className || ''}`} style={styles.container}>
      <div style={styles.header}>
        <h2>AI 聊天助手</h2>
        <button onClick={handleNewChat} style={styles.newChatButton}>
          新对话
        </button>
      </div>
      
      <div style={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageWrapper,
              ...(message.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper),
            }}
          >
            <div
              style={{
                ...styles.message,
                ...(message.sender === 'user' ? styles.userMessage : styles.aiMessage),
              }}
            >
              {message.sender === 'ai' ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
            <div style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={styles.loadingWrapper}>
            <div style={styles.loading}>
              AI 正在思考中...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的消息..."
          style={styles.input}
          rows={3}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          style={{
            ...styles.sendButton,
            ...((!inputValue.trim() || isLoading) ? styles.sendButtonDisabled : {}),
          }}
        >
          发送
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #e1e5e9',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  header: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e1e5e9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newChatButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    backgroundColor: '#ffffff',
  },
  messageWrapper: {
    marginBottom: '16px',
  },
  userMessageWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
  },
  aiMessageWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '12px',
    maxWidth: '70%',
    wordWrap: 'break-word' as const,
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  aiMessage: {
    backgroundColor: '#f1f3f4',
    color: '#333',
  },
  timestamp: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
  },
  loadingWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '16px',
  },
  loading: {
    padding: '12px 16px',
    backgroundColor: '#f1f3f4',
    borderRadius: '12px',
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    display: 'flex',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e1e5e9',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    resize: 'none' as const,
    outline: 'none',
  },
  sendButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
};