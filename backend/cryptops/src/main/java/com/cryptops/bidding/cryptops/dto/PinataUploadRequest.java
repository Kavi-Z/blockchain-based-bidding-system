package com.cryptops.bidding.cryptops.dto;

import jakarta.validation.constraints.NotBlank;

public class PinataUploadRequest {

    @NotBlank(message = "File content is required")
    private String fileContent;  

    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "Seller ID is required")
    private String sellerId;
 
    public String getFileContent() {
        return fileContent;
    }

    public void setFileContent(String fileContent) {
        this.fileContent = fileContent;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }
}
