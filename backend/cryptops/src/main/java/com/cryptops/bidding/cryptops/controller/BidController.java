package com.cryptops.bidding.cryptops.controller;

import com.cryptops.bidding.cryptops.dto.BidRequest;
import com.cryptops.bidding.cryptops.model.Auction;
import com.cryptops.bidding.cryptops.model.Bid;
import com.cryptops.bidding.cryptops.model.User;
import com.cryptops.bidding.cryptops.repository.AuctionRepository;
import com.cryptops.bidding.cryptops.repository.BidRepository;
import com.cryptops.bidding.cryptops.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BidController {

    private static final Logger logger = Logger.getLogger(BidController.class.getName());

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private UserRepository userRepository;
 
    @PostMapping
    public ResponseEntity<?> placeBid(@RequestBody BidRequest request, HttpServletRequest httpRequest) {
        try {
            String userId = (String) httpRequest.getAttribute("userId");
            
            if (request.getAuctionId() == null || request.getAuctionId().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Auction ID is required"
                ));
            }

            if (request.getBidAmount() == null || request.getBidAmount() <= 0) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Bid amount must be greater than 0"
                ));
            }

            // Fetch auction
            Auction auction = auctionRepository.findById(request.getAuctionId())
                    .orElseThrow(() -> new RuntimeException("Auction not found"));

            // Verify auction is active
            if (!"ACTIVE".equalsIgnoreCase(auction.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Auction is not active"
                ));
            }
 
            LocalDateTime now = LocalDateTime.now();
            if (now.isAfter(auction.getEndTime())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Auction has ended"
                ));
            }
 
            double minBid = auction.getCurrentHighestBid() + auction.getMinIncrement();
            if (request.getBidAmount() < minBid) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Bid must be at least $" + String.format("%.2f", minBid)
                ));
            }
 
            if (auction.getMaxBid() != null && auction.getMaxBid() > 0 && request.getBidAmount() > auction.getMaxBid()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Bid exceeds maximum allowed bid"
                ));
            }
 
            String bidderUsername = "Anonymous";
            if (userId != null && !userId.isEmpty()) {
                User bidder = userRepository.findById(userId).orElse(null);
                if (bidder != null) {
                    bidderUsername = bidder.getUsername();
                }
            }
 
            Bid bid = new Bid();
            bid.setAuctionId(request.getAuctionId());
            bid.setWalletAddress(request.getBidderWalletAddress());
            bid.setBidAmount(String.valueOf(request.getBidAmount()));
            bid.setTransactionHash(request.getTransactionHash());
            bid.setTimestamp(LocalDateTime.now());
            bid.setCreatedAt(LocalDateTime.now());

            Bid savedBid = bidRepository.save(bid);
            logger.info("Bid saved: " + savedBid.getId() + " for auction: " + request.getAuctionId());
 
            auction.setCurrentHighestBid(request.getBidAmount());
            auction.setHighestBidderId(userId);
            auction.setHighestBidderUsername(bidderUsername);
             
            if (auction.getExtensionTime() > 0) {
                long msUntilEnd = auction.getEndTime().atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli() - System.currentTimeMillis();
                long extensionMs = auction.getExtensionTime() * 60 * 1000L;
                
                if (msUntilEnd < extensionMs) {
                    auction.setEndTime(auction.getEndTime().plusMinutes(auction.getExtensionTime()));
                    logger.info("Auction extended. New end time: " + auction.getEndTime());
                }
            }

            auctionRepository.save(auction);
            logger.info("Auction updated with new highest bid: " + request.getBidAmount());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Bid placed successfully",
                    "bid", Map.of(
                            "id", savedBid.getId(),
                            "auctionId", savedBid.getAuctionId(),
                            "bidAmount", savedBid.getBidAmount(),
                            "timestamp", savedBid.getTimestamp()
                    )
            ));

        } catch (RuntimeException e) {
            logger.warning("Bid placement failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Error placing bid: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to place bid: " + e.getMessage()
            ));
        }
    }
 
    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<?> getAuctionBids(@PathVariable String auctionId) {
        try {
            List<Bid> bids = bidRepository.findByAuctionIdOrderByTimestampDesc(auctionId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", bids.size(),
                    "bids", bids
            ));

        } catch (Exception e) {
            logger.severe("Error fetching bids: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to fetch bids"
            ));
        }
    }
 
    @GetMapping("/{bidId}")
    public ResponseEntity<?> getBidById(@PathVariable String bidId) {
        try {
            Bid bid = bidRepository.findById(bidId)
                    .orElseThrow(() -> new RuntimeException("Bid not found"));
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "bid", bid
            ));

        } catch (RuntimeException e) {
            logger.warning("Bid not found: " + bidId);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}
