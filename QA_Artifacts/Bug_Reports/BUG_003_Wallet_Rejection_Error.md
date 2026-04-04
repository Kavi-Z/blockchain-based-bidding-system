# Bug ID: BUG-003
Title: MetaMask transaction review prevents auction creation
Environment: Windows 11, Chrome, localhost:5173, MetaMask
Steps to Reproduce:
1. Open app and connect wallet
2. Attempt to create an auction
3. MetaMask popup appears asking to “Review” transaction
4. Do not confirm transaction
Expected Result: Auction creation should fail gracefully with a clear error message
Actual Result: Auction is not created; user sees “0 ETH sending” popup and cannot proceed
Severity: Medium