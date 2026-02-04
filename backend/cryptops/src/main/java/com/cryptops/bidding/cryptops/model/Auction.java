package com.cryptops.bidding.cryptops.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "auctions")
public class Auction {
    
    @Id
    private String id;
    
    @Field("item_name")
    private String itemName;
    
    @Field("image_url")
    private String imageUrl;
    
    @Field("owner_address")
    private String ownerAddress;
    
    @Field("bidding_time")
    private Integer biddingTime;
    
    @Field("min_increment")
    private String minIncrement;
    
    @Field("extension_time")
    private Integer extensionTime;
    
    @Field("max_bid")
    private String maxBid;
    
    @Field("contract_address")
    private String contractAddress;
    
    @Field("transaction_hash")
    private String transactionHash;
    
    @Field("start_time")
    private LocalDateTime startTime;
    
    @Field("end_time")
    private LocalDateTime endTime;
    
    @Field("status")
    private AuctionStatus status;
    
    @Field("highest_bidder")
    private String highestBidder;
    
    @Field("highest_bid_amount")
    private String highestBidAmount;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    public enum AuctionStatus {
        ACTIVE,
        ENDED,
        CANCELLED
    }
}