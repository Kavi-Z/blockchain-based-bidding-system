package com.cryptops.bidding.cryptops.repository;

import com.cryptops.bidding.cryptops.model.NFT;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NFTRepository extends MongoRepository<NFT, String> {
    
    // Find NFTs by current owner
    List<NFT> findByCurrentOwnerOrderByAcquiredAtDesc(String currentOwner);
    
    // Find NFTs by status
    List<NFT> findByStatus(NFT.NFTStatus status);
    
    // Find owned NFTs by specific user
    List<NFT> findByCurrentOwnerAndStatus(String currentOwner, NFT.NFTStatus status);
    
    // Find NFT by auction ID
    Optional<NFT> findByAuctionId(String auctionId);
    
    // Find NFTs by token ID
    Optional<NFT> findByTokenId(String tokenId);
    
    // Find NFTs previously owned by user
    List<NFT> findByPreviousOwner(String previousOwner);
    
    // Custom query to find all NFTs currently in auction
    @Query("{ 'status': 'IN_AUCTION' }")
    List<NFT> findAllInAuction();
    
    // Find NFTs owned by user (both OWNED and IN_AUCTION)
    @Query("{ 'currentOwner': ?0, 'status': { $in: ['OWNED', 'IN_AUCTION'] } }")
    List<NFT> findAllByCurrentOwner(String owner);
}