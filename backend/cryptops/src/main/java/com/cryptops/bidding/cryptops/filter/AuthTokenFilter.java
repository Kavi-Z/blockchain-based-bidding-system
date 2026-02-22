package com.cryptops.bidding.cryptops.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;
import java.util.logging.Logger;
 
@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = Logger.getLogger(AuthTokenFilter.class.getName());

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        try {
            String userId = extractUserIdFromToken(request);
            
            if (userId != null) {
               
                request.setAttribute("userId", userId);
                logger.info("User authenticated via token: " + userId);
            }

        } catch (Exception e) {
            logger.warning("Error extracting user from token: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
 
    private String extractUserIdFromToken(HttpServletRequest request) {
  
        String userIdHeader = request.getHeader("X-User-ID");
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            return userIdHeader;
        }

       
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return extractUserIdFromAuthToken(token);
        }

        return null;
    }
 
    private String extractUserIdFromAuthToken(String token) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(token);
            String decodedString = new String(decodedBytes);
             
            String[] parts = decodedString.split(":");
            if (parts.length >= 1) {
                return parts[0];  
            }
        } catch (IllegalArgumentException e) {
            logger.warning("Invalid token format: " + e.getMessage());
        }

        return null;
    }
}
