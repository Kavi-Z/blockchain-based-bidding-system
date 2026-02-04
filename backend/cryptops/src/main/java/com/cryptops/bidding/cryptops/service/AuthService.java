package com.cryptops.bidding.cryptops.service;

import com.cryptops.bidding.cryptops.model.User;
import com.cryptops.bidding.cryptops.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Register a new user
     */
    public User register(User user) {
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Check if username already exists
        if (user.getUsername() != null && userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set timestamps
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setIsActive(true);

        // Save user
        return userRepository.save(user);
    }

    /**
     * Login user
     */
    public User login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return null; // User not found
        }

        User user = userOpt.get();

        // Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null; // Invalid password
        }

        return user;
    }

    /**
     * Generate a simple token (for demonstration)
     * In production, use JWT
     */
    public String generateToken(User user) {
        String tokenData = user.getId() + ":" + user.getEmail() + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(tokenData.getBytes());
    }

    /**
     * Find user by ID
     */
    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Find user by email
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    /**
     * Update user
     */
    public User updateUser(String id, User updatedUser) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();

        // Update fields
        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getUsername() != null) {
            user.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getWalletAddress() != null) {
            user.setWalletAddress(updatedUser.getWalletAddress());
        }
        if (updatedUser.getProfileImage() != null) {
            user.setProfileImage(updatedUser.getProfileImage());
        }

        // Update password if provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }
}