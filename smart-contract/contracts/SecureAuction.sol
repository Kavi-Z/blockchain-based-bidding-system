// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecureAuction {
    address public seller;
    address public highestBidder;
    uint public highestBid;

    mapping(address => uint) public pendingReturns;

    bool public ended;

    constructor() {
        seller = msg.sender;
    }

    function bid() public payable {
        require(!ended, "Auction already ended");
        require(msg.value > highestBid, "There already is a higher bid");

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }

    function withdraw() public returns (bool) {
        uint amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds to withdraw");

        pendingReturns[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        return success;
    }

    function endAuction() public {
        require(msg.sender == seller, "Only seller can end auction");
        require(!ended, "Auction already ended");

        ended = true;
        payable(seller).transfer(highestBid);
    }
}
