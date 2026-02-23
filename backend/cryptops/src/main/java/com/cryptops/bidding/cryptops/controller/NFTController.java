package com.cryptops.bidding.cryptops.controller;

import com.cryptops.bidding.cryptops.model.NFT;
import com.cryptops.bidding.cryptops.model.User;
import com.cryptops.bidding.cryptops.repository.NFTRepository;
import com.cryptops.bidding.cryptops.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/nft")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class NFTController {

    private static final Logger logger = Logger.getLogger(NFTController.class.getName());

    @Autowired
    private NFTRepository nftRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload")
    public Map<String, String> uploadNFT(
        @RequestParam("file") MultipartFile file,
        @RequestParam("walletAddress") String walletAddress
    ) {
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", "http://localhost:8080/images/" + file.getOriginalFilename());
        return response;
    }

    /**
     * Get all NFTs owned by a user
     * Includes items won from auctions
     */
    @GetMapping("/owned")
    public ResponseEntity<?> getUserOwnedNFTs(HttpServletRequest httpRequest) {
        try {
            String userId = (String) httpRequest.getAttribute("userId");
            
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "error", "Authentication required"
                ));
            }

            // Get user info
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get all NFTs owned by this user
            List<NFT> ownedNFTs = nftRepository.findByCurrentOwnerOrderByAcquiredAtDesc(userId);

            // Map to response with user details
            List<Map<String, Object>> nftList = new ArrayList<>();
            for (NFT nft : ownedNFTs) {
                nftList.add(Map.of(
                        "id", nft.getId(),
                        "name", nft.getName(),
                        "imageUrl", nft.getImageUrl(),
                        "description", nft.getDescription(),
                        "status", nft.getStatus().toString(),
                        "tokenId", nft.getTokenId() != null ? nft.getTokenId() : "",
                        "auctionId", nft.getAuctionId() != null ? nft.getAuctionId() : "",
                        "acquiredAt", nft.getAcquiredAt(),
                        "createdAt", nft.getCreatedAt()
                ));
            }

            logger.info("User " + user.getUsername() + " retrieved " + ownedNFTs.size() + " owned NFTs");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "userId", userId,
                    "username", user.getUsername(),
                    "totalOwned", ownedNFTs.size(),
                    "nfts", nftList
            ));

        } catch (RuntimeException e) {
            logger.warning("Error fetching user owned NFTs: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Get NFT by ID with full details
     */
    @GetMapping("/{nftId}")
    public ResponseEntity<?> getNFTById(@PathVariable String nftId) {
        try {
            NFT nft = nftRepository.findById(nftId)
                    .orElseThrow(() -> new RuntimeException("NFT not found"));

            Map<String, Object> nftDetails = new LinkedHashMap<>();
            nftDetails.put("id", nft.getId());
            nftDetails.put("name", nft.getName());
            nftDetails.put("imageUrl", nft.getImageUrl());
            nftDetails.put("description", nft.getDescription());
            nftDetails.put("currentOwner", nft.getCurrentOwner());
            nftDetails.put("previousOwner", nft.getPreviousOwner());
            nftDetails.put("auctionId", nft.getAuctionId());
            nftDetails.put("status", nft.getStatus().toString());
            nftDetails.put("tokenId", nft.getTokenId());
            nftDetails.put("acquiredAt", nft.getAcquiredAt());
            nftDetails.put("createdAt", nft.getCreatedAt());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "nft", nftDetails
            ));

        } catch (RuntimeException e) {
            logger.warning("NFT not found: " + nftId);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}
