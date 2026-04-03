# Master QA Test Plan & Runbook: Blockchain Bidding System

## 1. Scope
The objective of this testing phase is to ensure the functional correctness, security, and stability of the Blockchain Bidding System. 
This includes the Java Spring Boot Backend (Cryptops), Node.js Chatbot Backend, React Frontend, and Solidity Smart Contracts.

## 2. Prerequisites & Environment Setup
Before executing any tests, ensure you have the following installed on your machine:
- **Node.js & npm** (v18+ recommended)
- **Java JDK 17+** (Required for Spring Boot backend)
- **Git** (For version control)
- **Ganache / Truffle** (For local blockchain emulation)
- **Postman** (For manual API endpoint testing)

---

## 3. Test Execution Guide (Step-by-Step)

### Phase 1: Local Environment Spin-Up (Smoke Testing)
*Verify all critical services start and components communicate successfully before deep testing.*

**1. Start the Java Backend (Cryptops)**
- **Terminal 1:**
  ```bash
  cd backend/cryptops
  ./mvnw spring-boot:run