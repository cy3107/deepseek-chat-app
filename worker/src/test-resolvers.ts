// Temporary test resolvers without KV dependency
export const testResolvers = {
  Query: {
    getChatHistory: () => [],
    getChatSessions: () => [],
  },
  Mutation: {
    createChatSession: () => ({
      id: Date.now().toString(),
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    
    sendMessage: async (_: any, { message }: { message: string }) => {
      // Simple test response without DeepSeek API
      return {
        message: `Echo: ${message}`,
        sessionId: Date.now().toString(),
      };
    },
    
    deleteChatSession: () => true,
  },
};