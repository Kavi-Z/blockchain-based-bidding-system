package com.cryptops.bidding.cryptops.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * Local image storage service
 * Stores images on the file system and serves them via HTTP
 * Used as fallback when Pinata API fails or is unavailable
 */
@Service
public class LocalImageService {

    private static final Logger logger = Logger.getLogger(LocalImageService.class.getName());

    @Value("${app.upload.dir:uploads/images}")
    private String uploadDir;

    @Value("${app.upload.url:http://localhost:8080/uploads/images}")
    private String uploadBaseUrl;

    /**
     * Save image file locally
     * @return URL to access the image
     */
    public String saveImageLocally(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !isValidImageType(contentType)) {
            throw new IOException("Invalid image format. Allowed: JPEG, PNG, GIF, WebP");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? 
            originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String uniqueFilename = UUID.randomUUID() + extension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.write(filePath, file.getBytes());

        logger.info("Image saved locally: " + filePath);

        // Return URL to access the image
        return uploadBaseUrl + "/" + uniqueFilename;
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
