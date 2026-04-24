package com.cryptops.bidding.cryptops.controller;

import com.cryptops.bidding.cryptops.dto.BondAuctionCreateRequest;
import com.cryptops.bidding.cryptops.dto.BondAuctionResponse;
import com.cryptops.bidding.cryptops.model.BondAuction;
import com.cryptops.bidding.cryptops.service.BondAuctionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/bond-auctions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BondAuctionController {

    private static final Logger logger = Logger.getLogger(BondAuctionController.class.getName());

    @Autowired
    private BondAuctionService bondAuctionService;

    @PostMapping
    public ResponseEntity<?> createBondAuction(@Valid @RequestBody BondAuctionCreateRequest request,
                                               HttpServletRequest httpRequest) {
        try {
            String userId = (String) httpRequest.getAttribute("userId");
            if (userId == null || !userId.equals(request.getSellerId())) {
                return ResponseEntity.status(403).body(Map.of(
                        "success", false,
                        "error", "You can only create bond auctions for your own seller account"
                ));
            }
            BondAuction createdAuction = bondAuctionService.createBondAuction(request);
            BondAuctionResponse response = bondAuctionService.getBondAuctionById(createdAuction.getId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Bond auction created successfully",
                    "auction", response
            ));
        } catch (RuntimeException e) {
            logger.warning("Bond auction creation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Unexpected error creating bond auction: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to create bond auction"
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllBondAuctions() {
        try {
            List<BondAuctionResponse> auctions = bondAuctionService.getAllBondAuctions();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", auctions.size(),
                    "auctions", auctions
            ));
        } catch (Exception e) {
            logger.severe("Error fetching bond auctions: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to fetch bond auctions"
            ));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveBondAuctions() {
        try {
            List<BondAuctionResponse> auctions = bondAuctionService.getAllActiveBondAuctions();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", auctions.size(),
                    "auctions", auctions
            ));
        } catch (Exception e) {
            logger.severe("Error fetching active bond auctions: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to fetch active bond auctions"
            ));
        }
    }

    @GetMapping("/won")
    public ResponseEntity<?> getWonBondAuctions(HttpServletRequest httpRequest) {
        try {
            String userId = (String) httpRequest.getAttribute("userId");
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "error", "Authentication required"
                ));
            }
            List<BondAuctionResponse> allAuctions = bondAuctionService.getAllBondAuctions();
            List<BondAuctionResponse> wonAuctions = allAuctions.stream()
                    .filter(a -> "CLOSED".equalsIgnoreCase(a.getStatus()) && userId.equals(a.getLowestBidderId()))
                    .toList();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", wonAuctions.size(),
                    "auctions", wonAuctions
            ));
        } catch (Exception e) {
            logger.severe("Error fetching won bond auctions: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to fetch won bond auctions"
            ));
        }
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<?> getSellerBondAuctions(@PathVariable("sellerId") String sellerId) {
        try {
            List<BondAuctionResponse> auctions = bondAuctionService.getSellerBondAuctions(sellerId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", auctions.size(),
                    "auctions", auctions
            ));
        } catch (IllegalArgumentException e) {
            logger.warning("Invalid seller ID for bond auctions: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Error fetching seller bond auctions: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to fetch bond auctions for seller"
            ));
        }
    }

    @GetMapping("/{auctionId}")
    public ResponseEntity<?> getBondAuctionById(@PathVariable("auctionId") String auctionId) {
        try {
            BondAuctionResponse auction = bondAuctionService.getBondAuctionById(auctionId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "auction", auction
            ));
        } catch (RuntimeException e) {
            logger.warning("Bond auction not found: " + auctionId + ", " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Error fetching bond auction: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to fetch bond auction"
            ));
        }
    }

    @PostMapping("/{auctionId}/end")
    public ResponseEntity<?> endBondAuction(@PathVariable("auctionId") String auctionId,
                                            HttpServletRequest httpRequest) {
        try {
            String userId = (String) httpRequest.getAttribute("userId");
            BondAuction auction = bondAuctionService.getBondAuctionByIdModel(auctionId);
            if (userId == null || !userId.equals(auction.getSellerId())) {
                return ResponseEntity.status(403).body(Map.of(
                        "success", false,
                        "error", "Only the seller can end this bond auction"
                ));
            }
            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(auction.getEndTime())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Auction has not ended yet. Ends at: " + auction.getEndTime()
                ));
            }
            if ("CLOSED".equalsIgnoreCase(auction.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Bond auction is already closed"
                ));
            }
            auction.setStatus("CLOSED");
            bondAuctionService.updateBondAuctionDirect(auction);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Bond auction ended successfully",
                    "winner", auction.getLowestBidderUsername(),
                    "finalBid", auction.getCurrentLowestBid()
            ));
        } catch (RuntimeException e) {
            logger.warning("Error ending bond auction: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Unexpected error ending bond auction: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to end bond auction"
            ));
        }
    }

    @PostMapping("/{auctionId}/finalize")
    public ResponseEntity<?> finalizeBondAuction(@PathVariable("auctionId") String auctionId,
                                                 HttpServletRequest httpRequest) {
        try {
            String userId = (String) httpRequest.getAttribute("userId");
            BondAuction auction = bondAuctionService.getBondAuctionByIdModel(auctionId);
            if (userId == null || !userId.equals(auction.getSellerId())) {
                return ResponseEntity.status(403).body(Map.of(
                        "success", false,
                        "error", "Only the seller can finalize this bond auction"
                ));
            }
            if (!"CLOSED".equalsIgnoreCase(auction.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Bond auction must be closed before finalizing"
                ));
            }
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Bond auction finalized",
                    "winner", auction.getLowestBidderUsername(),
                    "finalBid", auction.getCurrentLowestBid()
            ));
        } catch (RuntimeException e) {
            logger.warning("Error finalizing bond auction: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Unexpected error finalizing bond auction: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to finalize bond auction"
            ));
        }
    }
}
