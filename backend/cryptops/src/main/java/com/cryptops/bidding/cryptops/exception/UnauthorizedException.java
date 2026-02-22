package com.cryptops.bidding.cryptops.exception;

/**
 * Custom exception for unauthorized access
 */
public class UnauthorizedException extends RuntimeException {

    private String errorCode;

    public UnauthorizedException(String message) {
        super(message);
        this.errorCode = "UNAUTHORIZED";
    }

    public UnauthorizedException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
