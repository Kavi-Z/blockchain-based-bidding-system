import React, { useState } from "react";
import "./chatbot.css";
import MessageBubble from "./MessageBubble"; // Keep exact casing

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me about our blockchain bidding system." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    // Temporary bot reply (AI will come later)
    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: "AI integration coming soon. I'm learning about the system!"
      };
      setMessages(prev => [...prev, botReply]);
    }, 500);

    setInput("");
  };

  return (
    <>
      <div className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">AI Assistant</div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <MessageBubble key={index} sender={msg.sender} text={msg.text} />
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about blockchain bidding..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
