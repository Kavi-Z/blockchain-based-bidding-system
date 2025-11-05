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
