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
import java.util.LinkedHashMap;
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
            
            // Validate authentication
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "error", "Authentication required. Please login to place a bid."
                ));
            }
            
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
            @SuppressWarnings("null")
            Auction auction = auctionRepository.findById((String) request.getAuctionId())
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
            @SuppressWarnings("null")
            Bid bid = bidRepository.findById((String) bidId)
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
    
    /**
     * Get current bidding status for an auction
     * Shows highest bidder info, current bid amount, bid count
     */
    @GetMapping("/auction/{auctionId}/status")
    public ResponseEntity<?> getAuctionBiddingStatus(@PathVariable String auctionId) {
        try {
            @SuppressWarnings("null")
            Auction auction = auctionRepository.findById((String) auctionId)
                    .orElseThrow(() -> new RuntimeException("Auction not found"));
            
            List<Bid> allBids = bidRepository.findByAuctionIdOrderByTimestampDesc(auctionId);
            
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("success", true);
            response.put("auctionId", auctionId);
            response.put("itemName", auction.getItemName());
            response.put("status", auction.getStatus());
            response.put("startTime", auction.getStartTime());
            response.put("endTime", auction.getEndTime());
            response.put("currentHighestBid", auction.getCurrentHighestBid());
            response.put("highestBidderId", auction.getHighestBidderId());
            response.put("highestBidderUsername", auction.getHighestBidderUsername());
            response.put("totalBids", allBids.size());
            response.put("minIncrement", auction.getMinIncrement());
            response.put("startingPrice", auction.getStartingPrice());
            response.put("bids", allBids);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            logger.warning("Error fetching auction bidding status: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Get user's bid history
     * Shows all bids placed by the authenticated user
     */
    @GetMapping("/user/history")
    public ResponseEntity<?> getUserBidHistory(HttpServletRequest httpRequest) {
        try {
            String userId = (String) httpRequest.getAttribute("userId");
            
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "error", "Authentication required"
                ));
            }
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Get all bids by this user across all auctions
            List<Bid> userBids = bidRepository.findByWalletAddressOrderByTimestampDesc(user.getWalletAddress() != null ? user.getWalletAddress() : "");
            
            // Enrich with auction details
            java.util.List<Map<String, Object>> enrichedBids = new java.util.ArrayList<>();
            for (Bid bid : userBids) {
                @SuppressWarnings("null")
                Auction auction = auctionRepository.findById((String) bid.getAuctionId()).orElse(null);
                if (auction != null) {
                    enrichedBids.add(Map.of(
                            "bidId", bid.getId(),
                            "auctionId", bid.getAuctionId(),
                            "itemName", auction.getItemName(),
                            "bidAmount", bid.getBidAmount(),
                            "timestamp", bid.getTimestamp(),
                            "isHighestBid", auction.getHighestBidderId() != null && auction.getHighestBidderId().equals(userId),
                            "auctionStatus", auction.getStatus(),
                            "imageUrl", auction.getImageUrl()
                    ));
                }
            }
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "userId", userId,
                    "username", user.getUsername(),
                    "totalBids", enrichedBids.size(),
                    "bids", enrichedBids
            ));
            
        } catch (RuntimeException e) {
            logger.warning("Error fetching user bid history: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}


