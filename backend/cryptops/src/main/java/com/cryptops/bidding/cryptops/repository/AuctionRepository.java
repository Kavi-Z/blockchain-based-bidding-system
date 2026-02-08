package com.cryptops.bidding.cryptops.repository;

import com.cryptops.bidding.cryptops.model.Auction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionRepository extends MongoRepository<Auction, String> {
    
    // Find all auctions ordered by start time descending
    List<Auction> findAllByOrderByStartTimeDesc();
    
    // Find auctions by owner address
    List<Auction> findByOwnerAddressOrderByStartTimeDesc(String ownerAddress);
    
    // Find auctions by status
    List<Auction> findByStatus(Auction.AuctionStatus status);
    
    // Find the most recent active auction
    Optional<Auction> findTopByStatusOrderByStartTimeDesc(Auction.AuctionStatus status);
    
    // Find by contract address
    Optional<Auction> findByContractAddress(String contractAddress);
    
    // Find active auctions by owner
    List<Auction> findByOwnerAddressAndStatus(String ownerAddress, Auction.AuctionStatus status);
    
    // Custom query to find auctions ending soon
    @Query("{ 'status': 'ACTIVE', 'endTime': { $lte: ?0 } }")
    List<Auction> findAuctionsEndingSoon(java.time.LocalDateTime dateTime);
}