export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS for all requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders 
      });
    }

    // Simple test for any path
    if (url.pathname === '/test') {
      return new Response('Worker is working!', {
        headers: {
          'Content-Type': 'text/plain',
          ...corsHeaders,
        },
      });
    }

    // Handle GraphQL endpoint
    if (url.pathname === '/graphql') {
      try {
        if (request.method !== 'POST') {
          return new Response('Method not allowed', { 
            status: 405,
            headers: corsHeaders,
          });
        }

        const body = await request.json();
        console.log('GraphQL request:', body);

        // Simple GraphQL response
        const response = {
          data: {
            test: "GraphQL working!",
            createChatSession: {
              id: "test-session-" + Date.now(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            sendMessage: {
              message: "Echo: test message",
              sessionId: "test-session-" + Date.now(),
            }
          }
        };

        return new Response(JSON.stringify(response), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });

      } catch (error) {
        console.error('GraphQL error:', error);
        return new Response(JSON.stringify({
          errors: [{ message: 'Internal server error: ' + error.message }]
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }
    }

    // Default response
    return new Response('Hello from Cloudflare Worker!', {
      headers: {
        'Content-Type': 'text/plain',
        ...corsHeaders,
      },
    });
  },
};