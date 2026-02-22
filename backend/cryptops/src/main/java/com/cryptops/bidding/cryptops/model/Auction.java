package com.cryptops.bidding.cryptops.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Document(collection = "auctions")
public class Auction {

    @Id
    private String id;

    @NotBlank(message = "Item name is required")
    @Size(min = 3, max = 100, message = "Item name must be between 3 and 100 characters")
    private String itemName;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    private String imageUrl;

    // Seller Info
    @Indexed
    @NotBlank(message = "Seller ID is required")
    private String sellerId;

    private String sellerUsername;

    // Blockchain Info
    private String ownerAddress;
    private String contractAddress;
    private String transactionHash;
    private Long blockNumber;

    // Auction Rules
    @NotNull(message = "Bidding time is required")
    @Min(value = 1, message = "Bidding time must be at least 1 minute")
    @Max(value = 10080, message = "Bidding time cannot exceed 7 days")
    private Integer biddingTime;        // in minutes

    @NotNull(message = "Minimum increment is required")
    @DecimalMin(value = "0.01", message = "Minimum increment must be greater than 0")
    private Double minIncrement;        // minimum bid increase

    @NotNull(message = "Extension time is required")
    @Min(value = 0, message = "Extension time cannot be negative")
    @Max(value = 120, message = "Extension time cannot exceed 120 minutes")
    private Integer extensionTime;      // in minutes

    @DecimalMin(value = "0.0", message = "Max bid cannot be negative")
    private Double maxBid;              // optional max cap

    // Bidding State
    @NotNull(message = "Starting price is required")
    @DecimalMin(value = "0.01", message = "Starting price must be greater than 0")
    private Double startingPrice;

    @NotNull(message = "Current highest bid is required")
    @DecimalMin(value = "0.0", message = "Current highest bid cannot be negative")
    private Double currentHighestBid;

    private String highestBidderId;
    private String highestBidderUsername;

    // Timing
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // Status: ACTIVE / CLOSED / CANCELLED
    @Indexed
    @NotBlank(message = "Status is required")
    private String status;

    // ================= GETTERS & SETTERS =================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerUsername() {
        return sellerUsername;
    }

    public void setSellerUsername(String sellerUsername) {
        this.sellerUsername = sellerUsername;
    }

    public String getOwnerAddress() {
        return ownerAddress;
    }

    public void setOwnerAddress(String ownerAddress) {
        this.ownerAddress = ownerAddress;
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

    public Double getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(Double startingPrice) {
        this.startingPrice = startingPrice;
    }

    public Double getCurrentHighestBid() {
        return currentHighestBid;
    }

    public void setCurrentHighestBid(Double currentHighestBid) {
        this.currentHighestBid = currentHighestBid;
    }

    public String getHighestBidderId() {
        return highestBidderId;
    }

    public void setHighestBidderId(String highestBidderId) {
        this.highestBidderId = highestBidderId;
    }

    public String getHighestBidderUsername() {
        return highestBidderUsername;
    }

    public void setHighestBidderUsername(String highestBidderUsername) {
        this.highestBidderUsername = highestBidderUsername;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
