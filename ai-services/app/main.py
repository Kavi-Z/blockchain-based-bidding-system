import sys
import os
import traceback

sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import threading
import uuid
from datetime import datetime
from google import genai
from config import GEMINI_API_KEY

# Print API key status
print(f"API Key loaded: {GEMINI_API_KEY[:10]}..." if GEMINI_API_KEY else "API Key is MISSING!")

# Clear proxy environment variables to bypass system proxy
for proxy_var in ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'ALL_PROXY', 'all_proxy', 'NO_PROXY', 'no_proxy']:
    os.environ.pop(proxy_var, None)

# Set NO_PROXY to bypass proxy for Google APIs
os.environ['NO_PROXY'] = 'generativelanguage.googleapis.com,*.googleapis.com'

# Configure Gemini API client with increased timeout
client = genai.Client(api_key=GEMINI_API_KEY, http_options={"timeout": 120000})

# Initialize FastAPI app
app = FastAPI(title="Blockchain Bidding Chatbot API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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

        user_text = request.message.strip()
        lower = user_text.lower()

        # Detect whether the user is asking about auctions so we can include live data
        auction_triggers = [
            "auction", "bid", "current price", "highest bidder", "highest bid",
            "list auctions", "show auctions", "what is the current price", "who is the highest"
        ]

        auction_context = ""
        if any(t in lower for t in auction_triggers):
            # Try to find a matching auction by ID or title keywords
            matched = []
            with auctions_lock:
                # direct id match (if user pasted an id-like token)
                for aid, a in auctions.items():
                    if aid in lower:
                        matched = [a]
                        break

                # if no direct id match, try title substring match
                if not matched:
                    for aid, a in auctions.items():
                        title = (a.get("title") or "").lower()
                        # match if any significant word appears
                        for w in title.split():
                            if w and w in lower:
                                matched.append(a)
                                break

                # fallback: include up to 5 active auctions
                if not matched:
                    matched = [a for a in auctions.values() if a.get("is_active")][:5]

            if matched:
                lines = ["Live auction data (up to 5):"]
                for a in matched:
                    lines.append(f"- ID: {a['id']} | Title: {a['title']} | Current: {a['current_price']} | Highest: {a.get('highest_bidder') or 'None'} | Active: {a['is_active']}")
                auction_context = "\n".join(lines)
            else:
                auction_context = "Live auction data: no active auctions found."

        # Build final prompt, injecting auction_context when present
        if auction_context:
            full_prompt = f"{SYSTEM_PROMPT}\n\n{auction_context}\n\nUser Question: {user_text}\n\nAssistant:"
        else:
            full_prompt = f"{SYSTEM_PROMPT}\n\nUser Question: {user_text}\n\nAssistant:"

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


# --- Simple in-memory auction management (for sprint/demo) ---
auctions_lock = threading.Lock()
auctions = {}

class AuctionCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    starting_bid: float
    ends_at: Optional[datetime] = None
    seller: Optional[str] = "anonymous"

class Auction(BaseModel):
    id: str
    title: str
    description: Optional[str]
    starting_bid: float
    current_price: float
    highest_bidder: Optional[str]
    ends_at: Optional[datetime]
    is_active: bool
    bids: List[dict]

class BidRequest(BaseModel):
    bidder: str
    amount: float

@app.post("/api/auctions", response_model=Auction)
def create_auction(a: AuctionCreate):
    with auctions_lock:
        aid = str(uuid.uuid4())
        auction = {
            "id": aid,
            "title": a.title,
            "description": a.description,
            "starting_bid": a.starting_bid,
            "current_price": a.starting_bid,
            "highest_bidder": None,
            "ends_at": a.ends_at,
            "is_active": True,
            "bids": [],
        }
        auctions[aid] = auction
    return auction

@app.get("/api/auctions", response_model=List[Auction])
def list_auctions():
    with auctions_lock:
        return list(auctions.values())

@app.get("/api/auctions/{auction_id}", response_model=Auction)
def get_auction(auction_id: str):
    with auctions_lock:
        auc = auctions.get(auction_id)
        if not auc:
            raise HTTPException(status_code=404, detail="Auction not found")
        return auc

@app.post("/api/auctions/{auction_id}/bid")
def place_bid(auction_id: str, bid: BidRequest):
    with auctions_lock:
        auc = auctions.get(auction_id)
        if not auc:
            raise HTTPException(status_code=404, detail="Auction not found")
        if not auc["is_active"]:
            raise HTTPException(status_code=400, detail="Auction is closed")
        if bid.amount <= auc["current_price"]:
            raise HTTPException(status_code=400, detail=f"Bid must be greater than current price ({auc['current_price']})")

        # record bid
        bid_entry = {"bidder": bid.bidder, "amount": bid.amount, "timestamp": datetime.utcnow().isoformat()}
        auc["bids"].append(bid_entry)
        auc["current_price"] = bid.amount
        auc["highest_bidder"] = bid.bidder

    return {"status": "ok", "auction_id": auction_id, "current_price": auc["current_price"], "highest_bidder": auc["highest_bidder"]}

@app.post("/api/auctions/{auction_id}/close")
def close_auction(auction_id: str):
    with auctions_lock:
        auc = auctions.get(auction_id)
        if not auc:
            raise HTTPException(status_code=404, detail="Auction not found")
        auc["is_active"] = False
    return {"status": "closed", "auction_id": auction_id}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "chatbot-api"}