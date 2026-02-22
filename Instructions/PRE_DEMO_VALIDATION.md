# PRE-DEMO VALIDATION CHECKLIST

Complete this checklist 30 minutes before your demonstration to ensure everything is working.

---

## ✅ SECTION 1: ENVIRONMENT SETUP

### Backend Services
- [ ] Java installed: Open terminal, run `java -version` (should show version 11+)
- [ ] Maven installed: Run `mvn -version` (should show version 3+)
- [ ] MongoDB Connected: Check connection string in `application.properties`
- [ ] Pinata API Keys: Verify keys are set in `application.properties`

### Frontend Services
- [ ] Node.js installed: Run `node -version` (should show v16+)
- [ ] npm installed: Run `npm -version` (should show v8+)

### Network Requirements
- [ ] Internet connection working (needed for Pinata and blockchain)
- [ ] MetaMask browser extension installed
- [ ] MetaMask test account with test ETH available

---

## ✅ SECTION 2: BACKEND STARTUP

### Start Backend
```bash
cd c:\Users\kavin\Desktop\Bchain\bidding_system\backend\cryptops
mvn clean compile
mvn spring-boot:run
```

### Verify Backend Running
- [ ] No compilation errors in terminal
- [ ] Sees message: "Started CryptopsApplication in X.XXX seconds"
- [ ] No port 8080 already in use error
- [ ] Logs show "Tomcat started on port(s): 8080"

### Test Backend Connectivity
```bash
# In another terminal, test:
curl http://localhost:8080/api/auctions
```

- [ ] Returns valid JSON response: `{"success": true, "count": X, "auctions": [...]}`
- [ ] Not security/CORS error (should work due to configuration)

---

## ✅ SECTION 3: FRONTEND STARTUP

### Install Dependencies
```bash
cd c:\Users\kavin\Desktop\Bchain\bidding_system\frontend\blockchain-based-bidding-system
npm install
```

- [ ] Installation completes without "ERR!" errors
- [ ] node_modules folder created
- [ ] package-lock.json generated

### Start Frontend
```bash
npm run dev
```

- [ ] No compilation errors
- [ ] Sees message like "VITE v X.X.X  ready in XXX ms"
- [ ] Shows "Local: http://localhost:5173"
- [ ] No EADDRINUSE or port errors

### Test Frontend Loading
```
1. Open http://localhost:5173 in browser
2. Should see landing page with:
   - Navigation bar (Bidder/Seller Login)
   - Auction item images
   - Call-to-action buttons
3. No console errors (F12 → Console tab)
```

- [ ] Page loads without errors
- [ ] Images display properly
- [ ] Navigation links work
- [ ] MetaMask notification may appear (normal)

---

## ✅ SECTION 4: AUTHENTICATION

### Seller Account
```
1. Click "Seller Login" in navigation
2. Enter seller credentials (from your test account)
3. Click "Sign In"
```

- [ ] Redirects to "/seller-dashboard" 
- [ ] Shows seller name in greeting
- [ ] Dashboard loads without errors

### Bidder Account
```
1. Click "Bidder Dashboard"
2. Enter bidder credentials (from your test account)
3. Click "Sign In"
```

- [ ] Redirects to "/bidder-dashboard"
- [ ] Shows bidder name
- [ ] Lists available auctions

---

## ✅ SECTION 5: CREATE AUCTION FLOW

### As Seller Account
```
1. Click "➕ Create New Auction" button
2. Fill form:
   - Item Name: "Test Item for Demo"
   - Description: "This is a test auction to demonstrate the bidding system with real-time updates and IPFS image storage."
   - Starting Price: 10.00
   - Bidding Time: 60 (minutes)
   - Min Increment: 0.1
   - Extension Time: 15 (minutes)
   - Max Bid: (leave empty or 100)
```

- [ ] Form accepts all inputs
- [ ] No validation errors appear

### Upload Image
```
3. Click file picker
4. Select a JPG or PNG file (test image)
5. Click "Upload Image to Pinata"
```

