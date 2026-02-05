import axios from 'axios';

const CHATBOT_API_URL = 'http://localhost:5000/api/chat';

/**
 * Send a message to the chatbot backend and get a response
 * @param {string} message - The user's message
 * @returns {Promise<string>} - The bot's reply
 */
export const sendMessageToBot = async (message) => {
    try {
        const response = await axios.post(`${CHATBOT_API_URL}/message`, { message });
        return response.data.reply;
    } catch (error) {
        console.error('Chatbot API error:', error);
        throw new Error('Failed to get response from chatbot');
    }
};

/**
 * Get live auction status from the chatbot backend
 * @returns {Promise<object>} - Current auction status
 */
export const getAuctionStatus = async () => {
    try {
        const response = await axios.get(`${CHATBOT_API_URL}/auction-status`);
        return response.data;
    } catch (error) {
        console.error('Auction status error:', error);
        throw new Error('Failed to get auction status');
    }
};

export default {
    sendMessageToBot,
    getAuctionStatus
};
