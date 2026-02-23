package com.cryptops.bidding.cryptops.service;

import com.cryptops.bidding.cryptops.dto.AuctionCreateRequest;
import com.cryptops.bidding.cryptops.dto.AuctionResponse;
import com.cryptops.bidding.cryptops.model.Auction;
import com.cryptops.bidding.cryptops.model.User;
import com.cryptops.bidding.cryptops.repository.AuctionRepository;
import com.cryptops.bidding.cryptops.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class AuctionService {

    private static final Logger logger = Logger.getLogger(AuctionService.class.getName());

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new auction with proper validation and initialization
     */
    public Auction createAuction(AuctionCreateRequest request) {
        try {
            // Validate seller exists
            User seller = userRepository.findById(request.getSellerId())
                    .orElseThrow(() -> new RuntimeException("Seller not found with ID: " + request.getSellerId()));

            // Validate seller is actually a seller
            if (!"SELLER".equalsIgnoreCase(seller.getRole())) {
                throw new RuntimeException("User is not authorized as a seller");
            }

            // Validate auction parameters
            validateAuctionRequest(request);

            // Create auction entity
            Auction auction = new Auction();
            
            // Item details
            auction.setItemName(request.getItemName());
            auction.setDescription(request.getDescription());
            auction.setImageUrl(request.getImageCID()); // IPFS URL from Pinata

            // Seller info (using ID, not wallet address)
            auction.setSellerId(request.getSellerId());
            auction.setSellerUsername(seller.getUsername());

            // Blockchain info
            auction.setOwnerAddress(request.getSellerWalletAddress());
            auction.setContractAddress(request.getContractAddress());
            auction.setTransactionHash(request.getTransactionHash());
            auction.setBlockNumber(request.getBlockNumber());

            // Auction rules
            auction.setBiddingTime(request.getBiddingTime());
            auction.setMinIncrement(request.getMinIncrement());
            auction.setExtensionTime(request.getExtensionTime());
            auction.setMaxBid(request.getMaxBid());

            // Bidding state initialization
            auction.setStartingPrice(request.getStartingPrice());
            auction.setCurrentHighestBid(request.getStartingPrice()); // Initialize to starting price
            auction.setHighestBidderId(null); // No bids yet
            auction.setHighestBidderUsername(null);

            // Timing
            LocalDateTime now = LocalDateTime.now();
            auction.setStartTime(now);
            auction.setEndTime(now.plusMinutes(request.getBiddingTime()));

            // Status
            auction.setStatus("ACTIVE");

            // Save to database
            Auction savedAuction = auctionRepository.save(auction);
            logger.info("Auction created successfully: " + savedAuction.getId() + " by seller: " + request.getSellerId());

            return savedAuction;

        } catch (RuntimeException e) {
            logger.severe("Error creating auction: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.severe("Unexpected error creating auction: " + e.getMessage());
            throw new RuntimeException("Failed to create auction: " + e.getMessage());
        }
    }

    /**
     * Validate auction request parameters
     */
    private void validateAuctionRequest(AuctionCreateRequest request) {
        // Starting price validation
        if (request.getStartingPrice() == null || request.getStartingPrice() <= 0) {
            throw new RuntimeException("Starting price must be greater than 0");
        }

        // Bidding time validation
        if (request.getBiddingTime() == null || request.getBiddingTime() < 1) {
            throw new RuntimeException("Bidding time must be at least 1 minute");
        }

        if (request.getBiddingTime() > 10080) { // 7 days
            throw new RuntimeException("Bidding time cannot exceed 7 days (10080 minutes)");
        }

        // Minimum increment validation
        if (request.getMinIncrement() == null || request.getMinIncrement() <= 0) {
            throw new RuntimeException("Minimum increment must be greater than 0");
        }

        // Extension time validation
        if (request.getExtensionTime() == null || request.getExtensionTime() < 0) {
            throw new RuntimeException("Extension time cannot be negative");
        }

        if (request.getExtensionTime() > 120) {
            throw new RuntimeException("Extension time cannot exceed 120 minutes");
        }

        // Max bid validation (optional but must be positive if provided)
        if (request.getMaxBid() != null && request.getMaxBid() < request.getStartingPrice()) {
            throw new RuntimeException("Maximum bid cannot be less than starting price");
        }

        // Item name and description validation
        if (request.getItemName() == null || request.getItemName().trim().isEmpty()) {
            throw new RuntimeException("Item name is required");
        }

        if (request.getItemName().length() < 3 || request.getItemName().length() > 100) {
            throw new RuntimeException("Item name must be between 3 and 100 characters");
        }

        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Description is required");
        }

        if (request.getDescription().length() < 10 || request.getDescription().length() > 1000) {
            throw new RuntimeException("Description must be between 10 and 1000 characters");
        }
    }

    /**
     * Get all auctions for a specific seller
     */
    public List<AuctionResponse> getSellerAuctions(String sellerId) {
        // Validate sellerId is not null or empty
        if (sellerId == null || sellerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Seller ID cannot be null or empty");
        }

        try {
            // Optional: Verify seller exists (log warning if not)
            userRepository.findById(sellerId).ifPresentOrElse(
                    user -> logger.info("Fetching auctions for seller: " + user.getUsername()),
                    () -> logger.warning("Seller not found: " + sellerId)
            );
        } catch (Exception e) {
            logger.warning("Error verifying seller existence: " + e.getMessage());
            // Continue anyway - don't fail the request
        }

        List<Auction> auctions = auctionRepository.findBySellerIdOrderByStartTimeDesc(sellerId);
        return auctions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all auctions (both ACTIVE and CLOSED)
     */
    public List<AuctionResponse> getAllAuctions() {
        // Return all auctions regardless of status
        List<Auction> auctions = auctionRepository.findAll();
        return auctions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all active auctions
     */
    public List<AuctionResponse> getAllActiveAuctions() {
        List<Auction> auctions = auctionRepository.findByStatus("ACTIVE");
        return auctions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get auction by ID
     */
    public AuctionResponse getAuctionById(String auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
        return convertToResponse(auction);
    }

    /**
     * Convert Auction entity to AuctionResponse DTO
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
        response.setOwnerAddress(auction.getOwnerAddress());
        response.setContractAddress(auction.getContractAddress());
        response.setTransactionHash(auction.getTransactionHash());
        response.setBlockNumber(auction.getBlockNumber());
        return response;
    }

    /**
     * Update auction status
     */
    public Auction updateAuctionStatus(String auctionId, String newStatus) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
        
        auction.setStatus(newStatus);
        return auctionRepository.save(auction);
    }

    /**
     * Get auction entity by ID (returns Auction model, not DTO)
     */
    public Auction getAuctionByIdModel(String auctionId) {
        return auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found with ID: " + auctionId));
    }

    /**
     * Update auction directly (for ending auction with highest bidder transfer)
     */
    public Auction updateAuctionDirect(Auction auction) {
        return auctionRepository.save(auction);
    }
}
