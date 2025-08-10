import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const WORKER_URL = process.env.REACT_APP_WORKER_URL || 'http://localhost:8787/graphql';

const httpLink = createHttpLink({
  uri: WORKER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getChatHistory: {
            merge: false,
          },
          getChatSessions: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});