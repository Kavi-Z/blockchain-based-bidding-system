# Architectural Review: Blockchain-Based Bidding System

Based on an analysis of the current codebase and workflows, here are the major architectural issues and vulnerabilities present in the project, categorized by severity.

## 🚨 Critical Security Issues

### 1. Header-Based Identity Spoofing (X-User-ID)
**Issue:** The frontend passes an `X-User-ID` header along with the Bearer token to identify the user. The backend's `UserIdFilter` blindly reads this header and sets it as the active user ID for the request.
**Risk:** A malicious user can log in with their own account, get a valid JWT, but manually modify the HTTP request to send someone else's `X-User-ID`. The backend will then process the request (like creating an auction or placing a bid) on behalf of the victim.
**Solution:** The backend should **never** trust a client-provided User ID header. Instead, the backend must extract the user's identity directly from the validated JWT's `sub` claim or custom claims during the Spring Security filter chain.

### 2. Frontend-Driven Blockchain Synchronization
**Issue:** When an auction is created or a bid is placed, the frontend talks to MetaMask/ethers.js first, waits for the transaction, and then sends the `transactionHash` and contract data to the Spring Boot backend via a REST API.
**Risk:** A user could easily intercept the network request and send fake or manipulated blockchain data to the backend without actually paying gas or sending a real transaction. Alternatively, the blockchain transaction could succeed, but the network connection drops before the backend API is called, causing the database to be out of sync with the smart contract.
**Solution:** The backend should be the source of truth. The Spring Boot backend should use a library like **Web3j** to listen for smart contract events (e.g., `AuctionCreated`, `BidPlaced`). When the blockchain emits the event, the backend automatically updates MongoDB. The frontend REST calls should only be used for intent or off-chain metadata (like uploading the image to Pinata).

## ⚠️ High-Level Design Flaws

### 3. JIT Provisioning Race Conditions
**Issue:** The `AuthSync.jsx` component hits the `/api/auth/sync` endpoint after Asgardeo login to perform Just-In-Time (JIT) user provisioning in MongoDB.
**Risk:** If the user refreshes rapidly or opens multiple tabs upon logging in, multiple parallel sync requests hit the backend. If MongoDB lacks strict unique indexes on the email/sub, this can create duplicate user records. 
**Solution:** Ensure MongoDB has a unique index on the Asgardeo `sub` or `email`. Consider moving the JIT provisioning entirely to the backend—when the frontend sends a request with a new JWT, a backend interceptor can automatically provision the user if they don't exist.

### 4. Polling vs. Event-Driven Updates
**Issue:** The frontend previously used `setInterval` to poll the backend every 5 seconds to check for new bids or auction status updates.
**Risk:** Polling continuously drains client battery/resources and severely throttles the backend database when scaled to multiple users. It also provides delayed updates (up to 5 seconds late), which is detrimental in a fast-paced bidding environment.
**Solution:** Implement **WebSockets** (using Spring WebSocket/STOMP) or **Server-Sent Events (SSE)**. The backend should push updates to the frontend the millisecond a new bid is verified on the blockchain.

## 🛠️ Maintainability & Best Practices

### 5. LocalStorage Over-Reliance
**Issue:** The frontend relies heavily on `localStorage` to manage `userRole` and `internalUserId`.
**Risk:** While not immediately critical for security (since the backend *should* be verifying tokens), it can lead to UI glitches if the token expires but the `localStorage` remains, causing the UI to show logged-in states while API calls fail with 401s.
**Solution:** Use an in-memory React Context for application state. If persistence is needed, validate the state against the Asgardeo SDK's `state.isAuthenticated` on every mount.

### 6. Storage Decentralization 
**Issue:** Currently, image uploads go through the Spring Boot backend before being sent to Pinata (IPFS).
**Risk:** The backend becomes a bottleneck for large file uploads, wasting server bandwidth and memory.
**Solution:** The frontend should request a pre-signed upload URL or temporary Pinata JWT from the backend, and then the frontend should upload the image **directly** to IPFS.

---

### Recommended Next Steps for Refactoring:
1. **Immediate:** Refactor `UserIdFilter.java` to decode the `Authorization: Bearer` JWT and extract the user ID instead of reading the `X-User-ID` header.
2. **Short-term:** Remove backend polling in the frontend and implement WebSockets.
3. **Long-term:** Introduce a Web3j event listener in Spring Boot to synchronize MongoDB automatically based on Smart Contract events.
