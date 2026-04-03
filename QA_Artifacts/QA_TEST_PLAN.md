# Master QA Test Plan: Blockchain Bidding System

## 1. Scope
The objective of this testing phase is to ensure the functional correctness, security, and stability of the Blockchain Bidding System. 
This includes the Java Spring Boot Backend (Cryptops), Node.js Chatbot Backend, React Frontend, and Solidity Smart Contracts.

## 2. Testing Methodology
- **Smoke Testing:** Verify critical services start and components communicate.
- **Unit Testing:** Validate individual functions in isolation (Java JUnit, Node/Jest).
- **Smart Contract Testing:** Validate blockchain logic, bidding rules, and money transfers (Truffle).
- **API Testing:** Validate REST endpoints for Authentication, Bidding, and Auctions (Postman).
- **E2E / UI Testing:** Simulate real user behavior on the frontend (Selenium/Cypress).

## 3. Test Cases (Summary)

| Test ID | Module | Feature | Scenario | Status |
|---------|--------|---------|----------|--------|
| TC-001 | Backend | Auth | Register a new Bidder successfully | Pending |
| TC-002 | Backend | Auth | Login with invalid credentials returns 401 | Pending |
| TC-003 | Contract| Bidding | Reject a bid lower than the current highest bid | Pending |
| TC-004 | Chatbot | AI | Chatbot returns default message for unknown inputs | PASS |
| TC-005 | UI      | Bidding | Prevent form submission with empty bid amount | Pending |

## 4. Defect Management
All bugs discovered during testing are documented in GitHub Issues and linked to the `qa-testing-phase-1` pull request.