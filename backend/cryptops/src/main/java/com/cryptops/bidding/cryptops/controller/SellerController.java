package com.cryptops.bidding.cryptops.controller;

import com.cryptops.bidding.cryptops.model.Auction;
import com.cryptops.bidding.cryptops.repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/seller")
@CrossOrigin(origins = "http://localhost:5173")
public class SellerController {

    @Autowired
    private AuctionRepository auctionRepository;

    // ✅ CREATE AUCTION
    @PostMapping("/auction")
    public Auction createAuction(@RequestBody Auction auction) {

        // Backend controls these (NOT frontend)
        auction.setStatus("ACTIVE");

        LocalDateTime now = LocalDateTime.now();
        auction.setStartTime(now);

        // Calculate end time
        auction.setEndTime(now.plusMinutes(auction.getBiddingTime()));

        return auctionRepository.save(auction);
    }

    // ✅ GET SELLER AUCTIONS
    @GetMapping("/auctions/{sellerId}")
    public List<Auction> getSellerAuctions(@PathVariable("sellerId") String sellerId) {
        return auctionRepository.findBySellerIdOrderByStartTimeDesc(sellerId);
    }
}
