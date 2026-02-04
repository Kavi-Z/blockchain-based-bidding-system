package com.cryptops.bidding.cryptops.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/nft")
@CrossOrigin(origins = "http://localhost:5173")
public class NFTController {

    @PostMapping("/upload")
    public Map<String, String> uploadNFT(
        @RequestParam("file") MultipartFile file,
        @RequestParam("walletAddress") String walletAddress
    ) {
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", "http://localhost:8080/images/" + file.getOriginalFilename());
        return response;
    }
}
