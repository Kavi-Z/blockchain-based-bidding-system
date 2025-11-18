package com.cryptops.bidding.cryptops.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class MongoConnectionTest {
    private static final Logger log = LoggerFactory.getLogger(MongoConnectionTest.class);
    private final MongoTemplate mongoTemplate;

    public MongoConnectionTest(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void testMongoConnection() {
        try {
            String dbName = mongoTemplate.getDb().getName();
            log.info("✓ Successfully connected to MongoDB database: {}", dbName);
        } catch (Exception e) {
            log.error("✗ Failed to connect to MongoDB: {}", e.getMessage(), e);
        }
    }
}
