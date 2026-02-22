package com.cryptops.bidding.cryptops.dto;

public class BidRequest {
    private String auctionId;
    private String bidderWalletAddress;
    private Double bidAmount;
    private String transactionHash;
    private Long blockNumber;

    public BidRequest() {}

    public BidRequest(String auctionId, String bidderWalletAddress, Double bidAmount, String transactionHash, Long blockNumber) {
        this.auctionId = auctionId;
        this.bidderWalletAddress = bidderWalletAddress;
        this.bidAmount = bidAmount;
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
    }

    public String getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(String auctionId) {
        this.auctionId = auctionId;
    }

    public String getBidderWalletAddress() {
        return bidderWalletAddress;
    }

    public void setBidderWalletAddress(String bidderWalletAddress) {
        this.bidderWalletAddress = bidderWalletAddress;
    }

    public Double getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(Double bidAmount) {
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
}
