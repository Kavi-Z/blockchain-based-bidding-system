# 🎯 Quick Fix Guide - Blockchain Bidding System

## Most Common Issues & Instant Fixes

### 1️⃣ Error: "could not decode result data" / BAD_DATA Error

**What's happening:** Your code is calling the smart contract at an address that doesn't exist on your network.

**How to fix (3 steps):**

#### Step 1: Deploy the Smart Contract
```bash
# Go to smart-contract folder
cd smart-contract

# Start Ganache (if not already running)
ganache --mnemonic "your twelve word phrase"

# Deploy contract (in another terminal)
truffle migrate --network ganache
```

#### Step 2: Copy the Contract Address
Look for this output:
```
✓ Deployed SecureAuction
Contract Address: 0x1234567890abcdef...
```

#### Step 3: Update Frontend
In `src/components/BidderDashboard/bidderdashboard.jsx` (around line 48):
```javascript
const CONTRACT_ADDRESS = "0x1234567890abcdef..."; // PASTE YOUR ADDRESS HERE
```

---

### 2️⃣ Images Not Loading in Auction Cards

**What's happening:** Image URLs are either missing or invalid.

**How to fix:**

#### Option A: Use Database Images
Make sure your MongoDB auction records have `imageUrl`:
```javascript
{
  itemName: "Rare Item",
  imageUrl: "https://valid-url.com/image.jpg"  // ✅ Must be valid URL
}
```

#### Option B: Use IPFS Hash
If using IPFS (Pinata):
```javascript
{
  itemName: "Rare Item",
  imageCID: "QmYourIPFSHash..."  // ✅ Will resolve to IPFS gateway
}
```

#### Option C: Fix in Frontend
If fallback isn't working, add debugging:
```javascript
<img
  src={auction.imageUrl || auction.imageCID || fallbackURL}
  onError={(e) => {
    console.log("Image failed:", auction.imageUrl);
    e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
  }}
/>
```

---

### 3️⃣ Bidder Can't See Auction Values

**What's happening:** Backend isn't returning complete auction data.

**How to check:**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for `/api/auctions` request
4. Click on it → Response tab
5. Should show:
   ```json
   {
     "auctions": [
       {
         "id": "123",
         "itemName": "Test Item",
         "startingPrice": 100,
         "currentHighestBid": 150,
         "imageUrl": "..."
       }
     ]
   }
   ```

**If missing fields:**
- Check backend is running: `mvn spring-boot:run`
- Check MongoDB connection
- Verify auction was created properly

---

### 4️⃣ Highest Bidder Not Showing on Seller Page

**What's happening:** Bid wasn't recorded with bidder info.

**How to fix:**

**When placing a bid:**
1. Make sure MetaMask wallet is connected
2. Bid is placed on blockchain AND saved to backend
3. Backend call includes bidder user ID:
   ```javascript
   {
     auctionId: "123",
     bidAmount: 250,
     bidderWalletAddress: "0xAbcd..."  // ✅ Required
   }
   ```

**Verify bidder was recorded:**
1. After placing bid, refresh seller page
2. Should show "Highest Bidder: username"
3. If not showing, check:
   - User was logged in during bid
   - Backend had user ID in request
   - MongoDB saved bid record

---

### 5️⃣ Can't End Auction on Seller Page

**What's happening:** Auction end button only appears when auction time has elapsed.

**How to check:**

1. **Does countdown show "Ended"?** 
   - Yes → Button should appear
   - No → Wait for timer to finish

2. **Button still not showing?**
   - Check auction status is still "ACTIVE"
   - Verify current time > endTime in database

3. **To manually set auction end time (for testing):**
   ```bash
   # Use MongoDB to set endTime to past
   db.auctions.updateOne(
     { _id: ObjectId("...") },
     { $set: { endTime: ISODate("2025-01-01") } }
   )
   ```

---

### 6️⃣ Where Did the "My Auction Victories" Page Go?

**It's a new page!** Here's how to access it:

1. **From Bidder Dashboard:**
   - Click button: "🏆 My Auction Victories & Bids"

2. **Direct URL:**
   - `http://localhost:5173/bidders-info`

3. **What you'll see:**
   - All auctions where YOU are the highest bidder
   - Filter to show only won auctions
   - Your bid amounts
   - Option to claim NFT certificate

---

## 🚨 Emergency Debug Checklist

Run through this if nothing works:

- [ ] Ganache running? `ganache --mnemonic "..."`
- [ ] MongoDB running? 
  - Windows: `mongod --dbpath "C:\data\db"`
  - Cloud: Check connection string
- [ ] Backend running? `mvn spring-boot:run` in backend folder
- [ ] Frontend running? `npm run dev` in frontend folder
- [ ] Smart contract deployed? Check address in BidderDashboard.jsx
- [ ] MetaMask installed and connected?
- [ ] Network correct in MetaMask? (Should match Ganache)
- [ ] User logged in as BIDDER/SELLER?

---

## 📋 Smart Contract Deployment Cheat Sheet

```bash
# Terminal 1: Start blockchain
cd smart-contract
ganache --mnemonic "your twelve word phrase"

# Terminal 2: Deploy contract
cd smart-contract
npm install  # if first time
truffle migrate --network ganache

# Copy printed address to BidderDashboard.jsx
```

**Success looks like:**
```
   Deploying 'SecureAuction'
   ↓ Migrations
✅ SecureAuction: 0x1234567890abcdef...
```

---

## 🎓 Key Files to Know

| File | Purpose | Edit For |
|------|---------|----------|
| `BidderDashboard/bidderdashboard.jsx` | Main bidding interface | Contract address, error handling |
| `BiddersInfo/BiddersInfo.jsx` | Won auctions page | Filter logic, display format |
| `seller_page/seller_page.jsx` | Seller auction management | End auction flow |
| `AuctionController.java` | Backend auction endpoints | Business logic, validation |
| `AuctionService.java` | Database operations | Auction fetching/updating |
| `.env` or environment | Config values | API endpoints, addresses |

---

## 🧪 Quick Test

**Test if auction display works:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Paste:
```javascript
fetch('http://localhost:8080/api/auctions', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
}).then(r => r.json()).then(d => console.log(d))
```
4. Should show your auctions

---

## 💡 Pro Tips

1. **Check logs constantly:**
   - Backend console shows database queries
   - Browser console shows JavaScript errors
   - Network tab shows API responses

2. **When stuck:**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Restart backend and frontend
   - Check that timestamps are correct

3. **Testing bids:**
   - Create multiple test accounts (BIDDER role)
   - Place bids from different accounts
   - Verify highest bidder updates

4. **Debug contract calls:**
   - Check fallback lookup in browser console
   - Verify contract address exists: `truffle networks`
   - Check contract ABI matches deployment

---

**Last Updated:** February 19, 2026  
**Emergency Support:** Check FIXES_COMPREHENSIVE.md for detailed guide
