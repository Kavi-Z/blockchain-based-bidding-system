# Bug ID: BUG-002
Title: System accepts negative bid amounts
Environment: Windows 11, Chrome, localhost:5173
Steps to Reproduce:
1. Connect wallet via MetaMask.
2. Navigate to Live Auctions.
3. Enter a negative number in the "Bid Amount" field (e.g., -5).
4. Click "Submit Bid".
Expected Result: Validation error should appear saying "Bid amount must be positive."
Actual Result: Bid is accepted, breaking expected behavior.
Severity: Medium
Screenshots:
- screenshots/BUG_002/frontend_view.png
- screenshots/BUG_002/console_error.png
Notes:
- Screenshots and further details can be added later.