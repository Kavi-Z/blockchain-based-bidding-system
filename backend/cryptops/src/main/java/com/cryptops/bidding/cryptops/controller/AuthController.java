package com.cryptops.bidding.cryptops.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cryptops.bidding.cryptops.model.User;
import com.cryptops.bidding.cryptops.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AuthController {

    @Autowired
    private AuthService authService;

    // REGISTER
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        User savedUser = authService.register(user);

        Map<String, Object> response = new HashMap<>();
        response.put("id", savedUser.getId());
        response.put("email", savedUser.getEmail());
        response.put("role", savedUser.getRole());

        return response;
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        User loggedInUser = authService.login(user.getEmail(), user.getPassword());

        Map<String, Object> response = new HashMap<>();
        response.put("id", loggedInUser.getId());
        response.put("email", loggedInUser.getEmail());
        response.put("role", loggedInUser.getRole());

        return response;
    }

    // UPDATE EMAIL
    @PutMapping("/users/{id}/update-email")
    public Map<String, Object> updateEmail(@PathVariable String id, @RequestBody Map<String, String> request) {
        String newEmail = request.get("email");
        User updatedUser = authService.updateEmail(id, newEmail);

        Map<String, Object> response = new HashMap<>();
        response.put("id", updatedUser.getId());
        response.put("email", updatedUser.getEmail());
        response.put("role", updatedUser.getRole());

        return response;
    }

    // CHANGE PASSWORD
    @PutMapping("/users/{id}/change-password")
    public Map<String, String> changePassword(@PathVariable String id, @RequestBody Map<String, String> passwords) {
        String oldPassword = passwords.get("oldPassword");
        String newPassword = passwords.get("newPassword");

        boolean success = authService.changePassword(id, oldPassword, newPassword);

        Map<String, String> response = new HashMap<>();
        if(success) {
            response.put("message", "Password changed successfully");
        } else {
            response.put("message", "Old password is incorrect");
        }

        return response;
    }



    // --- WALLET VERIFICATION ---

    // 1️⃣ Generate nonce for wallet connection
    // @GetMapping("/nonce")
    // public Map<String, String> getNonce(@RequestParam String wallet) {
    //     String nonce = "Login-" + System.currentTimeMillis();
    //     walletNonces.put(wallet, nonce);

    //     Map<String, String> response = new HashMap<>();
    //     response.put("nonce", nonce);
    //     return response;
    // }

    // 2️⃣ Verify wallet signature using Web3j
    // @PostMapping("/verify-wallet")
    // public Map<String, Object> verifyWallet(@RequestBody Map<String, String> payload) {
    //     String wallet = payload.get("wallet");
    //     String signature = payload.get("signature");

    //     String nonce = walletNonces.get(wallet);
    //     if (nonce == null) {
    //         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nonce not found");
    //     }

    //     boolean isValid;
    //     try {
    //         byte[] msg = nonce.getBytes();
    //         byte[] sigBytes = Numeric.hexStringToByteArray(signature);

    //         byte v = sigBytes[64];
    //         byte[] r = Arrays.copyOfRange(sigBytes, 0, 32);
    //         byte[] s = Arrays.copyOfRange(sigBytes, 32, 64);

    //         Sign.SignatureData sigData = new Sign.SignatureData(v, r, s);
    //         String recovered = "0x" + Keys.getAddress(Sign.signedMessageToKey(msg, sigData));
    //         isValid = recovered.equalsIgnoreCase(wallet);
    //     } catch (Exception e) {
    //         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid signature");
    //     }

    //     if (!isValid) {
    //         throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid wallet signature");
    //     }

    //     walletNonces.remove(wallet);

    //     Map<String, Object> response = new HashMap<>();
    //     response.put("wallet", wallet);
    //     response.put("verified", true);

    //     return response;
    // }
}
