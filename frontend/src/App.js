import React from 'react';
import Chat from './components/Chat';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <h1>Chat with CrustData API Docs</h1>
      <Chat />
    </div>
  );
};

export default App;
