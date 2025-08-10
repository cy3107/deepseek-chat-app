import { createYoga } from 'graphql-yoga';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { testResolvers } from './test-resolvers';

export interface Env {
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_API_URL?: string;
  CHAT_HISTORY?: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Use test resolvers if API key is not configured
    const useTestMode = !env.DEEPSEEK_API_KEY;
    
    const yoga = createYoga({
      typeDefs,
      resolvers: useTestMode ? testResolvers : resolvers,
      context: () => ({ env, ctx }),
      cors: {
        origin: [
          'http://localhost:3000', 
          'https://zhimahu.work',
          'https://www.zhimahu.work',
          'https://api.zhimahu.work',
          'https://chat.zhimahu.work'
        ],
        credentials: true,
      },
      graphiql: {
        endpoint: '/graphql',
      },
      logging: {
        debug: (...args) => console.log(...args),
        info: (...args) => console.log(...args),
        warn: (...args) => console.warn(...args),
        error: (...args) => console.error(...args),
      },
    });

    try {
      return yoga.fetch(request, {}, {});
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(`Worker Error: ${error}`, { status: 500 });
    }
  },
};