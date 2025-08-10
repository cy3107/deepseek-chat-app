import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation SendMessage($message: String!, $sessionId: String) {
    sendMessage(message: $message, sessionId: $sessionId) {
      message
      sessionId
    }
  }
`;

export const GET_CHAT_HISTORY = gql`
  query GetChatHistory($sessionId: String) {
    getChatHistory(sessionId: $sessionId) {
      id
      content
      sender
      timestamp
      sessionId
    }
  }
`;

export const CREATE_CHAT_SESSION = gql`
  mutation CreateChatSession {
    createChatSession {
      id
      createdAt
      updatedAt
    }
  }
`;

export const GET_CHAT_SESSIONS = gql`
  query GetChatSessions {
    getChatSessions {
      id
      createdAt
      updatedAt
      messages {
        id
        content
        sender
        timestamp
      }
    }
  }
`;

export const DELETE_CHAT_SESSION = gql`
  mutation DeleteChatSession($sessionId: String!) {
    deleteChatSession(sessionId: $sessionId)
  }
`;