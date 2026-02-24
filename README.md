
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
    AUCTION ||--o{ BID : "receives (auction_id)"
    USER ||--o{ NFT : "currently owns (current_owner)"
    USER ||--o{ NFT : "previously owned (previous_owner)"
    AUCTION ||--o| NFT : "associated with (auction_id)"












Blockchain‑Based Bidding System
Overview

The Blockchain‑Based Bidding System is a decentralized auction platform integrating three major layers:

A frontend built with React

A backend built with Spring Boot

On‑chain functionality via Solidity smart contracts
It allows users to participate in transparent and tamper‑proof auctions, leveraging the blockchain for bid records and trust.

Features

User registration and authentication

Creation of auction listings

Placing bids that are recorded on‑chain

Real‑time updates of highest bids

Bid history tracking

Secure backend REST API for off‑chain operations

Smart contract logic enforcing auction rules

Technology Stack
Layer	Technology
Frontend	React.js (JavaScript, HTML, CSS)
Backend	Spring Boot (Java, REST API)
Smart Contract	Solidity, Ethereum‑compatible network
Database	(Optional) PostgreSQL / MongoDB for user and auction data
Tools	Node.js/npm, Web3.js or Ethers.js, Truffle or Hardhat, MetaMask
Repository Structure
blockchain‑based‑bidding‑system/
├─ frontend/        # React application
├─ backend/         # Spring Boot application
├─ smart‑contract/  # Solidity smart contracts
└─ README.md        # Project overview and setup

Getting Started
Prerequisites

Node.js & npm

Java 11 + and Maven

Ethereum‑compatible environment (e.g., Ganache, Testnet)

MetaMask browser extension

Setup & Run

Clone the repo

git clone https://github.com/Kavi-Z/blockchain-based-bidding-system.git
cd blockchain-based-bidding-system


Backend

cd backend
mvn clean install
mvn spring‑boot:run


Frontend

cd ../frontend
npm install
npm start


Smart Contract Deployment

cd ../smart‑contract
truffle migrate --network development


(or use Hardhat scripts: npx hardhat run scripts/deploy.js --network localhost)

Connect Everything

Configure React to use Web3/Ethers and point it to the deployed contracts.

Ensure backend URLs are correctly configured in the frontend.
