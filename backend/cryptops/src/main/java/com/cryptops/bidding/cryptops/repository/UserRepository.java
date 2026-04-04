package com.cryptops.bidding.cryptops.repository;

import com.cryptops.bidding.cryptops.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
     
    Optional<User> findByEmail(String email);
     
    Optional<User> findByUsername(String username);
     
    Optional<User> findByWalletAddress(String walletAddress);
     
    Boolean existsByEmail(String email);
     
    Boolean existsByUsername(String username);
     
    Boolean existsByWalletAddress(String walletAddress);
}