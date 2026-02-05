import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css";
import MessageBubble from "./MessageBubble";
import { sendMessageToBot } from "../../services/chatbotService";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "👋 Hi! I'm your AI assistant for the blockchain bidding system. Ask me about:\n\n• Auction rules & how to bid\n• Live auction status\n• Wallet & MetaMask help\n• Refunds & transactions\n• Account setup" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const botReply = await sendMessageToBot(input);
      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Sorry, I'm having trouble connecting. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    const userMessage = { sender: "user", text: action };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botReply = await sendMessageToBot(action);
      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Sorry, I'm having trouble connecting. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div 
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-content">
              <span className="header-icon">🤖</span>
              <div className="header-text">
                <span className="header-title">AI Assistant</span>
                <span className="header-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <MessageBubble key={index} sender={msg.sender} text={msg.text} />
            ))}
            {isLoading && (
              <div className="message bot typing">
                <span className="typing-indicator">
                  <span></span><span></span><span></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button onClick={() => handleQuickAction("How do I place a bid?")}>
              🎯 How to Bid
            </button>
            <button onClick={() => handleQuickAction("What is the current auction status?")}>
              📊 Auction Status
            </button>
            <button onClick={() => handleQuickAction("How do I connect my wallet?")}>
              💳 Wallet Help
            </button>
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about blockchain bidding..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? '...' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

