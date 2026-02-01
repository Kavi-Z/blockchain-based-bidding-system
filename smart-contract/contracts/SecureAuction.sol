// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SecureAuction {
    address payable public seller;
    uint public startTime;
    uint public endTime;
    bool public ended;
    bool public auctionStarted;

    address public highestBidder;
    uint public highestBid;

    uint public minIncrement;
    uint public extensionTime;
    uint public maxBid;

    mapping(address => uint) public pendingReturns;
    mapping(address => bool) private hasPendingRecorded;
    address[] public pendingParties;

    bool private locked;

    event HighestBidIncreased(address indexed bidder, uint amount);
    event AuctionExtended(uint newEndTime);
    event AuctionEnded(address winner, uint amount);
    event AuctionCancelled();
    event Withdrawn(address indexed who, uint amount);
    event WithdrawFailed(address indexed who, uint amount);

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller");
        _;
    }

    modifier noReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        seller = payable(msg.sender);
        auctionStarted = false;
        ended = false;
    }

    function startAuction(
        uint _biddingTime,
        uint _minIncrement,
        uint _extensionTime,
        uint _maxBid
    ) public onlySeller {
        require(!auctionStarted, "Auction already started");
        require(_biddingTime > 0, "Invalid bidding time");
        require(_minIncrement > 0, "Invalid min increment");

        startTime = block.timestamp;
        endTime = block.timestamp + _biddingTime;
        minIncrement = _minIncrement;
        extensionTime = _extensionTime;
        maxBid = _maxBid;

        auctionStarted = true;
        ended = false;
        highestBid = 0;
        highestBidder = address(0);
    }

    function bid() external payable {
        require(auctionStarted, "Auction not started");
        require(block.timestamp < endTime, "Auction ended");
        require(msg.sender != seller, "Seller cannot bid");

        uint required = highestBid + minIncrement;
        require(msg.value >= required, "Bid below min increment");
        if (maxBid != 0) {
            require(msg.value <= maxBid, "Above maxBid");
        }

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
            if (!hasPendingRecorded[highestBidder]) {
                hasPendingRecorded[highestBidder] = true;
                pendingParties.push(highestBidder);
            }
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        if (endTime - block.timestamp < extensionTime) {
            endTime += extensionTime;
            emit AuctionExtended(endTime);
        }

        emit HighestBidIncreased(msg.sender, msg.value);
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

    function endAuction() external onlySeller noReentrant {
        require(auctionStarted, "Auction not started");
        require(block.timestamp >= endTime, "Auction not yet ended");
        require(!ended, "Already ended");

        ended = true;
        auctionStarted = false;

        emit AuctionEnded(highestBidder, highestBid);

        uint amount = highestBid;
        highestBid = 0;
        if (amount > 0) {
            (bool success, ) = seller.call{value: amount}("");
            if (!success) {
                pendingReturns[seller] += amount;
                if (!hasPendingRecorded[seller]) {
                    hasPendingRecorded[seller] = true;
                    pendingParties.push(seller);
                }
            }
        }
    }

    function cancelAuction() external onlySeller noReentrant {
        require(!ended, "Already ended");

        ended = true;
        auctionStarted = false;

        emit AuctionCancelled();

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
            if (!hasPendingRecorded[highestBidder]) {
                hasPendingRecorded[highestBidder] = true;
                pendingParties.push(highestBidder);
            }
            highestBid = 0;
        }
    }

    function getPendingParties() external view returns (address[] memory) {
        return pendingParties;
    }

    receive() external payable {
        revert("Direct deposits not accepted");
    }
}
