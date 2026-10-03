package com.cryptops.bidding.cryptops.service;

import com.cryptops.bidding.cryptops.dto.BondAuctionCreateRequest;
import com.cryptops.bidding.cryptops.dto.BondAuctionResponse;
import com.cryptops.bidding.cryptops.model.BondAuction;
import com.cryptops.bidding.cryptops.model.User;
import com.cryptops.bidding.cryptops.repository.BondAuctionRepository;
import com.cryptops.bidding.cryptops.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class BondAuctionService {

    private static final Logger logger = Logger.getLogger(BondAuctionService.class.getName());

    @Autowired
    private BondAuctionRepository bondAuctionRepository;

    @Autowired
    private UserRepository userRepository;

    public BondAuction createBondAuction(BondAuctionCreateRequest request) {
        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found with ID: " + request.getSellerId()));

        if (!"SELLER" .equalsIgnoreCase(seller.getRole())) {
            throw new RuntimeException("User is not authorized as a seller");
        }

        validateBondAuctionRequest(request);

        BondAuction auction = new BondAuction();
        auction.setItemName(request.getItemName());
        auction.setDescription(request.getDescription());
        auction.setImageUrl(request.getImageCID());
        auction.setSellerId(request.getSellerId());
        auction.setSellerUsername(seller.getUsername());
        auction.setOwnerAddress(request.getSellerWalletAddress());
        auction.setContractAddress(request.getContractAddress());
        auction.setTransactionHash(request.getTransactionHash());
        auction.setBlockNumber(request.getBlockNumber());
        auction.setBiddingTime(request.getBiddingTime());
        auction.setMinIncrement(request.getMinIncrement());
        auction.setExtensionTime(request.getExtensionTime());
        auction.setMaxBid(request.getMaxBid());
        auction.setStartingPrice(request.getStartingPrice());
        auction.setCurrentLowestBid(request.getStartingPrice());
        auction.setLowestBidderId(null);
        auction.setLowestBidderUsername(null);
        LocalDateTime now = LocalDateTime.now();
        auction.setStartTime(now);
        auction.setEndTime(now.plusMinutes(request.getBiddingTime()));
        auction.setStatus("ACTIVE");

        BondAuction savedAuction = bondAuctionRepository.save(auction);
        logger.info("Bond auction created successfully: " + savedAuction.getId());
        return savedAuction;
    }

    private void validateBondAuctionRequest(BondAuctionCreateRequest request) {
        if (request.getStartingPrice() == null || request.getStartingPrice() <= 0) {
            throw new RuntimeException("Starting price must be greater than 0");
        }
        if (request.getBiddingTime() == null || request.getBiddingTime() < 1 || request.getBiddingTime() > 10080) {
            throw new RuntimeException("Bidding time must be between 1 and 10080 minutes");
        }
        if (request.getMinIncrement() == null || request.getMinIncrement() <= 0) {
            throw new RuntimeException("Minimum decrement must be greater than 0");
        }
        if (request.getExtensionTime() == null || request.getExtensionTime() < 0 || request.getExtensionTime() > 120) {
            throw new RuntimeException("Extension time must be between 0 and 120 minutes");
        }
        if (request.getMaxBid() != null && request.getMaxBid() < request.getStartingPrice()) {
            throw new RuntimeException("Maximum bid cannot be less than starting price");
        }
        if (request.getItemName() == null || request.getItemName().trim().isEmpty()) {
            throw new RuntimeException("Item name is required");
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Description is required");
        }
    }

    public List<BondAuctionResponse> getSellerBondAuctions(String sellerId) {
        if (sellerId == null || sellerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Seller ID cannot be null or empty");
        }
        List<BondAuction> auctions = bondAuctionRepository.findBySellerIdOrderByStartTimeDesc(sellerId);
        return auctions.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<BondAuctionResponse> getAllBondAuctions() {
        List<BondAuction> auctions = bondAuctionRepository.findAll();
        return auctions.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<BondAuctionResponse> getAllActiveBondAuctions() {
        List<BondAuction> auctions = bondAuctionRepository.findByStatus("ACTIVE");
        return auctions.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public BondAuctionResponse getBondAuctionById(String auctionId) {
        BondAuction auction = bondAuctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Bond auction not found"));
        return convertToResponse(auction);
    }

    public BondAuction getBondAuctionByIdModel(String auctionId) {
        return bondAuctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Bond auction not found"));
    }

    public BondAuction updateBondAuctionDirect(BondAuction auction) {
        return bondAuctionRepository.save(auction);
    }

    private BondAuctionResponse convertToResponse(BondAuction auction) {
        BondAuctionResponse response = new BondAuctionResponse();
        response.setId(auction.getId());
        response.setItemName(auction.getItemName());
        response.setDescription(auction.getDescription());
        response.setImageUrl(auction.getImageUrl());
        response.setSellerId(auction.getSellerId());
        response.setSellerUsername(auction.getSellerUsername());
        response.setStartingPrice(auction.getStartingPrice());
        response.setCurrentLowestBid(auction.getCurrentLowestBid());
        response.setLowestBidderId(auction.getLowestBidderId());
        response.setLowestBidderUsername(auction.getLowestBidderUsername());
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
        response.setAuctionType("BOND");
        return response;
    }
}
