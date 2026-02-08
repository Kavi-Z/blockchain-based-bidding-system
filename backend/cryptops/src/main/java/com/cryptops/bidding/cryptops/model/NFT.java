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
}