package com.cryptops.bidding.cryptops.config;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class MongoIndexRepair {
    private static final Logger log = LoggerFactory.getLogger(MongoIndexRepair.class);
    private final MongoTemplate mongoTemplate;

    public MongoIndexRepair(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void repairWalletAddressIndex() {
        MongoCollection<Document> users = mongoTemplate.getCollection("users");

        for (Document index : users.listIndexes()) {
            String name = index.getString("name");
            if (name != null && name.toLowerCase().contains("wallet_address")) {
                log.warn("Dropping incompatible users index: {}", name);
                users.dropIndex(name);
            }
        }

        users.createIndex(
            Indexes.ascending("wallet_address"),
            new IndexOptions().unique(true).sparse(true).name("wallet_address_sparse_unique")
        );
        log.info("Ensured sparse unique index on users.wallet_address");
    }
}
