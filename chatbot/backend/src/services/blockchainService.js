// Blockchain service to fetch auction status from backend or smart contract
const axios = require('axios');

// Configure your main backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

/**
 * Get the current auction status from the main backend or blockchain
 * @returns {Promise<string>} - Status message for the chatbot
 */
exports.getCurrentAuctionStatus = async () => {
    try {
        // Try to fetch from your main Node.js backend
        const response = await axios.get(`${BACKEND_URL}/api/auctions/current`, {
            timeout: 5000 // 5 second timeout
        });
        
        const auction = response.data;
        
        if (!auction || Object.keys(auction).length === 0) {
            return "📭 No active auctions at the moment. Check back soon for new listings!";
        }
        
        // Format the response based on auction data
        const status = auction.isActive ? '🟢 Active' : '🔴 Ended';
        const highestBid = auction.highestBid || '0';
        const itemName = auction.itemName || 'Unnamed Item';
        const remainingTime = auction.remainingTime || 'N/A';
        
        return `${status}\n\n🎨 Item: ${itemName}\n💰 Highest Bid: ${highestBid} ETH\n⏰ Time Remaining: ${remainingTime}\n👤 Bidders: ${auction.bidCount || 0}`;
        
    } catch (error) {
        console.error('Error fetching auction status:', error.message);
        
        // Return a helpful message when backend is unavailable
        // In production, you could also try fetching directly from the blockchain
        return "📊 Live auction data is temporarily unavailable.\n\n💡 Please visit the Auctions page to see current listings and their status in real-time!";
    }
};

/**
 * Get auction by ID (for future use)
 * @param {string} auctionId - The auction ID
 * @returns {Promise<object>} - Auction details
 */
exports.getAuctionById = async (auctionId) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/auctions/${auctionId}`, {
            timeout: 5000
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching auction by ID:', error.message);
        throw new Error('Unable to fetch auction details');
    }
};

/**
 * Check if a user has placed a bid (for future use)
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<object>} - User's bidding history
 */
exports.getUserBids = async (walletAddress) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/bids/user/${walletAddress}`, {
            timeout: 5000
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user bids:', error.message);
        throw new Error('Unable to fetch bidding history');
    }
};

