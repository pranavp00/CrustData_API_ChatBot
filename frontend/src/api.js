import axios from 'axios';




export const askQuestion = async (question, chatHistory) => {
  try {
    
    const response = await axios.post('/ask', {
      question,
      chat_history: chatHistory,
    });
    
      

    return response.data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
};
