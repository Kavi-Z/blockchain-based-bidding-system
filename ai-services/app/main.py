import sys
import os
import traceback

sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from config import GEMINI_API_KEY

# Print API key status
print(f"API Key loaded: {GEMINI_API_KEY[:10]}..." if GEMINI_API_KEY else "API Key is MISSING!")

# Configure Gemini API
client = genai.Client(api_key=GEMINI_API_KEY)

# Initialize FastAPI app
app = FastAPI(title="Blockchain Bidding Chatbot API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# System prompt for blockchain bidding context
SYSTEM_PROMPT = """
You are a helpful AI assistant for a blockchain-based bidding system.

About the System:
- This is a decentralized auction platform built on blockchain technology
- Users can participate in secure and transparent auctions
- There are two types of users: sellers and bidders
- Sellers upload items or NFTs for auction
- Bidders place bids on those items
- Every bid is recorded on the blockchain through smart contracts
- The system prevents bid manipulation - once a bid is placed, it cannot be changed
- When auction ends, the smart contract automatically determines the highest bidder

Key Features:
- MetaMask wallet integration for transactions
- Smart contracts ensure fairness and transparency
- Real-time bid updates
- Secure authentication system

How to Place a Bid:
1. Connect your MetaMask wallet by clicking "Connect Wallet"
2. Browse the available auctions on the home page
3. Click on an auction to view details
4. Enter your bid amount (must be higher than current highest bid)
5. Click "Place Bid" and confirm the transaction in MetaMask
6. Your bid is now recorded on the blockchain

Wallet & MetaMask Help:
- Download MetaMask from metamask.io
- Create a new wallet or import existing one
- Connect to the correct network (Ethereum/Polygon)
- Ensure you have enough ETH/MATIC for gas fees
- Click "Connect Wallet" on our platform

Refunds:
- If you are outbid, your previous bid amount is available for withdrawal
- Go to your profile and click "Withdraw Funds"
- Confirm the transaction in MetaMask
- Funds will be returned to your wallet

Answer questions helpfully and concisely about the bidding system.
If asked about specific auction details, mention that users should check the auction page.
"""

class MessageRequest(BaseModel):
    message: str

class MessageResponse(BaseModel):
    reply: str

@app.get("/")
async def root():
    return {"message": "Blockchain Bidding Chatbot API is running!"}

@app.post("/api/chat/message", response_model=MessageResponse)
async def chat_message(request: MessageRequest):
    try:
        if not request.message.strip():
            return MessageResponse(reply="Please enter a message.")

        full_prompt = f"{SYSTEM_PROMPT}\n\nUser Question: {request.message}\n\nAssistant:"

        print(f"Sending request to Gemini...")
        
        # Use gemini-2.5-flash - this model works!
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt,
        )

        print(f"Response received successfully!")
        
        reply_text = response.text if response.text else "I apologize, but I couldn't generate a response."

        return MessageResponse(reply=reply_text)

    except Exception as e:
        print(f"=" * 50)
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        traceback.print_exc()
        print(f"=" * 50)
        return MessageResponse(reply="Sorry, I'm having trouble right now. Please try again later.")

@app.get("/api/chat/auction-status")
async def get_auction_status():
    return {
        "activeAuctions": 5,
        "totalBids": 127,
        "message": "Auctions are running normally",
        "status": "online"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "chatbot-api"}
