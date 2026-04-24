package com.cryptops.bidding.cryptops.repository;

import com.cryptops.bidding.cryptops.model.BondAuction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BondAuctionRepository extends MongoRepository<BondAuction, String> {

    List<BondAuction> findBySellerIdOrderByStartTimeDesc(String sellerId);

    List<BondAuction> findByStatus(String status);
}
