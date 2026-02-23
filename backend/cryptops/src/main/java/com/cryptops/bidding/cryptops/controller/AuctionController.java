package com.cryptops.bidding.cryptops.controller;

import com.cryptops.bidding.cryptops.dto.AuctionCreateRequest;
import com.cryptops.bidding.cryptops.dto.AuctionResponse;
import com.cryptops.bidding.cryptops.exception.UnauthorizedException;
import com.cryptops.bidding.cryptops.model.Auction;
import com.cryptops.bidding.cryptops.model.NFT;
import com.cryptops.bidding.cryptops.repository.NFTRepository;
import com.cryptops.bidding.cryptops.service.AuctionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuctionController {

    private static final Logger logger = Logger.getLogger(AuctionController.class.getName());

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private NFTRepository nftRepository;

    /**
     * Create a new auction (Seller only)
     * Requires: Authorization token with seller ID
     */
    @PostMapping
    public ResponseEntity<?> createAuction(@Valid @RequestBody AuctionCreateRequest request, 
                                           HttpServletRequest httpRequest) {
        try {
            // Extract user ID from token via filter
            String userId = (String) httpRequest.getAttribute("userId");
            
            // Verify user ID matches seller ID in request
            if (userId == null || !userId.equals(request.getSellerId())) {
                throw new UnauthorizedException("You can only create auctions for your own seller account");
            }

            logger.info("Creating auction for seller: " + userId);
            
            // Create auction via service
            Auction createdAuction = auctionService.createAuction(request);
            
            AuctionResponse response = convertToResponse(createdAuction);
            
            logger.info("Auction created successfully: " + createdAuction.getId());
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Auction created successfully",
                    "auction", response
            ));

        } catch (UnauthorizedException e) {
            logger.warning("Unauthorized auction creation: " + e.getMessage());
            return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (RuntimeException e) {
            logger.warning("Auction creation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Unexpected error creating auction: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to create auction: " + e.getMessage()
            ));
        }
    }

    /**
     * Get all auctions (paginated)
     */
    @GetMapping
    public ResponseEntity<?> getAllAuctions() {
        try {
            List<AuctionResponse> auctions = auctionService.getAllActiveAuctions();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", auctions.size(),
                    "auctions", auctions
            ));
        } catch (Exception e) {
            logger.severe("Error fetching auctions: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to fetch auctions"
            ));
        }
    }

    /**
     * Get auctions by seller ID
     */
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<?> getSellerAuctions(@PathVariable("sellerId") String sellerId,
                                               HttpServletRequest httpRequest) {
        try {
            // Optional: Verify the requesting user is the seller (for privacy)
            String userId = (String) httpRequest.getAttribute("userId");
            if (userId != null && !userId.equals(sellerId)) {
                logger.warning("User " + userId + " tried to access seller " + sellerId + "'s auctions");
                // Note: You can make this stricter if needed - for now allow it
            }

            // Validate sellerId format
            if (sellerId == null || sellerId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Seller ID is required"
                ));
            }

            List<AuctionResponse> auctions = auctionService.getSellerAuctions(sellerId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", auctions.size(),
                    "auctions", auctions
            ));

        } catch (IllegalArgumentException e) {
            logger.warning("Invalid seller ID: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (RuntimeException e) {
            logger.warning("Error fetching seller auctions: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Unexpected error fetching seller auctions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Internal server error: " + e.getMessage()
            ));
        }
    }

    /**
     * Get auction by ID
     */
    @GetMapping("/{auctionId}")
    public ResponseEntity<?> getAuctionById(@PathVariable("auctionId") String auctionId) {
        try {
            AuctionResponse auction = auctionService.getAuctionById(auctionId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "auction", auction
            ));

        } catch (RuntimeException e) {
            logger.warning("Auction not found: " + auctionId);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Error fetching auction: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to fetch auction"
            ));
        }
    }

    /**
     * End an auction and transfer NFT to highest bidder
     */
    @PostMapping("/{auctionId}/end")
    public ResponseEntity<?> endAuction(@PathVariable("auctionId") String auctionId, 
                                        HttpServletRequest httpRequest) {
        try {
            String userId = (String) httpRequest.getAttribute("userId");
            
            Auction auction = auctionService.getAuctionByIdModel(auctionId);
            
            // Verify seller is ending their own auction
            if (userId == null || !userId.equals(auction.getSellerId())) {
                return ResponseEntity.status(403).body(Map.of(
                        "success", false,
                        "error", "Only the seller can end this auction"
                ));
            }

            // Check if auction has actually ended
            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(auction.getEndTime())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Auction has not ended yet. Ends at: " + auction.getEndTime()
                ));
            }

            // Check if already closed
            if ("CLOSED".equalsIgnoreCase(auction.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Auction is already closed"
                ));
            }

            // Update auction status
            auction.setStatus("CLOSED");
            auctionService.updateAuctionDirect(auction);

            logger.info("Auction " + auctionId + " closed. Winner: " + auction.getHighestBidderUsername());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Auction ended successfully",
                    "winner", auction.getHighestBidderUsername(),
                    "finalBid", auction.getCurrentHighestBid()
            ));

        } catch (RuntimeException e) {
            logger.warning("Error ending auction: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Unexpected error ending auction: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Unexpected error ending auction: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/{auctionId}/finalize")
    public ResponseEntity<?> finalizeAuctionAndTransferNFT(@PathVariable String auctionId) {
        try {
            // Get the auction
            Auction auction = auctionService.getAuctionByIdModel(auctionId);
            
            // Check if auction has ended
            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(auction.getEndTime())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Auction has not ended yet. Ends at: " + auction.getEndTime()
                ));
            }

            // Check if no bids were placed
            if (auction.getHighestBidderId() == null || auction.getHighestBidderId().isEmpty()) {
                auction.setStatus("CLOSED");
                auctionService.updateAuctionDirect(auction);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Auction ended with no bids",
                        "nftTransferred", false
                ));
            }

            // Check if already finalized
            if ("CLOSED".equalsIgnoreCase(auction.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Auction is already finalized"
                ));
            }

            // Update auction status to CLOSED
            auction.setStatus("CLOSED");
            auctionService.updateAuctionDirect(auction);
            
            // Find and transfer NFT to highest bidder
            Optional<NFT> nftOpt = nftRepository.findByAuctionId(auctionId);
            if (nftOpt.isPresent()) {
                NFT nft = nftOpt.get();
                nft.setPreviousOwner(nft.getCurrentOwner());
                nft.setCurrentOwner(auction.getHighestBidderId());
                nft.setStatus(NFT.NFTStatus.OWNED);
                nft.setAcquiredAt(LocalDateTime.now());
                nft.setUpdatedAt(LocalDateTime.now());
                nftRepository.save(nft);
                
                logger.info("NFT transferred from seller to bidder: " + auction.getHighestBidderUsername() + 
                           " for auction: " + auctionId);

                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Auction finalized and NFT transferred to winner",
                        "auctionId", auctionId,
                        "winner", auction.getHighestBidderUsername(),
                        "finalBid", auction.getCurrentHighestBid(),
                        "nftId", nft.getId(),
                        "nftName", nft.getName(),
                        "nftTransferred", true
                ));
            } else {
                // No NFT found for this auction
                logger.warning("No NFT found for auction: " + auctionId);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Auction finalized but no NFT to transfer",
                        "auctionId", auctionId,
                        "winner", auction.getHighestBidderUsername(),
                        "finalBid", auction.getCurrentHighestBid(),
                        "nftTransferred", false
                ));
            }

        } catch (RuntimeException e) {
            logger.warning("Error finalizing auction: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Unexpected error finalizing auction: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Failed to finalize auction: " + e.getMessage()
            ));
        }
    }

    /**
     * Get auction with live bidding information
     * Shows current state including highest bidder and bid history
     */
    @GetMapping("/{auctionId}/details")
    public ResponseEntity<?> getAuctionDetails(@PathVariable String auctionId) {
        try {
            Auction auction = auctionService.getAuctionByIdModel(auctionId);
            
            LocalDateTime now = LocalDateTime.now();
            boolean hasStarted = now.isAfter(auction.getStartTime());
            boolean hasEnded = now.isAfter(auction.getEndTime());
            
            AuctionResponse response = convertToResponse(auction);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "auction", response,
                    "hasStarted", hasStarted,
                    "hasEnded", hasEnded,
                    "timeRemaining", java.time.temporal.ChronoUnit.SECONDS.between(now, auction.getEndTime()),
                    "highestBidderId", auction.getHighestBidderId(),
                    "highestBidderUsername", auction.getHighestBidderUsername(),
                    "currentHighestBid", auction.getCurrentHighestBid()
            ));

        } catch (RuntimeException e) {
            logger.warning("Error fetching auction details: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Convert Auction to AuctionResponse
     */
    private AuctionResponse convertToResponse(Auction auction) {
        AuctionResponse response = new AuctionResponse();
        response.setId(auction.getId());
        response.setItemName(auction.getItemName());
        response.setDescription(auction.getDescription());
        response.setImageUrl(auction.getImageUrl());
        response.setSellerId(auction.getSellerId());
        response.setSellerUsername(auction.getSellerUsername());
        response.setStartingPrice(auction.getStartingPrice());
        response.setCurrentHighestBid(auction.getCurrentHighestBid());
        response.setHighestBidderId(auction.getHighestBidderId());
        response.setHighestBidderUsername(auction.getHighestBidderUsername());
        response.setStartTime(auction.getStartTime());
        response.setEndTime(auction.getEndTime());
        response.setStatus(auction.getStatus());
        response.setBiddingTime(auction.getBiddingTime());
        response.setMinIncrement(auction.getMinIncrement());
        response.setExtensionTime(auction.getExtensionTime());
        response.setMaxBid(auction.getMaxBid());
        response.setTransactionHash(auction.getTransactionHash());
        response.setBlockNumber(auction.getBlockNumber());
        response.setOwnerAddress(auction.getOwnerAddress());
        response.setContractAddress(auction.getContractAddress());
        return response;
    }
}
