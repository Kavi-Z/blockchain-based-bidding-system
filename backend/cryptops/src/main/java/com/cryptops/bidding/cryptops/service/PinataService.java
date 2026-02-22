package com.cryptops.bidding.cryptops.service;

import com.cryptops.bidding.cryptops.dto.PinataUploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class PinataService {

    private static final Logger logger = Logger.getLogger(PinataService.class.getName());

    @Value("${pinata.api.key}")
    private String apiKey;

    @Value("${pinata.secret.key}")
    private String secretKey;

    private static final String PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    private static final String PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

    /**
     * Upload file to Pinata IPFS
     */
    public PinataUploadResponse uploadToPinata(MultipartFile file) {
        try {
            // Validate file
            if (file == null || file.isEmpty()) {
                return new PinataUploadResponse(null, null, false, "File is empty");
            }

            if (file.getSize() > 10 * 1024 * 1024) { // 10MB limit
                return new PinataUploadResponse(null, null, false, "File size exceeds 10MB limit");
            }

            // Create request headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("pinata_api_key", apiKey);
            headers.set("pinata_secret_api_key", secretKey);
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Create form data with file
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> request =
                    new HttpEntity<>(body, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(PINATA_URL, request, Map.class);

            if (response.getBody() != null) {
                String cid = (String) response.getBody().get("IpfsHash");
                String imageUrl = PINATA_GATEWAY + cid;
                
                logger.info("File uploaded to Pinata successfully. CID: " + cid);
                
                return new PinataUploadResponse(cid, imageUrl, true, "Upload successful");
            } else {
                return new PinataUploadResponse(null, null, false, "No response from Pinata");
            }

        } catch (IOException e) {
            logger.severe("IO Error during Pinata upload: " + e.getMessage());
            return new PinataUploadResponse(null, null, false, "IO Error: " + e.getMessage());
        } catch (Exception e) {
            logger.severe("Error uploading to Pinata: " + e.getMessage());
            return new PinataUploadResponse(null, null, false, "Upload failed: " + e.getMessage());
        }
    }

    /**
     * Upload image file to Pinata
     */
    public String uploadImageToPinata(MultipartFile imageFile) throws IOException {
        String originalFilename = imageFile.getOriginalFilename();
        
        // Validate image type
        if (originalFilename != null) {
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
            if (!isValidImageExtension(extension)) {
                throw new IOException("Invalid image format. Allowed: jpg, jpeg, png, gif, webp");
            }
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("pinata_api_key", apiKey);
        headers.set("pinata_secret_api_key", secretKey);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(imageFile.getBytes()) {
            @Override
            public String getFilename() {
                return imageFile.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response =
                restTemplate.postForEntity(PINATA_URL, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            String cid = (String) response.getBody().get("IpfsHash");
            logger.info("Image uploaded successfully. CID: " + cid);
            return PINATA_GATEWAY + cid;
        } else {
            throw new IOException("Failed to upload image to Pinata");
        }
    }

    /**
     * Validate image file extension
     */
    private boolean isValidImageExtension(String extension) {
        return extension.matches("^(jpg|jpeg|png|gif|webp)$");
    }
}
