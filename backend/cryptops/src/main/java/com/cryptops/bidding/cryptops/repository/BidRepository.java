package com.cryptops.bidding.cryptops.repository;

import com.cryptops.bidding.cryptops.model.Bid;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends MongoRepository<Bid, String> {
     
    List<Bid> findByAuctionIdOrderByTimestampDesc(String auctionId);
     
    List<Bid> findByWalletAddressOrderByTimestampDesc(String walletAddress);
     
    Long countByAuctionId(String auctionId);
     
    Optional<Bid> findByTransactionHash(String transactionHash);
     
    List<Bid> findByWalletAddressAndAuctionIdOrderByTimestampDesc(String walletAddress, String auctionId);
     
    @Query(value = "{ 'auctionId': ?0 }", sort = "{ 'bidAmount': -1 }")
    Optional<Bid> findHighestBidForAuction(String auctionId);
     
    @Query(value = "{}", sort = "{ 'timestamp': -1 }")
    List<Bid> findRecentBids();
}