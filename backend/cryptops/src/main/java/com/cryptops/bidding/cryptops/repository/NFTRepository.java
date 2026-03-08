package com.cryptops.bidding.cryptops.repository;

import com.cryptops.bidding.cryptops.model.NFT;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NFTRepository extends MongoRepository<NFT, String> {
     
    List<NFT> findByCurrentOwnerOrderByAcquiredAtDesc(String currentOwner);
     
    List<NFT> findByStatus(NFT.NFTStatus status);
     
    List<NFT> findByCurrentOwnerAndStatus(String currentOwner, NFT.NFTStatus status);
     
    Optional<NFT> findByAuctionId(String auctionId);
     
    Optional<NFT> findByTokenId(String tokenId);
     
    List<NFT> findByPreviousOwner(String previousOwner);
     
    @Query("{ 'status': 'IN_AUCTION' }")
    List<NFT> findAllInAuction();
     
    @Query("{ 'currentOwner': ?0, 'status': { $in: ['OWNED', 'IN_AUCTION'] } }")
    List<NFT> findAllByCurrentOwner(String owner);
}