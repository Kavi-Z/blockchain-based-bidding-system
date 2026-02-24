```mermaid
erDiagram
    USER {
        String id PK
        String email "Unique, Indexed"
        String password
        String role "bidder or seller"
        String wallet_address "Unique, Indexed"
        String username
        String profile_image
        LocalDateTime created_at
        LocalDateTime updated_at
        Boolean is_active
    }

    AUCTION {
        String id PK
        String item_name "3-100 chars"
        String description "10-1000 chars"
        String image_url
        String seller_id FK "Indexed"
        String seller_username
        String owner_address "blockchain"
        String contract_address "blockchain"
        String transaction_hash "blockchain"
        Long block_number "blockchain"
        Integer bidding_time "minutes, 1-10080"
        Double min_increment ">=0.01"
        Integer extension_time "minutes, 0-120"
        Double max_bid "optional"
        Double starting_price ">=0.01"
        Double current_highest_bid
        String highest_bidder_id FK
        String highest_bidder_username
        LocalDateTime start_time
        LocalDateTime end_time
        String status "Indexed: ACTIVE/CLOSED/CANCELLED"
    }

    BID {
        String id PK
        String auction_id FK
        String bidder_id FK
        String bidder_username
        String bidder_profile_image
        String wallet_address
        String bid_amount
        String transaction_hash "blockchain"
        Long block_number "blockchain"
        LocalDateTime timestamp
        LocalDateTime created_at
    }

    NFT {
        String id PK
        String name
        String image_url
        String current_owner FK
        String previous_owner FK
        String auction_id FK
        String status "OWNED/IN_AUCTION/TRANSFERRED"
        String token_id
        String description
        LocalDateTime created_at
        LocalDateTime updated_at
        LocalDateTime acquired_at
    }

    USER ||--o{ AUCTION : "creates (seller_id)"
    USER ||--o{ AUCTION : "leads as highest bidder (highest_bidder_id)"
    USER ||--o{ BID : "places (bidder_id)"
    AUCTION ||--o| NFT : "associated with (auction_id)"
    AUCTION ||--o{ BID : "receives (auction_id)"
    USER ||--o{ NFT : "currently owns (current_owner)"
    USER ||--o{ NFT : "previously owned (previous_owner)"
  

```







# Documentation
# Blockchain-Based Bidding System

## Project Overview
The Blockchain-Based Bidding System is a decentralized auction platform designed to ensure transparent, secure, and tamper-proof bidding using blockchain technology. The system integrates a web-based frontend, a backend REST API, and Ethereum smart contracts to provide a trustworthy auction environment.

## Main Features

### User Registration and Authentication
- Users can securely register and log in
- Only authenticated users can create auctions and place bids
- Backend manages user verification and access control

### Auction Creation
- Users can create auction listings
- Includes item name, description, starting price, and deadline
- Auction details are stored securely in the backend

### Bidding System
- Users can place bids on active auctions
- Bids are recorded on the blockchain
- Ensures transparency and immutability of bid data

### Real-Time Highest Bid Tracking
- Displays the current highest bid
- Automatically updates when a new highest bid is placed

### Bid History
- Maintains complete bid records
- Allows users to track all bidding activities

### Smart Contract Enforcement
- Auction rules are enforced automatically through smart contracts
- Prevents invalid or lower bids
- Ensures fair winner selection

## User Roles
- Registered users can:
  - Create auction listings
  - Place bids
  - View auction details
  - View bid history
  - Interact securely with the system

## Technologies Used
- React.js
- Spring Boot
- Solidity
- Ethereum-compatible network (Ganache/Testnet)
- Web3.js or Ethers.js
- Node.js and npm
- PostgreSQL or MongoDB (optional)

## Database and Blockchain

### Backend Database
- Stores user information
- Stores auction details
- Stores off-chain auction metadata
- Manages auction status

### Blockchain (Ethereum)
- Stores bid transactions
- Executes smart contract logic
- Ensures transparency and data immutability

## Application Workflow
1. User registers or logs in
2. User creates an auction listing
3. Other users view auction details
4. Users place bids through the smart contract
5. Blockchain records and validates bids
6. Highest bidder wins after auction deadline
7. Auction status is updated

## Security
- Secure authentication using backend services
- Smart contract validation for bid integrity
- Blockchain ensures tamper-proof records
- Proper API security mechanisms

## Future Improvements
- Real-time bid notifications
- Wallet-based authentication (MetaMask login)
- Auction countdown timer
- Admin dashboard
- Deployment to public Ethereum testnet
- Integration with IPFS for decentralized storage

## License
This project is developed for educational purposes and is free to use and modify.
