package com.cryptops.bidding.cryptops.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "bids")
public class Bid {
    
    @Id
    private String id;
    
    @DBRef
    @Field("auction")
    private Auction auction;
    
    @Field("auction_id")
    private String auctionId;
    
    @Field("wallet_address")
    private String walletAddress;
    
    @Field("bid_amount")
    private String bidAmount;
    
    @Field("transaction_hash")
    private String transactionHash;
    
    @Field("timestamp")
    private LocalDateTime timestamp;
    
    @Field("created_at")
    private LocalDateTime createdAt;
}