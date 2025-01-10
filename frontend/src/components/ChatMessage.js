import React from "react";
import CodeBlock from "./CodeBlock";

const ChatMessage = ({ message }) => {

  const parseMessage = (message) => {
      const regex = /```(\w+)?\n([\s\S]*?)```/g;
      const parts = [];
      let lastIndex = 0;
      let match;
    
      while ((match = regex.exec(message)) !== null) {
        const [fullMatch, language, code] = match;
        const startIndex = match.index;
    
        // Add text before the code block
        if (startIndex > lastIndex) {
          parts.push({ type: "text", content: message.slice(lastIndex, startIndex).trim() });
        }
    
        // Add code block
        parts.push({ type: "code", content: code.trim(), language: language || "text" });
    
        lastIndex = regex.lastIndex;
      }
    
      // Add remaining text
      // if (lastIndex < message.length) {
      //   parts.push({ type: "text", content: message.slice(lastIndex).trim() });
      // }
      // Add remaining text
      if (message && typeof message === 'string' && lastIndex < message.length) {
        parts.push({ type: "text", content: message.slice(lastIndex).trim() });
      } else if (message && typeof message !== 'string'){
        console.error("Message is not a string:", message);
    // Handle the case where message is not a string appropriately
      }
      else {
        console.warn("Message is undefined or null, skipping text addition.");
    // Handle the case where message is undefined or null appropriately (e.g., don't add anything, add a placeholder)
      }

return parts;
    
      
    };
  const parts = parseMessage(message);

  return (
    <div>
      {parts.map((part, index) =>
        part.type === "code" ? (
          <CodeBlock key={index} language={part.language} code={part.content} />
        ) : (
          <p key={index}>{part.content}</p>
        )
      )}
    </div>
  );
};

export default ChatMessage;
