const blockchainService = require('../services/blockchainService');
const logger = require('../utils/logger');

// Enhanced intents with more keywords
const intents = {
    greeting: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "howdy"],
    auction_rules: ["how does bidding work", "auction rules", "how to bid", "bidding process", "how does auction work", "explain bidding", "what are the rules"],
    place_bid: ["place a bid", "i want to bid", "how to place bid", "make a bid", "submit bid", "enter bid"],
    auction_status: ["auction status", "is auction open", "current auction", "active auction", "live auction", "what is the current"],
    refunds: ["refund", "i lost", "money back", "get my money", "lost bid", "return funds", "withdraw"],
    wallet_help: ["wallet", "metamask", "can't connect wallet", "connect wallet", "wallet issue", "how to connect", "wallet setup"],
    create_account: ["create account", "sign up", "register", "new account", "how to register", "join", "signup"],
    transaction_failed: ["transaction failed", "failed transaction", "error transaction", "tx failed", "couldn't complete", "transaction error"],
    gas_fees: ["gas", "gas fee", "gas price", "transaction fee", "how much gas", "eth fee"],
    nft: ["nft", "non-fungible", "digital asset", "token"],
    seller: ["sell", "seller", "list item", "create auction", "how to sell", "become seller"],
    help: ["help", "support", "assistance", "what can you do", "commands", "options"]
};

// Enhanced responses
const responses = {
    greeting: "👋 Hello! Welcome to the Blockchain Bidding System. I'm here to help you with:\n\n• Auction rules & bidding\n• Wallet connection\n• Live auction status\n• Refunds & transactions\n\nWhat would you like to know?",
    
    auction_rules: "📋 **Auction Rules:**\n\n1. Each auction has a starting price and time limit\n2. You must bid higher than the current highest bid\n3. The minimum bid increment is usually 0.01 ETH\n4. When the timer ends, the highest bidder wins\n5. Winning bids are automatically transferred to the seller\n6. Losing bids are refunded to your wallet\n\nNeed help placing a bid?",
    
    place_bid: "🎯 **How to Place a Bid:**\n\n1. Connect your MetaMask wallet (top right button)\n2. Browse auctions and select an item\n3. Enter your bid amount (must be higher than current bid)\n4. Click 'Place Bid' button\n5. Confirm the transaction in MetaMask\n6. Wait for blockchain confirmation\n\n💡 Tip: Make sure you have enough ETH for the bid + gas fees!",
    
    auction_status: async () => {
        const status = await blockchainService.getCurrentAuctionStatus();
        return `📊 **Auction Status:**\n\n${status}\n\nVisit the Auctions page to see all active listings!`;
    },
    
    refunds: "💰 **Refund Information:**\n\n• Outbid? Your ETH is automatically returned to your wallet\n• Refunds happen within 1-2 block confirmations\n• Check your MetaMask transaction history\n• No action needed - refunds are automatic!\n\n⚠️ Note: Gas fees for your original bid are not refunded.",
    
    wallet_help: "💳 **Wallet Setup Guide:**\n\n1. Install MetaMask extension (metamask.io)\n2. Create or import a wallet\n3. Switch to Sepolia testnet:\n   - Click network dropdown\n   - Select 'Sepolia Test Network'\n4. Get test ETH from sepoliafaucet.com\n5. Click 'Connect Wallet' on our site\n6. Approve the connection in MetaMask\n\n🔄 Still having issues? Try refreshing the page!",
    
    create_account: "👤 **Create an Account:**\n\n1. Click 'Sign Up' on the homepage\n2. Choose account type (Bidder or Seller)\n3. Enter your email and password\n4. Connect your MetaMask wallet\n5. Complete your profile\n\n✅ That's it! You're ready to start bidding!",
    
    transaction_failed: "❌ **Transaction Failed? Here's what to try:**\n\n1. Check if you have enough ETH (bid + gas fees)\n2. Ensure MetaMask is on the correct network (Sepolia)\n3. Try increasing gas price in MetaMask\n4. Wait a few minutes and retry\n5. Clear browser cache and refresh\n\n💡 If the auction ended, the transaction will fail automatically.",
    
    gas_fees: "⛽ **Gas Fees Explained:**\n\n• Gas fees pay for blockchain computation\n• Fees vary based on network congestion\n• Typical bid costs: 0.001-0.005 ETH in gas\n• Higher gas = faster confirmation\n• You can adjust gas in MetaMask settings\n\n💡 On Sepolia testnet, gas fees don't cost real money!",
    
    nft: "🎨 **About NFTs in Our System:**\n\n• Each auction item is represented as an NFT\n• NFTs prove ownership on the blockchain\n• Winning bidders receive the NFT automatically\n• NFTs are stored on Ethereum/Sepolia\n• View your NFTs in 'My NFTs' section\n\nWant to learn more about a specific NFT?",
    
    seller: "🏪 **Become a Seller:**\n\n1. Sign up as a Seller account\n2. Connect your wallet\n3. Go to Seller Dashboard\n4. Click 'Create Auction'\n5. Upload item details and images\n6. Set starting price and duration\n7. Confirm and pay listing fee\n\n💰 Sellers receive payment instantly when auction ends!",
    
    help: "🤖 **I can help you with:**\n\n🎯 **Bidding:** 'How to bid', 'Auction rules'\n📊 **Status:** 'Auction status', 'Current auction'\n💳 **Wallet:** 'Connect wallet', 'MetaMask help'\n💰 **Money:** 'Refunds', 'Gas fees'\n👤 **Account:** 'Create account', 'Sign up'\n🏪 **Selling:** 'How to sell', 'Create auction'\n\nJust type your question!"
};

exports.handleMessage = async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ reply: "Please provide a message." });
    }

    const lowerMessage = message.toLowerCase().trim();
    logger.info(`Received message: ${message}`);

    // Check for matching intent
    for (const intent in intents) {
        const keywords = intents[intent];
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            const reply = typeof responses[intent] === 'function' 
                ? await responses[intent]() 
                : responses[intent];
            
            logger.info(`Matched intent: ${intent}`);
            return res.json({ reply });
        }
    }

    // Default response for unmatched queries
    const defaultReply = "🤔 I'm not sure about that specific question, but I can help with:\n\n• Auction rules and bidding process\n• Wallet connection & MetaMask\n• Live auction status\n• Refunds and transactions\n• Account creation\n• Selling items\n\nTry asking about one of these topics, or type 'help' for more options!";
    
    return res.json({ reply: defaultReply });
};

// Additional endpoint for auction status
exports.getAuctionStatus = async (req, res) => {
    try {
        const status = await blockchainService.getCurrentAuctionStatus();
        return res.json({ status, success: true });
    } catch (error) {
        logger.error('Error fetching auction status:', error);
        return res.status(500).json({ 
            status: 'Unable to fetch auction status', 
            success: false 
        });
    }
};

