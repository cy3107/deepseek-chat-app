import { Env } from './index';

export interface Context {
  env: Env;
  executionContext: ExecutionContext;
}

export function createContext({ env, ctx }: { env: Env; ctx: ExecutionContext }): Context {
  return {
    env,
    executionContext: ctx,
  };
}