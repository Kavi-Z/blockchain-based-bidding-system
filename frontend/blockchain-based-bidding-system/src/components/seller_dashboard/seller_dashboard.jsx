import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SecureAuction from "./SecureAuction.json";
import loginBg from "../../assets/login.png";
import "../items-upload/upload.css";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    itemName: "",
    biddingTime: "",
    minIncrement: "",
    extensionTime: "",
    maxBid: "",
  });

  const CONTRACT_ADDRESS = "0xc3662276B3594bD8d70778b093caC2F31E6D497E";

  useEffect(() => {
    const handleScroll = () => {};
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum && walletAddress) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const contractInstance = new web3Instance.eth.Contract(
          SecureAuction.abi,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
      }
    };

    initWeb3();
  }, [walletAddress]);

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.log("Wallet error:", error);
    }
  };

  // File Upload Handlers
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFileSelect({ target: { files: [file] } });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload NFT image to Spring Boot backend
  const uploadNFTImage = async () => {
    if (!selectedFile) return null;

    const formDataObj = new FormData();
    formDataObj.append('file', selectedFile);
    formDataObj.append('walletAddress', walletAddress);

    try {
      const response = await fetch('http://localhost:8080/api/nft/upload', {
        method: 'POST',
        body: formDataObj
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl; // Returns the URL where image is stored
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Create Auction (Blockchain + Backend)
  const handleCreateAuction = async (event) => {
    event.preventDefault();

    if (!walletAddress) {
      alert("Connect your wallet first");
      return;
    }

    if (
      !selectedFile ||
      !formData.itemName ||
      !formData.biddingTime ||
      !formData.minIncrement ||
      !formData.extensionTime
    ) {
      alert("Fill all required fields and select an NFT image!");
      return;
    }

    if (!web3 || !contract) {
      alert("Web3 not initialized!");
      return;
    }

    setUploading(true);

    try {
      // Step 1: Upload NFT image to backend
      console.log("Uploading NFT image...");
      const imageUrl = await uploadNFTImage();
      console.log("Image uploaded:", imageUrl);

      // Step 2: Start auction on blockchain
      console.log("Starting auction on blockchain...");
      
      const bidTime = formData.biddingTime.toString();
      const extension = formData.extensionTime.toString();
      const increment = web3.utils.toWei(formData.minIncrement.toString(), "ether");
      const max = formData.maxBid && parseFloat(formData.maxBid) > 0 
        ? web3.utils.toWei(formData.maxBid.toString(), "ether") 
        : "0";

      // Estimate gas first
      let gasEstimate;
      try {
        gasEstimate = await contract.methods
          .startAuction(bidTime, increment, extension, max)
          .estimateGas({ from: walletAddress });
      } catch (estimateError) {
        console.error("Gas estimation failed:", estimateError);
        alert("Transaction will fail. Check console for details.");
        setUploading(false);
        return;
      }

      const receipt = await contract.methods
        .startAuction(bidTime, increment, extension, max)
        .send({
          from: walletAddress,
          gas: Math.floor(Number(gasEstimate) * 1.2),
        });

      console.log("Blockchain transaction successful:", receipt);

      // Step 3: Save auction data to backend
      console.log("Saving auction to database...");
      const auctionData = {
        itemName: formData.itemName,
        imageUrl: imageUrl,
        ownerAddress: walletAddress,
        biddingTime: parseInt(formData.biddingTime),
        minIncrement: formData.minIncrement,
        extensionTime: parseInt(formData.extensionTime),
        maxBid: formData.maxBid || null,
        contractAddress: CONTRACT_ADDRESS,
        transactionHash: receipt.transactionHash,
        startTime: new Date().toISOString(),
        status: 'active'
      };

      const backendResponse = await fetch('http://localhost:8080/api/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auctionData)
      });

      if (!backendResponse.ok) {
        console.error("Failed to save auction to backend");
      }

      console.log("Auction created successfully!");
      alert("✅ Auction created successfully!");

      // Reset form
      setFormData({
        itemName: "",
        biddingTime: "",
        minIncrement: "",
        extensionTime: "",
        maxBid: "",
      });
      setSelectedFile(null);
      setImagePreview(null);

    } catch (error) {
      console.error("Error creating auction:", error);
      alert("❌ Failed to create auction: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="upload-container"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="upload-content">
        <div className="upload-box">
          <div className="upload-title">
            <span className="upload-main-text">Create NFT Auction</span>
          </div>

          <form className="upload-form" onSubmit={handleCreateAuction}>
            {/* NFT Image Upload */}
            <div className="form-group">
              <label className="form-label">NFT Image *</label>
              <div
                className={`upload-area ${
                  isDragging ? "dragging" : ""
                } ${selectedFile ? "has-file" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="file-selected">
                    {imagePreview && (
                      <div style={{
                        width: "100%",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        overflow: "hidden"
                      }}>
                        <img 
                          src={imagePreview} 
                          alt="NFT Preview" 
                          style={{
                            width: "100%",
                            maxHeight: "300px",
                            objectFit: "cover"
                          }}
                        />
                      </div>
                    )}
                    <div className="file-info">
                      <p className="file-name">{selectedFile.name}</p>
                      <p className="file-size">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-file"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview(null);
                      }}
                      style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">🖼️</div>
                    <p className="upload-text">Drag and Drop your NFT</p>
                    <p className="upload-subtext">or</p>
                    <label className="file-input-label">
                      Click to Upload
                      <input
                        type="file"
                        accept=".jpeg,.jpg,.png,.gif,.webp"
                        onChange={handleFileSelect}
                        className="file-input"
                      />
                    </label>
                    <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
                      Supported formats: JPEG, PNG, GIF, WEBP (Max 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Item Name */}
            <div className="form-group">
              <label className="form-label">NFT Name *</label>
              <input
                type="text"
                name="itemName"
                placeholder="Enter NFT name (e.g., CryptoPunk #1234)"
                className="form-input"
                value={formData.itemName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Bidding Time */}
            <div className="form-group">
              <label className="form-label">Bidding Time (seconds) *</label>
              <input
                type="number"
                name="biddingTime"
                placeholder="e.g., 300 (5 minutes)"
                className="form-input"
                value={formData.biddingTime}
                onChange={handleInputChange}
                min="60"
                required
              />
            </div>

            {/* Min Increment */}
            <div className="form-group">
              <label className="form-label">Minimum Bid Increment (ETH) *</label>
              <input
                type="number"
                name="minIncrement"
                placeholder="e.g., 0.001"
                className="form-input"
                value={formData.minIncrement}
                onChange={handleInputChange}
                min="0.001"
                step="0.001"
                required
              />
            </div>

            {/* Extension Time */}
            <div className="form-group">
              <label className="form-label">Extension Time (seconds) *</label>
              <input
                type="number"
                name="extensionTime"
                placeholder="e.g., 60"
                className="form-input"
                value={formData.extensionTime}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>

            {/* Max Bid (Optional) */}
            <div className="form-group">
              <label className="form-label">Maximum Bid (ETH) - Optional</label>
              <input
                type="number"
                name="maxBid"
                placeholder="e.g., 10 (leave empty for no limit)"
                className="form-input"
                value={formData.maxBid}
                onChange={handleInputChange}
                min="0"
                step="0.001"
              />
            </div>

            {/* Wallet Connection */}
            <div className="form-group">
              <label className="form-label">Wallet</label>
              <div className="wallet-address">
                {walletAddress ? (
                  <span className="wallet-text">
                    {walletAddress.substring(0, 10)}...
                    {walletAddress.substring(walletAddress.length - 8)}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-group">
              <button 
                type="submit" 
                className="create-auction-btn"
                disabled={uploading || !walletAddress}
                style={{
                  backgroundColor: (uploading || !walletAddress) ? "#ccc" : "#4CAF50",
                  cursor: (uploading || !walletAddress) ? "not-allowed" : "pointer"
                }}
              >
                {uploading ? "Creating Auction... ⏳" : "Create NFT Auction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;