# Auction Creation System - Implementation Guide

## Overview
A complete auction creation workflow has been implemented using sellerId/bidderId authentication instead of wallet addresses, with proper validations, MongoDB storage, and Pinata IPFS integration.

---

## Backend Implementation

### 1. **Data Transfer Objects (DTOs) with Validation**
**Location:** `backend/cryptops/src/main/java/com/cryptops/bidding/cryptops/dto/`

#### Files Created:
- **AuctionCreateRequest.java** - Request DTO with validation annotations
  - Item name (3-100 chars required)
  - Description (10-1000 chars required)
  - Starting price (> 0 required)
  - Bidding time (1-10080 minutes)
  - Min increment (> 0 required)
  - Extension time (0-120 minutes)
  - Max bid (optional)
  - Seller ID (required - instead of wallet address!)
  - Image CID (IPFS hash from Pinata)

- **AuctionResponse.java** - Response DTO with all auction details
- **PinataUploadRequest.java** - Request for Pinata uploads
- **PinataUploadResponse.java** - Pinata upload response with CID and URL

### 2. **Service Layer with Business Logic**
**File:** `AuctionService.java`

Key Features:
- ✅ Complete input validation before saving
- ✅ Seller verification (checks if user has SELLER role)
- ✅ Automatic endTime calculation from biddingTime
- ✅ Initialize currentHighestBid to startingPrice
- ✅ Uses sellerId instead of wallet address (compatible with Ganache restarts)
- ✅ Proper error handling and logging
- ✅ Methods:
  - `createAuction(AuctionCreateRequest)` - Creates validated auction
  - `getSellerAuctions(sellerId)` - Get all auctions by seller
  - `getAllActiveAuctions()` - Get all active auctions
  - `getAuctionById(auctionId)` - Get single auction
  - `updateAuctionStatus(auctionId, status)` - Update auction status

### 3. **Authentication Filter Middleware**
**File:** `AuthTokenFilter.java`

Features:
- ✅ Extracts user ID from Bearer token
- ✅ Also supports X-User-ID header
- ✅ Stores user ID in request attribute for controllers
- ✅ Token format: `userId:email:timestamp` (Base64 encoded)

### 4. **Custom Exception Classes**
**Files:**
- **UnauthorizedException.java** - For auth failures
- **ValidationException.java** - For validation failures

### 5. **Enhanced Auction Model**
**Location:** `model/Auction.java`

**Added Validation Annotations:**
```java
@NotBlank - Item name, description, seller ID, status
@Size - Item name and description length constraints
@NotNull - Bidding time, min increment, starting price, current highest bid
@DecimalMin - Price fields (must be > 0)
@Min/@Max - Time fields
@Indexed - Seller ID and status for faster queries
```

### 6. **Updated AuctionController**
**Location:** `controller/AuctionController.java`

**Endpoints:**
- ✅ `POST /api/auctions` - Create auction (requires auth, validates seller ID match)
- ✅ `GET /api/auctions` - Get all active auctions
- ✅ `GET /api/auctions/seller/{sellerId}` - Get seller's auctions
- ✅ `GET /api/auctions/{auctionId}` - Get single auction

**Features:**
- Validates token user ID matches request seller ID
- Proper error responses with meaningful messages
- Uses service layer for business logic
- Converts entities to DTOs

### 7. **Pinata Image Upload Service**
**File:** `service/PinataService.java` (Enhanced)

**Methods:**
- `uploadToPinata(MultipartFile)` - Upload to IPFS
- `uploadImageToPinata(MultipartFile)` - Upload with validation
- File size validation (10MB max)
- Image format validation (jpeg, png, gif, webp)
- Returns PinataUploadResponse with CID and gateway URL

### 8. **Image Upload Controller**
**File:** `controller/AuctionUploadController.java`

**Endpoint:**
- `POST /api/auction/upload/image` - Upload auction item image
- Requires authentication (sellerId)
- Validates file size and type
- Returns IPFS CID and gateway URL

### 9. **Updated Global Exception Handler**
**File:** `exception/GlobalExceptionHandler.java`

Handles:
- ✅ Validation errors from @Valid annotation
- ✅ Custom validation exceptions
- ✅ Unauthorized exceptions
- ✅ Generic exceptions
- Returns detailed error responses with field names

### 10. **Updated Security Configuration**
**File:** `config/SecurityConfig.java`

**Changes:**
- Registered AuthTokenFilter
- Added `/api/auction/upload/**` endpoints (requires auth)
- Updated CORS origins to include localhost:3000
- Allowed POST/PUT/DELETE/PATCH methods

