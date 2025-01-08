import axios from 'axios';

// The URL for your Flask backend
const API_URL = 'http://127.0.0.1:5000/ask';



export const askQuestion = async (question, chatHistory) => {
  try {
    
    const response = await axios.post(API_URL, {
      question,
      chat_history: chatHistory,
    });
    
      

    return response.data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
};
