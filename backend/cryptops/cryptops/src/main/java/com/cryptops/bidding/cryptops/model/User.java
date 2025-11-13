package com.cryptops.bidding.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@data
@Atno@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")

public class User {
    @Id
    private String Id;
    private String email;
    private String password;
    private String role;
    

}