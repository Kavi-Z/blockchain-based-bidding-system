package com.cryptops.bidding.cryptops.repository;

import com.cryptops.bidding.cryptops.model.Auction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AuctionRepository extends MongoRepository<Auction, String> {

    List<Auction> findBySellerIdOrderByStartTimeDesc(String sellerId);

    List<Auction> findByStatus(String status);

}