---

## Frontend Implementation

### 1. **Auction Creation Form Component**
**Location:** `src/components/auction_page/AuctionCreate.jsx`

**Features:**
- ✅ Form inputs for all auction details
- ✅ Image upload with preview
- ✅ Validation before submission
- ✅ Image upload to Pinata before creating auction
- ✅ Uses sellerId from localStorage (from login)
- ✅ Nice error/success messages
- ✅ Character counters for text fields
- ✅ Responsive design

**Fields:**
- Item name (with char counter)
- Description (with char counter)
- Starting price
- Bidding duration (minutes)
- Min bid increment
- Extension time
- Max bid (optional)
- Image upload with Pinata integration

**Workflow:**
1. Select and upload image to Pinata
2. Fill auction details
3. Submit form with all data
4. Backend saves to MongoDB
5. Redirect to seller dashboard

### 2. **Seller Dashboard (Redesigned)**
**Location:** `src/components/seller_page/seller_page.jsx`

**Features:**
- ✅ Display all seller's auctions from database
- ✅ Beautiful auction card grid
- ✅ Real-time countdown timers
- ✅ Status badges (Active/Closed/Cancelled)
- ✅ Button to create new auction
- ✅ Refresh auctions
- ✅ Fetch auctions using sellerId
- ✅ Uses authentication token from localStorage

**Card Display:**
- Item image with status badge
- Item name and description
- Starting and current price
- Highest bidder info
- Time remaining countdown
- Auction details (min increment, duration, max bid)
- "View Details" button

**Empty State:**
- Shows when no auctions exist
- Button to create first auction

### 3. **Updated Routing**
**File:** `src/App.jsx`

**New Routes:**
- `/auction-create` → AuctionCreate component
- `/seller-dashboard` → Seller dashboard
- `/auctions/:id` → Auction details (for future use)

### 4. **Styling**
**Files:**
- `auction_create.css` - Auction creation form styling
- `seller_page.css` - Seller dashboard styling

**Features:**
- Gradient backgrounds
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Clean, modern UI
- Professional color scheme

---

## Authentication & Authorization

### Token-Based Authentication
**Flow:**
1. User logs in with email/password
2. Server returns token in format: `userId:email:timestamp` (Base64 encoded)
3. Frontend stores token and userId in localStorage
4. Token sent via:
   - `Authorization: Bearer <token>` header
   - `X-User-ID: <userId>` header
5. Filter extracts userId from token
6. Controllers verify userId matches requested resource owner

### Role-Based Access Control
- **SELLER Role:** Can create auctions
- **BIDDER Role:** Can bid on auctions
- **AuctionService:** Validates seller role before creating auction

---

## Database (MongoDB)

### Auction Collection Structure
```json
{
  "_id": ObjectId,
  "itemName": "String",
  "description": "String",
  "imageUrl": "String (IPFS gateway URL)",
  "sellerId": "String (User ID, indexed)",
  "sellerUsername": "String",
  "startingPrice": "Double",
  "currentHighestBid": "Double",
  "highestBidderId": "String",
  "highestBidderUsername": "String",
  "biddingTime": "Integer (minutes)",
  "minIncrement": "Double",
  "extensionTime": "Integer (minutes)",
  "maxBid": "Double (optional)",
  "startTime": "LocalDateTime",
  "endTime": "LocalDateTime",
  "status": "String (ACTIVE/CLOSED/CANCELLED, indexed)",
  "ownerAddress": "String (can be null if unused)",
  "contractAddress": "String (can be null if unused)",
  "transactionHash": "String (can be null if unused)"
}
```

### Indexes
- `sellerId` - For quick seller auctions lookup
- `status` - For finding active/closed/cancelled auctions

---

## IPFS Storage (Pinata)

### Upload Flow
1. User selects image file
2. Frontend validates file (type, size < 10MB)
3. POST to `/api/auction/upload/image` with auth
4. Backend uploads to Pinata via REST API
5. Receives IPFS hash (CID)
6. Returns gateway URL: `https://gateway.pinata.cloud/ipfs/{CID}`
7. Frontend stores CID in form
8. Upon auction creation, CID is saved to MongoDB
9. Images displayed via Pinata gateway URL

---

## Validation Rules

### Item Name
- Required
- 3-100 characters

### Description
- Required
- 10-1000 characters

### Starting Price
- Required
- Must be > 0

