package com.cryptops.bidding.cryptops.controller;

import com.cryptops.bidding.cryptops.model.User;
import com.cryptops.bidding.cryptops.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private AuthService authService;

    // ==================== BIDDER REGISTRATION ====================
    @PostMapping("/register/bidder")
    public ResponseEntity<?> registerBidder(@RequestBody RegisterRequest request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null || request.getUsername() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            User user = new User();
            user.setEmail(request.getEmail());
            user.setUsername(request.getUsername());
            user.setPassword(request.getPassword()); // AuthService will hash
            user.setRole("BIDDER");

            User savedUser = authService.register(user);
            String token = authService.generateToken(savedUser);

            return ResponseEntity.ok(Map.of(
                    "id", savedUser.getId(),
                    "email", savedUser.getEmail(),
                    "username", savedUser.getUsername(),
                    "role", savedUser.getRole(),
                    "token", token,
                    "message", "Bidder registered successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== SELLER REGISTRATION ====================
    @PostMapping("/register/seller")
    public ResponseEntity<?> registerSeller(@RequestBody RegisterRequest request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null || request.getUsername() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            User user = new User();
            user.setEmail(request.getEmail());
            user.setUsername(request.getUsername());
            user.setPassword(request.getPassword()); // AuthService will hash
            user.setRole("SELLER");

            User savedUser = authService.register(user);
            String token = authService.generateToken(savedUser);

            return ResponseEntity.ok(Map.of(
                    "id", savedUser.getId(),
                    "email", savedUser.getEmail(),
                    "username", savedUser.getUsername(),
                    "role", savedUser.getRole(),
                    "token", token,
                    "message", "Seller registered successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== UNIFIED LOGIN (BIDDER & SELLER) ====================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password required"));
            }

            User loggedInUser = authService.login(request.getEmail(), request.getPassword());
            
            if (loggedInUser == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
            }

            String token = authService.generateToken(loggedInUser);

            return ResponseEntity.ok(Map.of(
                    "id", loggedInUser.getId(),
                    "email", loggedInUser.getEmail(),
                    "username", loggedInUser.getUsername() != null ? loggedInUser.getUsername() : "",
                    "role", loggedInUser.getRole(),
                    "walletAddress", loggedInUser.getWalletAddress() != null ? loggedInUser.getWalletAddress() : "",
                    "token", token,
                    "message", "Login successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    // ==================== SELLER-SPECIFIC LOGIN (OPTIONAL) ====================
    @PostMapping("/seller-login")
    public ResponseEntity<?> sellerLogin(@RequestBody LoginRequest request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password required"));
            }

            User loggedInUser = authService.login(request.getEmail(), request.getPassword());
            
            if (loggedInUser == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
            }

            // Verify user is a seller
            if (!"SELLER".equals(loggedInUser.getRole())) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. Sellers only."));
            }

            String token = authService.generateToken(loggedInUser);

            return ResponseEntity.ok(Map.of(
                    "id", loggedInUser.getId(),
                    "email", loggedInUser.getEmail(),
                    "username", loggedInUser.getUsername() != null ? loggedInUser.getUsername() : "",
                    "role", loggedInUser.getRole(),
                    "walletAddress", loggedInUser.getWalletAddress() != null ? loggedInUser.getWalletAddress() : "",
                    "token", token,
                    "message", "Seller login successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    // ==================== GET USER BY ID ====================
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            User user = authService.findById(id);
            
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "username", user.getUsername() != null ? user.getUsername() : "",
                    "role", user.getRole(),
                    "walletAddress", user.getWalletAddress() != null ? user.getWalletAddress() : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== UPDATE USER ====================
    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        try {
            User user = authService.updateUser(id, updatedUser);
            
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "username", user.getUsername() != null ? user.getUsername() : "",
                    "role", user.getRole(),
                    "message", "User updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== REQUEST DTOs ====================
    public static class RegisterRequest {
        private String email;
        private String password;
        private String username;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}