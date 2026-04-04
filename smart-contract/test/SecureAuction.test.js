const SecureAuction = artifacts.require("SecureAuction");

contract("SecureAuction QA Tests", (accounts) => {
  const [seller, bidder1, bidder2] = accounts;
  let auctionInstance;

  // This runs before our tests to setup a fresh contract
  before(async () => {
    auctionInstance = await SecureAuction.new();
  });

  it("TC-003: Should allow a seller to create an auction", async () => {
    // Seller creates an auction (bidding time: 1000 seconds, minIncrement: 100 wei, extension: 0, maxBid: 0)
    await auctionInstance.createAuction(1000, 100, 0, 0, { from: seller });
    
    // Validate the auction state
    const auctionCount = await auctionInstance.auctionCount();
    assert.equal(auctionCount.toNumber(), 1, "Auction was not created successfully");
  });

  it("TC-004: Should allow a valid bid from a bidder", async () => {
    const auctionId = 1;
    const bidAmount = 500; // More than min bid
    
    await auctionInstance.bid(auctionId, { from: bidder1, value: bidAmount });
    
    const auction = await auctionInstance.auctions(auctionId);
    assert.equal(auction.highestBidder, bidder1, "Bidder1 should be the highest bidder");
    assert.equal(auction.highestBid.toNumber(), bidAmount, "Highest bid amount is incorrect");
  });

  it("TC-005: Should reject a bid lower than the current highest bid + min increment", async () => {
    const auctionId = 1;
    // Current highest is 500, min increment is 100. So we need at least 600.
    const invalidBidAmount = 550; 
    
    try {
      await auctionInstance.bid(auctionId, { from: bidder2, value: invalidBidAmount });
      assert.fail("The bid should have been rejected");
    } catch (error) {
      // We expect an error containing "Bid below min increment"
      assert.include(error.message, "Bid below min increment", "Error message doesn't match expected rule");
    }
  });
});