// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SecureAuction {

    struct Auction {
        address payable seller;
        uint startTime;
        uint endTime;
        bool ended;

        address highestBidder;
        uint highestBid;

        uint minIncrement;
        uint extensionTime;
        uint maxBid;
    }

    uint public auctionCount;
    mapping(uint => Auction) public auctions;

    mapping(address => uint) public pendingReturns;
    mapping(address => bool) private hasPendingRecorded;
    address[] public pendingParties;

    bool private locked;

    event AuctionCreated(uint auctionId, address seller);
    event HighestBidIncreased(uint auctionId, address bidder, uint amount);
    event AuctionExtended(uint auctionId, uint newEndTime);
    event AuctionEnded(uint auctionId, address winner, uint amount);
    event AuctionCancelled(uint auctionId);
    event Withdrawn(address indexed who, uint amount);
    event WithdrawFailed(address indexed who, uint amount);

    modifier noReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function createAuction(
        uint _biddingTime,
        uint _minIncrement,
        uint _extensionTime,
        uint _maxBid
    ) external {

        require(_biddingTime > 0, "Invalid bidding time");
        require(_minIncrement > 0, "Invalid min increment");

        auctionCount++;

        auctions[auctionCount] = Auction({
            seller: payable(msg.sender),
            startTime: block.timestamp,
            endTime: block.timestamp + _biddingTime,
            ended: false,
            highestBidder: address(0),
            highestBid: 0,
            minIncrement: _minIncrement,
            extensionTime: _extensionTime,
            maxBid: _maxBid
        });

        emit AuctionCreated(auctionCount, msg.sender);
    }

    function bid(uint auctionId) external payable {
        Auction storage auction = auctions[auctionId];

        require(block.timestamp >= auction.startTime, "Not started");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(!auction.ended, "Already ended");
        require(msg.sender != auction.seller, "Seller cannot bid");

        uint required = auction.highestBid + auction.minIncrement;
        require(msg.value >= required, "Bid below min increment");

        if (auction.maxBid != 0) {
            require(msg.value <= auction.maxBid, "Above maxBid");
        }

        if (auction.highestBid != 0) {
            pendingReturns[auction.highestBidder] += auction.highestBid;

            if (!hasPendingRecorded[auction.highestBidder]) {
                hasPendingRecorded[auction.highestBidder] = true;
                pendingParties.push(auction.highestBidder);
            }
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        if (auction.endTime - block.timestamp < auction.extensionTime) {
            auction.endTime += auction.extensionTime;
            emit AuctionExtended(auctionId, auction.endTime);
        }

        emit HighestBidIncreased(auctionId, msg.sender, msg.value);
    }

    function endAuction(uint auctionId) external noReentrant {
        Auction storage auction = auctions[auctionId];

        require(msg.sender == auction.seller, "Only seller");
        require(block.timestamp >= auction.endTime, "Not ended yet");
        require(!auction.ended, "Already ended");

        auction.ended = true;

        emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);

        uint amount = auction.highestBid;
        auction.highestBid = 0;

        if (amount > 0) {
            (bool success, ) = auction.seller.call{value: amount}("");

            if (!success) {
                pendingReturns[auction.seller] += amount;

                if (!hasPendingRecorded[auction.seller]) {
                    hasPendingRecorded[auction.seller] = true;
                    pendingParties.push(auction.seller);
                }
            }
        }
    }

    function cancelAuction(uint auctionId) external noReentrant {
        Auction storage auction = auctions[auctionId];

        require(msg.sender == auction.seller, "Only seller");
        require(!auction.ended, "Already ended");

        auction.ended = true;

        emit AuctionCancelled(auctionId);

        if (auction.highestBid != 0) {
            pendingReturns[auction.highestBidder] += auction.highestBid;

            if (!hasPendingRecorded[auction.highestBidder]) {
                hasPendingRecorded[auction.highestBidder] = true;
                pendingParties.push(auction.highestBidder);
            }

            auction.highestBid = 0;
        }
    }

    function withdraw() external noReentrant returns (bool) {
        uint amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds");

        pendingReturns[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");

        if (!success) {
            pendingReturns[msg.sender] = amount;
            emit WithdrawFailed(msg.sender, amount);
            return false;
        }

        emit Withdrawn(msg.sender, amount);
        return true;
    }

    function getPendingParties() external view returns (address[] memory) {
        return pendingParties;
    }

    receive() external payable {
        revert("Direct deposits not accepted");
    }
}