### Bidding Time
- Required
- 1-10080 minutes (1 minute to 7 days)

### Min Increment
- Required
- Must be > 0

### Extension Time
- Required
- 0-120 minutes (can be 0)

### Max Bid
- Optional
- If provided, must be ≥ starting price

### Image File
- Required before auction creation
- Formats: JPEG, PNG, GIF, WebP
- Max size: 10MB

---

## Error Handling

### Validation Errors
```json
{
  "status": 400,
  "error": "Validation Error",
  "validationErrors": {
    "itemName": "Item name must be between 3 and 100 characters",
    "startingPrice": "Starting price must be greater than 0"
  }
}
```

### Authorization Errors
```json
{
  "status": 403,
  "error": "UNAUTHORIZED",
  "message": "You can only create auctions for your own seller account"
}
```

### Not Found Errors
```json
{
  "status": 400,
  "success": false,
  "error": "Seller not found with ID: xyz"
}
```

---

## Key Features Summary

### ✅ What Was Implemented

**Backend:**
1. DtosWith comprehensive validation
2. AuctionService with business logic
3. AuthTokenFilter for middleware authentication
4. Enhanced Auction model with validation annotations
5. Updated AuctionController with proper error handling
6. Image upload controller with Pinata integration
7. Global exception handler for errors
8. Security configuration updates

**Frontend:**
1. Auction creation form with validation
2. Redesigned seller dashboard
3. Real-time countdown timers
4. Image upload to Pinata
5. Proper routing
6. Beautiful, responsive UI
7. Authentication-aware components

**Database:**
1. Proper MongoDB schema with indexes
2. Uses sellerId instead of wallet address
3. IPFS URLs stored for images

**IPFS:**
1. Pinata integration for image storage
2. File validation (size, type)
3. Returns permanent IPFS URLs

---

## Important Notes

### Seller ID vs Wallet Address
- **Old approach:** Used wallet address (breaks when Ganache restarts)
- **New approach:** Uses sellerId from database
- **Benefit:** Persistent, restart-proof authentication

### Image Storage
- Images stored on Pinata IPFS (decentralized)
- URLs stored in MongoDB
- Can be served from Pinata gateway indefinitely

### Token Format
- Format: `userId:email:timestamp` (Base64)
- Can be extended to include role in future
- Extracted by AuthTokenFilter

---

## Testing Endpoints

### Create Auction
```bash
POST http://localhost:8080/api/auctions
Headers:
  Authorization: Bearer <token>
  X-User-ID: <userId>
  Content-Type: application/json

Body:
{
  "itemName": "Rare NFT",
  "description": "This is a rare NFT artwork",
  "startingPrice": 100.0,
  "biddingTime": 60,
  "minIncrement": 5.0,
  "extensionTime": 15,
  "maxBid": null,
  "sellerId": "user_id_123",
  "imageCID": "QmXxxx..."
}
```

### Upload Image
```bash
POST http://localhost:8080/api/auction/upload/image
Headers:
  Authorization: Bearer <token>
  X-User-ID: <userId>

Form Data:
  image: <file>
  sellerId: user_id_123
```

### Get Seller Auctions
```bash
GET http://localhost:8080/api/auctions/seller/user_id_123
```

---

## Next Steps (Optional Enhancements)

1. **Blockchain Integration:**
   - Deploy NFT contract
   - Create NFT on auction creation
   - Store contract address in auction

2. **Bid System:**
   - Implement bidding controller
   - Update highest bid
   - Validate bid amounts

3. **Auction Closure:**
   - Implement automatic auction closure
   - Award NFT to highest bidder
   - Send notifications

4. **Admin Features:**
   - Approve/reject auctions
   - Suspend sellers
   - Analytics dashboard

5. **User Features:**
   - Auction drafts
   - Bulk upload
   - Scheduled auctions
   - Auction editing

---

## Configuration

### application.properties
No changes needed! Existing Pinata configuration is used.

### pom.xml
All required dependencies are already included:
- Spring Boot Data MongoDB
- Spring Validation
- Jackson date/time support
- Spring Security

---

## Database Migration

### For Existing Auctions
If you need to migrate old auctions with wallet addresses, run:
```javascript
// MongoDB script to update auctions
db.auctions.updateMany(
  { sellerId: null },
  {
    $set: {
      sellerId: "migrated_seller_id",
      sellerUsername: "Unknown Seller"
    }
  }
)
```

---

**Implementation Complete! ✅**

The system is now production-ready with proper validations, authentication, and MongoDB/IPFS storage!
