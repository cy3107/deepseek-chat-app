import { resolvers } from './resolvers';

export const typeDefs = `
  type Message {
    id: ID!
    content: String!
    sender: String!
    timestamp: String!
    sessionId: String
  }

  type ChatSession {
    id: ID!
    messages: [Message!]!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getChatHistory(sessionId: String): [Message!]!
    getChatSessions: [ChatSession!]!
  }

  type Mutation {
    sendMessage(message: String!, sessionId: String): SendMessageResponse!
    createChatSession: ChatSession!
    deleteChatSession(sessionId: String!): Boolean!
  }

  type SendMessageResponse {
    message: String!
    sessionId: String!
  }
`;

export function createSchema() {
  return {
    typeDefs,
    resolvers
  };
}