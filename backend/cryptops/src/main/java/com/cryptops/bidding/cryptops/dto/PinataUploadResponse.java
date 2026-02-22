package com.cryptops.bidding.cryptops.dto;

public class PinataUploadResponse {

    private String cid; // Content ID from IPFS
    private String imageUrl; // Full Pinata gateway URL
    private boolean success;
    private String message;

    public PinataUploadResponse(String cid, String imageUrl, boolean success, String message) {
        this.cid = cid;
        this.imageUrl = imageUrl;
        this.success = success;
        this.message = message;
    }

    public PinataUploadResponse() {
    }

    // ================= GETTERS & SETTERS =================

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
