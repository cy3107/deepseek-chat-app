export interface Env {
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_API_URL?: string;
  CHAT_HISTORY?: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    // Only handle POST requests to /graphql
    const url = new URL(request.url);
    if (url.pathname !== '/graphql') {
      return new Response('Not Found', { status: 404 });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const body = await request.json();
      console.log('GraphQL Request:', body);

      const response = await handleGraphQL(body, env, ctx);
      
      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          ...getCORSHeaders(),
        },
      });
    } catch (error) {
      console.error('Worker Error:', error);
      
      const errorResponse = {
        errors: [{
          message: `Worker Error: ${error.message || error}`,
        }],
      };

      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCORSHeaders(),
        },
      });
    }
  },
};

function handleCORS(): Response {
  return new Response(null, {
    status: 204,
    headers: getCORSHeaders(),
  });
}

function getCORSHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

async function handleGraphQL(body: any, env: Env, ctx: ExecutionContext) {
  const { query, variables, operationName } = body;
  
  console.log('Operation:', operationName);
  console.log('Query:', query);
  console.log('Variables:', variables);

  // Simple resolver for testing
  if (operationName === 'CreateChatSession' || query.includes('createChatSession')) {
    return {
      data: {
        createChatSession: {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __typename: 'ChatSession',
        },
      },
    };
  }

  if (operationName === 'SendMessage' || query.includes('sendMessage')) {
    const message = variables?.message || 'test message';
    const sessionId = variables?.sessionId || Date.now().toString();

    // Test response without API call
    return {
      data: {
        sendMessage: {
          message: `Echo: ${message}`,
          sessionId: sessionId,
          __typename: 'SendMessageResponse',
        },
      },
    };
  }

  if (operationName === 'GetChatHistory' || query.includes('getChatHistory')) {
    return {
      data: {
        getChatHistory: [],
      },
    };
  }

  // Default response for introspection queries
  if (query.includes('__schema') || query.includes('__type') || query.includes('__typename')) {
    return {
      data: {
        __typename: 'Query',
      },
    };
  }

  return {
    errors: [{
      message: `Unknown operation: ${operationName}`,
    }],
  };
}