import React from "react";
import "./chatbot.css";

export default function MessageBubble({ sender, text }) {
  return (
    <div className={`message ${sender}`}>
      {text}
    </div>
  );
}
