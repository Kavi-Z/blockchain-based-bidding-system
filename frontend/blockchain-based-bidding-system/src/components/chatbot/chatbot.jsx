import React, { useState } from "react";
import axios from "axios";
import "./chatbot.css";
import MessageBubble from "./MessageBubble"; // Keep exact casing

// base URL for chatbot backend; can be overridden with VITE_API_BASE
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
// full endpoint (can include path). env var VITE_CHAT_URL takes precedence.
const CHAT_URL = import.meta.env.VITE_CHAT_URL || `${API_BASE}/api/chat/message`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me about our blockchain bidding system." }
  ]);
  const [input, setInput] = useState("");

  // ref to scroll chat window down when new messages arrive
  const messagesEndRef = React.useRef(null);
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      console.log("chatbot: sending message to", CHAT_URL);
      const resp = await axios.post(CHAT_URL, { message: input });
      const botText = resp.data?.reply || resp.data?.answer || "(no response)";
      setMessages(prev => [...prev, { sender: "bot", text: botText }]);
    } catch (err) {
      console.error("chatbot request failed", err);
      // show error details so user knows if it's a network vs. server issue
      const errMsg = err.response ?
        `⚠️ Server error ${err.response.status}: ${err.response.statusText}` :
        `⚠️ Network error: ${err.message}`;
      setMessages(prev => [...prev, { sender: "bot", text: errMsg }]);
    }

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
            <div ref={messagesEndRef} />
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
