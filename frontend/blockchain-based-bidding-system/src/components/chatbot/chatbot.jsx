import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./chatbot.css";
import MessageBubble from "./MessageBubble";
import { sendMessageToBot } from "../../services/chatbotService";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const CHAT_URL = import.meta.env.VITE_CHAT_URL || `${API_BASE}/api/chat/message`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "👋 Hi! I'm your AI assistant for the blockchain bidding system."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await axios.post(CHAT_URL, { message: input });
      const botText = resp.data?.reply || "(no response)";

      setMessages(prev => [...prev, { sender: "bot", text: botText }]);
    } catch (err) {
      const errMsg = err.response
        ? `Server error ${err.response.status}`
        : `Network error: ${err.message}`;

      setMessages(prev => [...prev, { sender: "bot", text: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    setMessages(prev => [...prev, { sender: "user", text: action }]);
    setIsLoading(true);

    try {
      const resp = await axios.post(CHAT_URL, { message: action });
      const botText = resp.data?.reply || "(no response)";

      setMessages(prev => [...prev, { sender: "bot", text: botText }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Connection error" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`chatbot-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "💬"}
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>AI Assistant</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <MessageBubble key={i} sender={msg.sender} text={msg.text} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>
              {isLoading ? "..." : "➤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}