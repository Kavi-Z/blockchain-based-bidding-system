package com.cryptops.bidding.cryptops.exception;

/**
 * Custom exception for validation failures
 */
public class ValidationException extends RuntimeException {

    private String errorCode;
    private String fieldName;

    public ValidationException(String message) {
        super(message);
        this.errorCode = "VALIDATION_ERROR";
    }

    public ValidationException(String message, String fieldName) {
        super(message);
        this.errorCode = "VALIDATION_ERROR";
        this.fieldName = fieldName;
    }

    public ValidationException(String message, String errorCode, String fieldName) {
        super(message);
        this.errorCode = errorCode;
        this.fieldName = fieldName;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getFieldName() {
        return fieldName;
    }
}