- [ ] Image preview appears
- [ ] Upload button becomes active
- [ ] Sees "Image uploaded successfully!" message within 10 seconds
- [ ] URL appears in "Image CID" field (starts with http://...)

### Configure Blockchain
```
6. Click "Connect MetaMask"
7. Approve connection in MetaMask popup
```

- [ ] Wallet address displays (0x...)
- [ ] No MetaMask errors

### Submit Auction
```
8. Click "Create Auction"
9. Approve transaction in MetaMask (may take 3-5 seconds)
```

- [ ] Transaction submitted (MetaMask shows "submitted")
- [ ] Transaction confirmed within 15-30 seconds
- [ ] Sees "✅ Auction created successfully" message
- [ ] Auto-redirected to seller dashboard (happens after 2 seconds)

---

## ✅ SECTION 6: VERIFY ON SELLER DASHBOARD

### Auction Display
```
1. You're now on seller dashboard
2. Look for the auction card you just created
```

- [ ] Auction card appears in grid
- [ ] Item image displays correctly (from Pinata IPFS)
- [ ] Item name shows: "Test Item for Demo"
- [ ] Starting price shows: $10.00
- [ ] Current bid shows: $10.00 (initially equals starting price)
- [ ] Status badge shows: "ACTIVE"
- [ ] Countdown timer shows time remaining (e.g., "59m 50s")

### Verify Real-Time Updates
```
3. Leave dashboard open
4. Wait 5-10 seconds
5. Watch the countdown timer
```

- [ ] Timer decrements every second (59m 50s → 59m 49s → etc)
- [ ] No errors in browser console

### Test Details Button
```
6. Click "View Details →" button on auction card
```

- [ ] Navigates to `/auction/{auctionId}`
- [ ] Page loads showing:
  - [ ] Full item image
  - [ ] Full item description
  - [ ] All auction details grid
  - [ ] "Bidding History" section (currently empty)
  - [ ] "Blockchain Information" section
- [ ] Real-time countdown timer working
- [ ] Refresh button visible

### Go Back to Dashboard
```
7. Click "← Back to Dashboard" button
```

- [ ] Returns to seller dashboard
- [ ] Auction card still visible

---

## ✅ SECTION 7: PLACE BID AS SECOND USER

### Open Second Browser/Window
```
1. Open NEW browser tab or window (or incognito)
2. Go to http://localhost:5173
3. Click "Bidder Dashboard"
4. Login with DIFFERENT user account (bidder, not seller)
```

- [ ] Successfully logged in as bidder
- [ ] Sees "Bidder Dashboard" title
- [ ] Auction appears in available auctions list

### Place Bid
```
5. Click on the auction you created
6. Look at bidding section (shows current highest bid)
7. Enter bid amount: 15
8. Click "Place Bid"
```

- [ ] Form accepts bid amount
- [ ] Validation message appears if needed
- [ ] MetaMask popup shows for blockchain transaction
- [ ] Transaction confirms within 15-30 seconds
- [ ] Success message appears: "✅ Bid placed successfully!"
- [ ] Bid appears in console logs (for debugging)

---

## ✅ SECTION 8: VERIFY REAL-TIME UPDATE

### Go Back to Seller Browser
```
1. Switch to the FIRST browser (seller account)
2. Check the auction card
```

- [ ] **Within 5 seconds**, the card updates:
  - [ ] Current highest bid now shows: **$15.00**
  - [ ] Highest bidder shows: **[bidder username]**
  - [ ] Countdown continues updating

### This is the KEY FIX being demonstrated!

---

## ✅ SECTION 9: VERIFY BID HISTORY

### On Seller's Details Page
```
1. Click "View Details →" again on the auction card
2. Scroll to "Bidding History" section
```

- [ ] Bid history now shows **1 bid** (instead of empty)
- [ ] Table shows:
  - [ ] Rank: #1
  - [ ] Wallet Address: [bidder's wallet]
  - [ ] Bid Amount: **$15.00**
  - [ ] Timestamp: [recent time]
  - [ ] Transaction Hash: [blockchain tx hash]

### Refresh to Verify Persistence
```
3. Press F5 to refresh the page
4. Scroll to Bidding History again
```

- [ ] Bid data is STILL THERE (proof it's in database)
- [ ] Same bid data displayed
- [ ] Not lost after refresh

---

## ✅ SECTION 10: BONUS FEATURES (Optional)

### Place Second Bid
```
1. Go back to bidder browser
2. Enter higher bid: 20
3. Click "Place Bid"
4. Approve in MetaMask
```

- [ ] New bid calculates correctly
- [ ] Bid > $15.00 + $0.10 (min increment)
- [ ] Transaction succeeds

### Verify Multiple Bids in History
```
5. Switch back to seller browser
6. Verify auction card updated: Current bid = $20.00
7. Click "View Details"
8. Check Bidding History section
```

- [ ] Shows **2 bids** total
- [ ] Bid #1: $15.00
- [ ] Bid #2: $20.00
- [ ] Sorted by timestamp (most recent first)

### Test Auto-Extension (Advanced)
```
If time allows:
1. Note the remaining time in countdown
2. Place a bid when < 15 minutes remain
3. Check if endTime extended by 15 minutes
```

---

## ✅ SECTION 11: ERROR HANDLING TEST

### Test Invalid Bid
```
1. In bidder browser, try to place bid:
   Enter amount: 10 (same as current highest)
```

- [ ] Error message appears
- [ ] Says something like: "Bid must be at least $20.10"
- [ ] Transaction NOT sent to blockchain
- [ ] No false success message

### Test Missing Image (If Creating New Auction)
```
1. Try to create auction without uploading image
2. Click "Create Auction"
```

- [ ] Error appears: "Please upload an image"
- [ ] Form prevents submission
- [ ] No blockchain transaction attempted

---

## ✅ SECTION 12: CODE VERIFICATION

### Check New Components Exist
```
Frontend files created:
- ✅ src/components/auction_page/AuctionDetails.jsx
- ✅ src/components/auction_page/auction_details.css
```

### Check New Backend Classes Exist
```
Backend files created:
- ✅ src/main/java/.../controller/BidController.java
- ✅ src/main/java/.../dto/BidRequest.java
```

### Check Key Modifications
```
- ✅ App.jsx has route: <Route path="/auction/:auctionId" ... />
- ✅ seller_page.jsx has polling setup
- ✅ BidController saves bids to MongoDB
- ✅ AuctionResponse has blockchain fields
```

Open files in VS Code to visually confirm changes are present.

---

## ✅ SECTION 13: CONSOLE LOGS FOR DEBUGGING

### Frontend Console (F12)
If you need to verify what's happening:

**Bid Placement Logs:**
- "Fetching blockchain auction..."
- "Auction struct: ..."
- "Bid validation passed"
- "Bid transaction hash: 0x..."
- "Bid saved to backend"
- "Bid placement successful"

**Polling Logs:**
- "Fetching seller auctions..."
- Request to "http://localhost:8080/api/auctions/seller/{id}"
- Response with updated auction data every 5 seconds

### Backend Console
If issues occur, check:
- "Bid saved: [bid-id]"
- "Auction updated with new highest bid: $X.XX"
- "Bid placement failed: [reason]"

---

## ✅ SECTION 14: FINAL SYSTEMS CHECK

### 30 Minutes Before Demo

Database Status:
- [ ] MongoDB connected and accepting writes
- [ ] Can create new auctions (stored in DB)
- [ ] Can save new bids (stored in DB)

API Status:
- [ ] All endpoints responding (test with curl)
- [ ] No access denied / CORS errors
- [ ] Responses valid JSON

Frontend Status:
- [ ] No console errors on any page
- [ ] All links working
- [ ] Forms validating correctly
- [ ] Images loading from Pinata

Blockchain Status:
- [ ] MetaMask connected to correct network
- [ ] Wallet has test ETH (for gas fees)
- [ ] Contract address correct: 0xD19A4cfF92E1F5F2B63446E3506205e9720793d6

Storage Status:
- [ ] Image uploads working (to Pinata or local fallback)
- [ ] Images accessible via URLs
- [ ] Images display in UI

---

## 🎬 YOU ARE READY TO DEMO!

If ALL checkboxes above are checked ✅, you have:

✅ **Bids are saved to database**
✅ **Real-time updates working (5-second polling)**
✅ **Bid history visible in details page**
✅ **Images uploading to Pinata**
✅ **Highest bidder being tracked**
✅ **Complete end-to-end flow working**

---

## DEMO DAY FINAL CHECKLIST

Morning of demo:
- [ ] Computer charged/plugged in
- [ ] Backend started and running
- [ ] Frontend started and running
- [ ] MetaMask configured and ready
- [ ] Test image file ready to upload
- [ ] This checklist printed or on second screen for reference

During demo:
- [ ] Speak clearly about what's happening
- [ ] Pause for 5 seconds to show real-time update
- [ ] Mention the three main fixes (save, real-time, history)
- [ ] Be ready to answer questions about the architecture

After demo:
- [ ] Keep terminal windows open in case they ask to see logs
- [ ] Be prepared to explain the code (BidController, polling logic)
- [ ] Have the documents ready (FIXES_SUMMARY.md, etc.)

---

## SUCCESS INDICATORS AT A GLANCE

**BEFORE DEMO** - Can you check off these items?
- [ ] Auction creates with image from Pinata ✅
- [ ] Auction appears on seller dashboard ✅
- [ ] Countdown timer works ✅

**DURING DEMO** - Can you demonstrate these actions?
- [ ] Place bid from second browser account ✅
- [ ] Seller dashboard updates within 5 seconds ✅
- [ ] Bid history shows in details page ✅

**AFTER DEMO** - Can you answer these questions?
- [ ] Where are bids stored? (MongoDB) ✅
- [ ] How does real-time work? (Polling every 5 seconds) ✅
- [ ] What validates the bids? (BidController) ✅

---

**IF ALL SECTIONS CHECKED: YOU'RE READY! 🚀**

Break a leg with your demo tomorrow!
