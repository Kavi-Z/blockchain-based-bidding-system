# Bidding System - Complete Setup & Testing Guide

## Quick Demo Checklist

This guide helps verify all fixes are working correctly before your demonstration.

### Prerequisites
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:5173` (or `3000`)
- MetaMask wallet connected with test funds
- MongoDB connected with proper credentials
- Pinata API keys configured in `application.properties`

---

## 1. BACKEND STARTUP

### Verify Backend is Running
```bash
# In backend directory: cryptops/
mvn spring-boot:run

# Should see:
# - Started CryptopsApplication in X seconds
# - Server running at http://localhost:8080
```

### Check Key Endpoints
- GET `/api/auctions` → Should return list of auctions
- GET `/api/auctions/seller/{userId}` → Should return seller's auctions
- GET `/api/auction/upload/image` → Should exist (POST for uploads)
- POST `/api/bids` → Should accept bid requests
- GET `/api/bids/auction/{auctionId}` → Should return bid history

---

## 2. FRONTEND STARTUP

### Start Development Server
```bash
# In frontend directory: blockchain-based-bidding-system/
npm run dev

# Access at http://localhost:5173
```

---

## 3. TESTING FLOW (Seller Perspective)

### Step 1: Login as Seller
1. Navigate to **Seller Login** page
2. Login with seller credentials
3. Verify redirect to **Seller Dashboard** (`/seller-dashboard`)

### Step 2: Create Auction
1. Click **"➕ Create New Auction"** button
2. Fill in auction details:
   - Item Name: `Test Item`
   - Description: `This is a test item for the auction system`
   - Starting Price: `10.00`
   - Bidding Time: `60` minutes (not multiplied by 60)
   - Min Increment: `0.1`
   - Extension Time: `15` minutes
   - Max Bid: (optional) `100.00`

3. **Upload Image**:
   - Click "Choose Image"
   - Select a JPG/PNG file (under 10MB)
   - Click "Upload Image to Pinata"
   - Verify: ✅ "Image uploaded successfully!" appears

4. **Connect Wallet**:
   - Click "Connect MetaMask"
   - Approve in MetaMask popup
   - Verify wallet address displays

5. **Create Auction**:
   - Click "Create Auction"
   - Approve transaction in MetaMask
   - Verify: ✅ "Auction created successfully" message
   - Auto-redirect to Seller Dashboard

### Step 3: Verify Auction in Dashboard
1. On **Seller Dashboard**, verify new auction appears in grid
2. Verify auction card shows:
   - ✅ Item image (uploaded to Pinata)
   - ✅ Item name
   - ✅ Starting price
   - ✅ Current highest bid (initially = starting price)
   - ✅ ACTIVE status badge
   - ✅ Real-time countdown timer

### Step 4: Click "View Details"
1. Click **"View Details →"** button on auction card
2. Verify redirects to `/auction/{auctionId}`
3. Verify AuctionDetails page shows:
   - ✅ Full item image (from Pinata)
   - ✅ Full description
   - ✅ All auction details (status, prices, times, etc.)
   - ✅ "Bidding History" section (currently empty - no bids yet)
   - ✅ Blockchain information (contract address, transaction hash, etc.)

---

## 4. TESTING FLOW (Bidder Perspective)

### Step 1: Login as Bidder
1. Open new browser tab/incognito window
2. Navigate to **Bidder Dashboard** (`/bidder-dashboard`)
3. Login with bidder credentials

### Step 2: View Available Auctions
1. Verify auction appears in grid
2. Verify all auction details display correctly

### Step 3: Place a Bid
1. Click on auction card to view details
2. In bidding section:
   - Current highest bid: `$10.00`
   - Minimum bid required: `$10.10` (starting price + min increment)
   - Enter bid amount: `15.00`
3. Click "Place Bid"
4. Approve transaction in MetaMask
5. Verify: ✅ "Bid placed successfully!" message

### Step 4: Verify Bid Saved
1. Console should show bid saving confirmation
2. Verify bid stored in database

---

## 5. VERIFY REAL-TIME UPDATES (Seller Dashboard)

### On Seller Dashboard (Open/Refresh)
1. The dashboard **auto-refreshes every 5 seconds** (polling)
2. After bidder places bid:
   - **Current Highest Bid** updates to `$15.00` ✅
   - **Highest Bidder** updates to bidder's username ✅
   - **Countdown** continues ticking in real-time ✅

### On Auction Details Page
1. Click "View Details" again for same auction
2. Refresh or wait 5 seconds
3. Verify **Bidding History** section shows:
   - Rank #1
   - Bidder wallet address
   - Bid amount: `$15.00`
   - Timestamp
   - Transaction hash

---

## 6. KEY FEATURES VERIFICATION

### Feature: Image Upload
- ✅ Images upload to Pinata IPFS
- ✅ Images display correctly in auction card and details page
- ✅ IPFS URLs accessible from Pinata gateway
- Fallback: If Pinata fails, saves to local storage

### Feature: Bid Saving
- ✅ Bids saved to MongoDB database
- ✅ BidController properly validates:
  - Bid amount > currentHighestBid + minIncrement
  - Bid amount <= maxBid (if set)
  - Auction is ACTIVE
  - Current time < auction end time
- ✅ Auction updated with new highest bid and bidder info

### Feature: Auto-Extension
- When bidder places bid within `extensionTime` minutes of auction end:
  - Auction end time extends by `extensionTime` minutes
  - User sees updated countdown

### Feature: Real-Time Updates
- ✅ Seller dashboard polls every 5 seconds
- ✅ Bid history loads from `/api/bids/auction/{auctionId}`
- ✅ All bid data persists in database

---

## 7. BACKEND API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose | Expected Response |
|--------|----------|---------|-------------------|
| POST | `/api/auctions` | Create auction | `{ success: true, auction: {...} }` |
| GET | `/api/auctions` | List all auctions | `{ success: true, auctions: [...] }` |
| GET | `/api/auctions/{id}` | Get auction details | `{ success: true, auction: {...} }` |
| GET | `/api/auctions/seller/{id}` | Get seller's auctions | `{ success: true, auctions: [...] }` |
| POST | `/api/auction/upload/image` | Upload image to Pinata | `{ success: true, imageUrl: "..." }` |
| POST | `/api/bids` | Place bid | `{ success: true, bid: {...} }` |
| GET | `/api/bids/auction/{id}` | Get auction's bids | `{ success: true, bids: [...] }` |
| GET | `/api/bids/{id}` | Get specific bid | `{ success: true, bid: {...} }` |

---

## 8. TROUBLESHOOTING

### Issue: Image Upload Returns 400 or fails
**Solution**: 
- Check file size (max 10MB)
- Check file type (JPEG, PNG, GIF, WebP)
- Verify Pinata API keys in `application.properties`:
  ```properties
  pinata.api.key=your_api_key
  pinata.secret.key=your_secret_key
  ```

### Issue: Bid not saving to database
**Solution**:
- Check `/api/bids` endpoint returns 200
- Verify MongoDB connection
- Check browser console for error messages
- Verify auction status is "ACTIVE"
- Verify bid amount is valid (> currentHighestBid + minIncrement)

### Issue: Real-time updates not working
**Solution**:
- Check network tab - polling should show requests every 5 seconds
- Verify `/api/auctions/seller/{id}` returns latest auction data
- Clear browser cache and refresh

### Issue: MetaMask transaction fails
**Solution**:
- Check you have test ETH in wallet
- Verify contract address: `0xD19A4cfF92E1F5F2B63446E3506205e9720793d6`
- Check smart contract has proper funds handling

### Issue: Auction not appearing in seller dashboard
**Solution**:
- Verify you're logged in as the correct seller
- Check MongoDB contains the auction record
- Verify seller ID in localStorage matches user account

---

## 9. FINAL VERIFICATION CHECKLIST

Before demonstration:

- [ ] Backend compiles and runs without errors
- [ ] Frontend starts without console errors
- [ ] Can login as seller
- [ ] Can create auction with image upload
- [ ] Image displays correctly in dashboard
- [ ] Can click "View Details" and see auction details page
- [ ] Bidding history page loads correctly (empty initially)
- [ ] Can login as bidder
- [ ] Can place a bid
- [ ] Bid appears in seller's dashboard within 5 seconds
- [ ] Bid appears in auction details page bid history
- [ ] Can place multiple bids and see them all in history
- [ ] Auction auto-extends when bid placed near end time
- [ ] Countdown timer updates in real-time
- [ ] All blockchain info displays correctly

---

## 10. CODE CHANGES SUMMARY

### Frontend Components
- **AuctionCreate.jsx**: Fixed biddingTime/extensionTime (removed *60), proper image upload
- **BidderDashboard.jsx**: Fixed contract calls, added blockchain ID lookup, comprehensive bid validation
- **seller_page.jsx**: Added polling every 5 seconds for real-time updates, navigation to `/auction/{auctionId}`
- **AuctionDetails.jsx** (NEW): Displays auction details and complete bid history with timestamps
- **auction_details.css** (NEW): Responsive styling for details page

### Backend Classes
- **BidController.java** (NEW): Handles bid placement, validation, and history retrieval
- **BidRequest.java** (NEW): DTO for bid submission
- **AuctionController.java**: Updated `convertToResponse()` to include blockchain fields
- **PinataService.java**: Handles image upload to IPFS
- **AuctionUploadController.java**: API endpoint for image uploads with Pinata fallback

---

## 11. RUNNING THE COMPLETE DEMO

```bash
# Terminal 1: Start Backend
cd backend/cryptops
mvn spring-boot:run

# Terminal 2: Start Frontend
cd frontend/blockchain-based-bidding-system
npm run dev

# Open http://localhost:5173 in browser
```

**Demo Flow** (5-10 minutes):
1. Shows seller creating auction with image (2 min)
2. Shows auction on dashboard with real-time countdown (1 min)
3. Shows details page with bid history (1 min)
4. Opens second browser (bidder), places bid (2 min)
5. Shows bid appearing in real-time on seller dashboard (1 min)
6. Shows bid in auction details page bid history (1 min)

---

## Questions or Issues?

All major bugs fixed:
- ✅ Bids are saved to database
- ✅ Bids are displayed in real-time (5-second polling)
- ✅ Bid history visible in auction details page
- ✅ Images upload to Pinata IPFS
- ✅ Highest bidder tracked and displayed
- ✅ Auto-extension when bids placed near end time
- ✅ Real-time countdown timer working

Good luck with your demonstration! 🚀
