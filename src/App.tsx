import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client';
import { ChatInterface } from './components/ChatInterface';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <ChatInterface />
      </div>
    </ApolloProvider>
  );
}

export default App;