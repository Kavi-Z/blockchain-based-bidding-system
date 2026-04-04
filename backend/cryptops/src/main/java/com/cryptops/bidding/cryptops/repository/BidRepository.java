package com.cryptops.bidding.cryptops.repository;

import com.cryptops.bidding.cryptops.model.Bid;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends MongoRepository<Bid, String> {
    
    // Find all bids for a specific auction
    List<Bid> findByAuctionIdOrderByTimestampDesc(String auctionId);
    
    // Find all bids by a specific wallet address
    List<Bid> findByWalletAddressOrderByTimestampDesc(String walletAddress);
    
    // Count bids for an auction
    Long countByAuctionId(String auctionId);
    
    // Find bid by transaction hash
    Optional<Bid> findByTransactionHash(String transactionHash);
    
    // Find bids by wallet address and auction
    List<Bid> findByWalletAddressAndAuctionIdOrderByTimestampDesc(String walletAddress, String auctionId);
    
    // Custom query to find highest bid for an auction
    @Query(value = "{ 'auctionId': ?0 }", sort = "{ 'bidAmount': -1 }")
    Optional<Bid> findHighestBidForAuction(String auctionId);
    
    // Find recent bids (last N bids)
    @Query(value = "{}", sort = "{ 'timestamp': -1 }")
    List<Bid> findRecentBids();
}