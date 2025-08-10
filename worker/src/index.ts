import { createYoga } from 'graphql-yoga';
import { createSchema } from './schema';
import { createContext } from './context';

export interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_API_URL: string;
  CHAT_HISTORY?: KVNamespace;
}

const yoga = createYoga({
  schema: createSchema(),
  context: createContext,
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

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return yoga.fetch(request, { env, ctx });
  },
};