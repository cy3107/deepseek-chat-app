import { createYoga } from 'graphql-yoga';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

export interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_API_URL: string;
  CHAT_HISTORY?: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const yoga = createYoga({
      typeDefs,
      resolvers,
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
    });

    return yoga.fetch(request, {}, {});
  },
};