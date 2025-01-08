import React, { useState } from 'react';
import { askQuestion } from '../api';
import  ChatMessage  from './ChatMessage.js';

const Chat = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput) return;

    

    const newChatHistory = [...chatHistory, { role: 'user', content: userInput }];
    setChatHistory(newChatHistory);
    console.log(newChatHistory);

    try {
      const response = await askQuestion(userInput, newChatHistory);
      setChatHistory([
        ...newChatHistory,
        { role: 'ai', content: response.answer },
      ]);
    } catch (error) {
      console.error('Error with the API:', error);
    }

    setUserInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div key={index} className={message.role}>
            <strong>{message.role === 'user' ? 'You' : 'AI'}:</strong> <ChatMessage message = {message.content}/>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
