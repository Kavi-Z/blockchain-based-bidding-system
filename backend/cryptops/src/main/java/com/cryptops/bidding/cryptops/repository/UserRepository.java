package com.cryptops.bidding.cryptops.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.cryptops.bidding.cryptops.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}