package com.cryptops.bidding.cryptops.filter;

import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.logging.Logger;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
 
@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = Logger.getLogger(AuthTokenFilter.class.getName());

    @Override
    protected void doFilterInternal(@Nonnull HttpServletRequest request, @Nonnull HttpServletResponse response, 
                                   @Nonnull FilterChain filterChain) throws ServletException, IOException {
        try {
            String userId = extractUserIdFromToken(request);
            
            if (userId != null && !userId.isEmpty()) {
                request.setAttribute("userId", userId);
                request.setAttribute("authenticated", true);
                // Create a basic Authentication so Spring Security treats this request as authenticated
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
                logger.info("User authenticated via token: " + userId);
            } else {
                request.setAttribute("authenticated", false);
                SecurityContextHolder.clearContext();
            }

        } catch (Exception e) {
            logger.warning("Error extracting user from token: " + e.getMessage());
            request.setAttribute("authenticated", false);
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
 
    private String extractUserIdFromToken(HttpServletRequest request) {
  
        String userIdHeader = request.getHeader("X-User-ID");
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            logger.info("Using X-User-ID header: " + userIdHeader);
            return userIdHeader;
        }

       
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            logger.finest("Attempting to extract userId from Bearer token");
            return extractUserIdFromAuthToken(token);
        }

        return null;
    }
 
    private String extractUserIdFromAuthToken(String token) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(token);
            String decodedString = new String(decodedBytes);
            logger.finest("Decoded token: " + decodedString);
             
            String[] parts = decodedString.split(":");
            if (parts.length >= 1 && !parts[0].isEmpty()) {
                logger.info("Extracted userId from token: " + parts[0]);
                return parts[0];
            }
        } catch (IllegalArgumentException e) {
            logger.warning("Invalid token format: " + e.getMessage());
        } catch (Exception e) {
            logger.warning("Error parsing token: " + e.getMessage());
        }

        return null;
    }
}
