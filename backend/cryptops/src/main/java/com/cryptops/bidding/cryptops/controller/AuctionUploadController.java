package com.cryptops.bidding.cryptops.controller;

import com.cryptops.bidding.cryptops.dto.PinataUploadResponse;
import com.cryptops.bidding.cryptops.exception.UnauthorizedException;
import com.cryptops.bidding.cryptops.service.PinataService;
import com.cryptops.bidding.cryptops.service.LocalImageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/auction/upload")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuctionUploadController {

    private static final Logger logger = Logger.getLogger(AuctionUploadController.class.getName());

    @Autowired
    private PinataService pinataService;

    @Autowired
    private LocalImageService localImageService;

    /**
     * Upload auction item image to Pinata IPFS
     * Optional authentication (can upload without token but with sellerId verification)
     */
    @PostMapping("/image")
    public ResponseEntity<?> uploadAuctionImage(@RequestParam("image") MultipartFile image,
                                                 @RequestParam(value = "sellerId", required = false) String sellerId,
                                                 HttpServletRequest httpRequest) {
        try {
            // Extract user ID from token via filter (optional)
            String userId = (String) httpRequest.getAttribute("userId");
            
            // Verify image file
            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Image file is required"
                ));
            }

            // Validate file size (max 10MB)
            if (image.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Image size exceeds 10MB limit"
                ));
            }

            // Validate file type
            String contentType = image.getContentType();
            if (contentType == null || !isValidImageType(contentType)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Invalid image format. Allowed: JPEG, PNG, GIF, WebP"
                ));
            }

            // If sellerId is provided, verify ownership (optional check)
            if (sellerId != null && !sellerId.isEmpty() && userId != null) {
                if (!userId.equals(sellerId)) {
                    logger.warning("User " + userId + " tried to upload image for seller " + sellerId);
                    return ResponseEntity.status(403).body(Map.of(
                            "success", false,
                            "error", "You can only upload images for your own seller account"
                    ));
                }
            } else if (userId == null) {
                logger.warning("Unauthenticated image upload attempt. userId is null");
                // Allow unauthenticated uploads but log it
            }

            logger.info("Uploading image. User: " + (userId != null ? userId : "anonymous"));

            String imageUrl = null;
            String uploadMethod = "unknown";

            // Try Pinata first
            try {
                PinataUploadResponse uploadResponse = pinataService.uploadToPinata(image);
                if (uploadResponse.isSuccess()) {
                    imageUrl = uploadResponse.getImageUrl();
                    uploadMethod = "Pinata IPFS";
                    logger.info("Image uploaded to Pinata successfully. URL: " + imageUrl);
                } else {
                    logger.warning("Pinata upload failed, trying local storage fallback: " + uploadResponse.getMessage());
                }
            } catch (Exception e) {
                logger.warning("Pinata upload error, falling back to local storage: " + e.getMessage());
            }

            // Fallback to local storage if Pinata failed
            if (imageUrl == null) {
                try {
                    imageUrl = localImageService.saveImageLocally(image);
                    uploadMethod = "Local Storage";
                    logger.info("Image saved to local storage. URL: " + imageUrl);
                } catch (Exception e) {
                    logger.severe("Local image storage failed: " + e.getMessage());
                    return ResponseEntity.status(500).body(Map.of(
                            "success", false,
                            "error", "Failed to upload image (both Pinata and local storage failed): " + e.getMessage()
                    ));
                }
            }

            logger.info("Image uploaded successfully via " + uploadMethod);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Image uploaded successfully via " + uploadMethod,
                    "imageUrl", imageUrl,
                    "uploadMethod", uploadMethod
            ));

        } catch (UnauthorizedException e) {
            logger.warning("Unauthorized upload: " + e.getMessage());
            return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            logger.severe("Error uploading image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Upload failed: " + e.getMessage()
            ));
        }
    }

    /**
     * Validate image MIME type
     */
    private boolean isValidImageType(String contentType) {
        return contentType.equals("image/jpeg") ||
               contentType.equals("image/jpg") ||
               contentType.equals("image/png") ||
               contentType.equals("image/gif") ||
               contentType.equals("image/webp");
    }
}
