package com.cryptops.bidding.cryptops.repository;

import com.cryptops.bidding.cryptops.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    // Find user by email
    Optional<User> findByEmail(String email);
    
    // Find user by username
    Optional<User> findByUsername(String username);
    
    // Find user by wallet address
    Optional<User> findByWalletAddress(String walletAddress);
    
    // Check if email exists
    Boolean existsByEmail(String email);
    
    // Check if username exists
    Boolean existsByUsername(String username);
    
    // Check if wallet address exists
    Boolean existsByWalletAddress(String walletAddress);
}