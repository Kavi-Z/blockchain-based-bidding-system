package com.cryptops.bidding.cryptops.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Document(collection = "bids")
public class Bid {

    @Id
    private String id;

    @DBRef
    @Field("auction")
    private Auction auction;

    @Field("auction_id")
    private String auctionId;

    @Field("bidder_id")
    private String bidderId;

    @Field("bidder_username")
    private String bidderUsername;

    @Field("bidder_profile_image")
    private String bidderProfileImage;

    @Field("wallet_address")
    private String walletAddress;

    @Field("bid_amount")
    private String bidAmount;

    @Field("transaction_hash")
    private String transactionHash;

    @Field("block_number")
    private Long blockNumber;

    @Field("timestamp")
    private LocalDateTime timestamp;

    @Field("created_at")
    private LocalDateTime createdAt;

    // Default constructor
    public Bid() {}

    // Parameterized constructor
    public Bid(String id, Auction auction, String auctionId, String bidderId, String bidderUsername,
               String bidderProfileImage, String walletAddress, String bidAmount,
               String transactionHash, Long blockNumber, LocalDateTime timestamp, LocalDateTime createdAt) {
        this.id = id;
        this.auction = auction;
        this.auctionId = auctionId;
        this.bidderId = bidderId;
        this.bidderUsername = bidderUsername;
        this.bidderProfileImage = bidderProfileImage;
        this.walletAddress = walletAddress;
        this.bidAmount = bidAmount;
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
        this.timestamp = timestamp;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Auction getAuction() {
        return auction;
    }

    public void setAuction(Auction auction) {
        this.auction = auction;
    }

    public String getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(String auctionId) {
        this.auctionId = auctionId;
    }

    public String getBidderId() {
        return bidderId;
    }

    public void setBidderId(String bidderId) {
        this.bidderId = bidderId;
    }

    public String getBidderUsername() {
        return bidderUsername;
    }

    public void setBidderUsername(String bidderUsername) {
        this.bidderUsername = bidderUsername;
    }

    public String getBidderProfileImage() {
        return bidderProfileImage;
    }

    public void setBidderProfileImage(String bidderProfileImage) {
        this.bidderProfileImage = bidderProfileImage;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public String getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(String bidAmount) {
        this.bidAmount = bidAmount;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    public Long getBlockNumber() {
        return blockNumber;
    }

    public void setBlockNumber(Long blockNumber) {
        this.blockNumber = blockNumber;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
