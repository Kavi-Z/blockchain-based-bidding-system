# Bug ID: BUG-001
Title: System crashes when Bidder submits an empty bid
Environment: Windows 11, Chrome, localhost:5173
Steps to Reproduce:
1. Connect wallet via MetaMask.
2. Navigate to Live Auctions.
3. Leave the "Bid Amount" field blank.
4. Click "Submit Bid".
Expected Result: A red validation error should appear saying "Bid amount required."
Actual Result: The frontend crashes and shows a white screen.
Severity: High
Screenshots:
- screenshots/BUG_001/frontend_view.png
- screenshots/BUG_001/console_error.png
Notes:
- Screenshots and details will be updated later once the blockchain setup is running.