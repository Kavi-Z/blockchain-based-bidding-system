import React from "react";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { useChat } from "../hooks/useChat";

const Home = () => {
    const { messages, sendMessage } = useChat();

    return (
        <div className="chat-container">
            <h1>Blockchain Bidding Chatbot</h1>
            <ChatWindow messages={messages} />
            <MessageInput sendMessage={sendMessage} />
        </div>
    );
};

export default Home;
