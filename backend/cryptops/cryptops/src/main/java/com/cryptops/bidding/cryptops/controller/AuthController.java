package com.cryptops.bidding.controller;

import com.cryptops.bidding.model.User;
import com.cryptops.bidding.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")

public class AuthController {
    @Autowired
    private AuthService authService;
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }
    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return authService.login(user.getEmail(), user.getPassword());
    }
    
}
