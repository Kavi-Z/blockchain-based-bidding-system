package com.cryptops.bidding.cryptops.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "nfts")
public class NFT {

    @Id
    private String id;

    @Field("name")
    private String name;

    @Field("image_url")
    private String imageUrl;

    @Field("current_owner")
    private String currentOwner;

    @Field("previous_owner")
    private String previousOwner;

    @Field("auction_id")
    private String auctionId;

    @Field("status")
    private NFTStatus status;

    @Field("token_id")
    private String tokenId;

    @Field("description")
    private String description;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    @Field("acquired_at")
    private LocalDateTime acquiredAt;

    public enum NFTStatus {
        OWNED,           // User owns this NFT
        IN_AUCTION,      // NFT is currently in an auction
        TRANSFERRED      // NFT was transferred to another user
    }

    // Default constructor
    public NFT() {}

    // Parameterized constructor
    public NFT(String id, String name, String imageUrl, String currentOwner, String previousOwner,
               String auctionId, NFTStatus status, String tokenId, String description,
               LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime acquiredAt) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.currentOwner = currentOwner;
        this.previousOwner = previousOwner;
        this.auctionId = auctionId;
        this.status = status;
        this.tokenId = tokenId;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.acquiredAt = acquiredAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCurrentOwner() {
        return currentOwner;
    }

    public void setCurrentOwner(String currentOwner) {
        this.currentOwner = currentOwner;
    }

    public String getPreviousOwner() {
        return previousOwner;
    }

    public void setPreviousOwner(String previousOwner) {
        this.previousOwner = previousOwner;
    }

    public String getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(String auctionId) {
        this.auctionId = auctionId;
    }

    public NFTStatus getStatus() {
        return status;
    }

    public void setStatus(NFTStatus status) {
        this.status = status;
    }

    public String getTokenId() {
        return tokenId;
    }

    public void setTokenId(String tokenId) {
        this.tokenId = tokenId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getAcquiredAt() {
        return acquiredAt;
    }

    public void setAcquiredAt(LocalDateTime acquiredAt) {
        this.acquiredAt = acquiredAt;
    }
}
