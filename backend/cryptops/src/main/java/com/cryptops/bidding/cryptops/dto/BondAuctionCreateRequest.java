package com.cryptops.bidding.cryptops.dto;

import jakarta.validation.constraints.*;

public class BondAuctionCreateRequest {

    @NotBlank(message = "Item name is required")
    @Size(min = 3, max = 100, message = "Item name must be between 3 and 100 characters")
    private String itemName;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    @NotNull(message = "Starting price is required")
    @DecimalMin(value = "0.01", message = "Starting price must be greater than 0")
    private Double startingPrice;

    @NotNull(message = "Bidding time is required")
    @Min(value = 1, message = "Bidding time must be at least 1 minute")
    @Max(value = 10080, message = "Bidding time cannot exceed 7 days (10080 minutes)")
    private Integer biddingTime;

    @NotNull(message = "Minimum decrement is required")
    @DecimalMin(value = "0.01", message = "Minimum decrement must be greater than 0")
    private Double minIncrement;

    @NotNull(message = "Extension time is required")
    @Min(value = 0, message = "Extension time cannot be negative")
    @Max(value = 120, message = "Extension time cannot exceed 120 minutes")
    private Integer extensionTime;

    @DecimalMin(value = "0.0", message = "Max bid cannot be negative")
    private Double maxBid;

    @NotBlank(message = "Seller ID is required")
    private String sellerId;

    private String imageCID;
    private String sellerWalletAddress;
    private String contractAddress;
    private String transactionHash;
    private Long blockNumber;

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(Double startingPrice) {
        this.startingPrice = startingPrice;
    }

    public Integer getBiddingTime() {
        return biddingTime;
    }

    public void setBiddingTime(Integer biddingTime) {
        this.biddingTime = biddingTime;
    }

    public Double getMinIncrement() {
        return minIncrement;
    }

    public void setMinIncrement(Double minIncrement) {
        this.minIncrement = minIncrement;
    }

    public Integer getExtensionTime() {
        return extensionTime;
    }

    public void setExtensionTime(Integer extensionTime) {
        this.extensionTime = extensionTime;
    }

    public Double getMaxBid() {
        return maxBid;
    }

    public void setMaxBid(Double maxBid) {
        this.maxBid = maxBid;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getImageCID() {
        return imageCID;
    }

    public void setImageCID(String imageCID) {
        this.imageCID = imageCID;
    }

    public String getSellerWalletAddress() {
        return sellerWalletAddress;
    }

    public void setSellerWalletAddress(String sellerWalletAddress) {
        this.sellerWalletAddress = sellerWalletAddress;
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
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
