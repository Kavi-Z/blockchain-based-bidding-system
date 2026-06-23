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


## Evidence

### Auction Details

(screenshots/BUG_002/BUG_002_Auction_Details.png)

### Invalid Date Display

(screenshots/BUG_002/BUG_002_Invalid_Date.png)

### Observation

During testing, bidding history displayed "INVALID DATE" values instead of valid timestamps. The auction details page correctly displayed bid information but failed to render bid dates.