import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import SecureAuction from "./SecureAuction.json";
import imagenew from "../../assets/imagenew.jpg";
import "./auction_create.css";

const AuctionCreate = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    biddingTime: 60,
    minIncrement: 0.1,
    extensionTime: 15,
    maxBid: "",
    startingPrice: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImageCID, setUploadedImageCID] = useState("");

  // Blockchain state
  const [walletAddress, setWalletAddress] = useState("");
  const [contractAddress] = useState("0x55286Ac3A309c90918CDa8B0093ED5ECb5aF07fD");

  // Check if user is logged in
  useEffect(() => {
    if (!user || user.role !== "SELLER") {
      alert("You must be logged in as a seller to create an auction");
      navigate("/seller-login");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : isNaN(value) ? value : Number(value),
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid image format. Please upload JPEG, PNG, GIF, or WebP");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setSelectedImage(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToPinata = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setImageUploading(true);
    setError("");

    try {
      const formDataObj = new FormData();
      formDataObj.append("image", selectedImage);
      formDataObj.append("sellerId", user.id);

      const response = await fetch("http://localhost:8080/api/auction/upload/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token || ""}`,
          "X-User-ID": user?.id || "",
        },
        body: formDataObj,
      });

      console.log("uploadImageToPinata -> status", response.status);
      console.log("uploadImageToPinata -> headers", Object.fromEntries(response.headers.entries()));

      const contentType = response.headers.get("content-type") || "";
      let data = null;

      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (err) {
          const txt = await response.text().catch(() => "");
          console.error("Failed to parse JSON response:", err, "raw:", txt);
          throw new Error(`Invalid JSON from server: ${txt || err.message}`);
        }
      } else {
        const txt = await response.text().catch(() => "");
        console.warn("Non-JSON response from upload endpoint:", txt);
        // If not OK, throw with raw text; otherwise try to proceed
        if (!response.ok) {
          throw new Error(txt || `Upload failed with status ${response.status}`);
        }
      }

      if (!response.ok) {
        const errMsg = (data && (data.error || data.message)) || `Upload failed with status ${response.status}`;
        throw new Error(errMsg);
      }

      if (data && data.success) {
        setUploadedImageCID(data.imageUrl);
        setSuccess("Image uploaded successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error((data && (data.error || data.message)) || "Upload failed");
      }
    } catch (error) {
      setError(error.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = () => {
    if (!formData.itemName.trim()) {
      setError("Item name is required");
      return false;
    }
    if (formData.itemName.length < 3 || formData.itemName.length > 100) {
      setError("Item name must be between 3 and 100 characters");
      return false;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (formData.description.length < 10 || formData.description.length > 1000) {
      setError("Description must be between 10 and 1000 characters");
      return false;
    }

    if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
      setError("Starting price must be greater than 0");
      return false;
    }

    if (formData.biddingTime < 1 || formData.biddingTime > 10080) {
      setError("Bidding time must be between 1 and 10080 minutes");
      return false;
    }

    if (formData.minIncrement <= 0) {
      setError("Minimum increment must be greater than 0");
      return false;
    }

    if (formData.extensionTime < 0 || formData.extensionTime > 120) {
      setError("Extension time must be between 0 and 120 minutes");
      return false;
    }

    if (
      formData.maxBid &&
      parseFloat(formData.maxBid) < parseFloat(formData.startingPrice)
    ) {
      setError("Maximum bid cannot be less than starting price");
      return false;
    }

    if (!uploadedImageCID) {
      setError("Please upload an image");
      return false;
    }

    return true;
  };

  /**
   * Connect to user's wallet (MetaMask)
   */
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install MetaMask to create auctions.");
        return false;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWalletAddress(accounts[0]);
      setSuccess(`Wallet connected: ${accounts[0].substring(0, 10)}...`);
      setTimeout(() => setSuccess(""), 3000);
      return true;
    } catch (error) {
      setError(`Wallet connection failed: ${error.message}`);
      return false;
    }
  };

  /**
   * Create auction on blockchain via smart contract
   */
  const createBlockchainAuction = async () => {
    if (!walletAddress) {
      throw new Error("Wallet not connected. Please connect MetaMask first.");
    }

    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, SecureAuction.abi, signer);

      // Convert bidding time and extension time from minutes to seconds
      const biddingTimeSeconds = BigInt(parseInt(formData.biddingTime) * 60);
      const extensionTimeSeconds = BigInt(parseInt(formData.extensionTime) * 60);

      // Prepare params (ensure numeric/BigInt types where appropriate)
      const minIncrementWei = (() => {
        try {
          return ethers.parseEther(formData.minIncrement.toString());
        } catch (e) {
          // Fallback: if parseEther fails, try converting to integer wei-like BigInt
          return BigInt(Math.floor(parseFloat(formData.minIncrement) * 1e18));
        }
      })();

      const maxBidWei = formData.maxBid ? (() => {
        try {
          return ethers.parseEther(formData.maxBid.toString());
        } catch (e) {
          return BigInt(Math.floor(parseFloat(formData.maxBid) * 1e18));
        }
      })() : BigInt(0);
 
      const ifaceFns = contract.interface.fragments || [];
      console.log("Contract ABI functions:", ifaceFns.map(f => f.name).filter(n => n));
      
      const hasStart = ifaceFns.some((f) => f.type === "function" && f.name === "startAuction");
      const hasCreate = ifaceFns.some((f) => f.type === "function" && f.name === "createAuction");
      let functionName = null;
      if (hasStart) functionName = "startAuction";
      else if (hasCreate) functionName = "createAuction";
      else {
        console.error("Available functions in contract:", ifaceFns.filter(f => f.type === "function").map(f => f.name));
        throw new Error("ABI does not contain startAuction or createAuction function. Available functions: " + 
          ifaceFns.filter(f => f.type === "function").map(f => f.name).join(", "));
      }

      console.log("Using contract function:", functionName);
      const data = contract.interface.encodeFunctionData(functionName, [
        biddingTimeSeconds,
        minIncrementWei,
        extensionTimeSeconds,
        maxBidWei,
      ]);

      const signerAddress = await signer.getAddress();
      const populated = {
        to: contractAddress,
        data,
        from: signerAddress,
      };
 
      try {
        await provider.estimateGas(populated);
      } catch (estErr) {
         
        try {
          const callResult = await provider.call(populated).catch(() => null);
          if (callResult && callResult !== "0x") {
            if (callResult.startsWith("0x08c379a0")) {
              const utf8Hex = "0x" + callResult.slice(138);
              let reason = "";
              try {
                reason = ethers.toUtf8String(utf8Hex);
              } catch (dErr) {
                reason = `Failed to decode revert data: ${dErr.message}`;
              }
              throw new Error(`Contract reverted: ${reason}`);
            }
            throw new Error(`Call reverted with data: ${callResult}`);
          }

          throw new Error(`Gas estimation failed (call reverted without revert data). ${estErr.message}`);
        } catch (decodeErr) {
          throw decodeErr;
        }
      } 
      let tx;
      try {
        if (functionName === "startAuction") {
          console.log("Calling startAuction with params:", {
            biddingTimeSeconds: biddingTimeSeconds.toString(),
            minIncrementWei: minIncrementWei.toString(),
            extensionTimeSeconds: extensionTimeSeconds.toString(),
            maxBidWei: maxBidWei.toString(),
          });
          tx = await contract.startAuction(
            biddingTimeSeconds,
            minIncrementWei,
            extensionTimeSeconds,
            maxBidWei
          );
        } else {
          console.log("Calling createAuction with params:", {
            biddingTimeSeconds: biddingTimeSeconds.toString(),
            minIncrementWei: minIncrementWei.toString(),
            extensionTimeSeconds: extensionTimeSeconds.toString(),
            maxBidWei: maxBidWei.toString(),
          });
          tx = await contract.createAuction(
            biddingTimeSeconds,
            minIncrementWei,
            extensionTimeSeconds,
            maxBidWei
          );
        }
        console.log("✅ Transaction sent successfully, hash:", tx.hash);
      } catch (methodErr) {
        console.error("Error calling contract method:", methodErr);
        throw new Error(`Failed to call ${functionName}: ${methodErr.message}`);
      }
 
      console.log("⏳ Waiting for transaction to be mined...");
      let receipt;
      try {
        receipt = await tx.wait();
      } catch (waitErr) {
        console.error("Error waiting for transaction:", waitErr);
        throw new Error(`Transaction confirmation failed: ${waitErr.message}`);
      }
       
      if (!receipt) {
        throw new Error("Transaction was not confirmed (receipt is null). The transaction may have failed or was rejected.");
      }
      
      console.log("📋 Full receipt object:", receipt);
      console.log("Receipt properties:", {
        transactionHash: receipt.transactionHash || receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status,
        from: receipt.from,
        to: receipt.to,
      });
      
      if (receipt.status === 0 || receipt.status === false) {
        throw new Error("Transaction failed on-chain (status = 0). Check contract revert reason in console logs.");
      }
       
      const finalTxHash = receipt.transactionHash || receipt.hash || tx.hash;
      const finalBlockNumber = receipt.blockNumber;
      
      if (!finalTxHash || finalBlockNumber === null || finalBlockNumber === undefined) {
        console.error("Missing critical receipt data:", { finalTxHash, finalBlockNumber, receipt });
        throw new Error(`Receipt data incomplete: txHash=${finalTxHash}, blockNumber=${finalBlockNumber}`);
      }
      
      console.log("✅ Blockchain auction created and CONFIRMED in block:", finalBlockNumber);
      console.log("Transaction hash:", finalTxHash);

      return {
        transactionHash: finalTxHash,
        blockNumber: finalBlockNumber,
        contractAddress: contractAddress,
      };
    } catch (error) {
     
      const msg = (error && error.message) ? error.message : String(error);
      if (msg.includes("Internal JSON-RPC error") || msg.includes("missing revert data") || msg.includes("CALL_EXCEPTION")) {
        throw new Error(
          `Blockchain auction creation failed: ${msg}.\nCheck your MetaMask network, contract address/ABI, and RPC node. Try switching to a different RPC (Infura/Alchemy/local node) for better revert messages.`
        );
      }
      throw new Error(`Blockchain auction creation failed: ${msg}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Step 1: Connect wallet if not already connected
      if (!walletAddress) {
        setSuccess("Please connect your MetaMask wallet...");
        const connected = await connectWallet();
        if (!connected) {
          setLoading(false);
          return;
        }
      }

      // Step 2: Create auction on blockchain
      setSuccess("Creating auction on blockchain... Please confirm in MetaMask.");
      let blockchainData;
      try {
        blockchainData = await createBlockchainAuction();
      } catch (blockchainErr) {
        console.error("Blockchain creation error:", blockchainErr);
        throw blockchainErr;
      }
      
      // Verify we have all blockchain data before proceeding to backend
      if (!blockchainData) {
        throw new Error("Blockchain auction creation returned null.");
      }
      
      console.log("Blockchain data returned:", blockchainData);
      
      if (!blockchainData.transactionHash) {
        throw new Error(`Blockchain transaction hash is missing. Data: ${JSON.stringify(blockchainData)}`);
      }
      
      if (blockchainData.blockNumber === null || blockchainData.blockNumber === undefined) {
        throw new Error(`Blockchain block number is missing. Data: ${JSON.stringify(blockchainData)}`);
      }

      console.log("✅ Auction successfully created on blockchain:", blockchainData);

      // Step 3: Save auction to database (now with blockchain details)
      setSuccess("Auction confirmed on blockchain! Saving to database...");
      const auctionData = {
        itemName: formData.itemName,
        description: formData.description,
        startingPrice: parseFloat(formData.startingPrice),
        biddingTime: parseInt(formData.biddingTime), // Backend expects minutes
        minIncrement: parseFloat(formData.minIncrement),
        extensionTime: parseInt(formData.extensionTime), // Backend expects minutes
        maxBid: formData.maxBid ? parseFloat(formData.maxBid) : null,
        sellerId: user.id,
        imageCID: uploadedImageCID,
        sellerWalletAddress: walletAddress,
        contractAddress: blockchainData.contractAddress,
        transactionHash: blockchainData.transactionHash,
        blockNumber: blockchainData.blockNumber,
      };

      const response = await fetch("http://localhost:8080/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
          "X-User-ID": user.id,
        },
        body: JSON.stringify(auctionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save auction to database");
      }

      if (data.success) {
        setSuccess("✅ Auction created successfully on blockchain and saved!");
        setTimeout(() => {
          navigate("/seller-dashboard");
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.message || String(error);
      console.error("=== FULL HANDLESUBMIT ERROR ===");
      console.error("Error message:", errorMsg);
      console.error("Error object:", error);
      console.error("Error stack:", error.stack);
      console.error("================================");
      
      setError(errorMsg);
      console.error("handleSubmit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auction-create-container">
      <div className="auction-create-wrapper">
        <div className="auction-create-content">
          <h1>Create New Auction</h1>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="auction-form">
 
            <div className="form-group">
              <label htmlFor="itemName">Item Name *</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                placeholder="Enter item name (3-100 characters)"
                maxLength={100}
                required
              />
              <small>
                {formData.itemName.length}/100
              </small>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed description (10-1000 characters)"
                maxLength={1000}
                rows="5"
                required
              ></textarea>
              <small>
                {formData.description.length}/1000
              </small>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label>Auction Item Image *</label>
              <div className="image-upload-section">
                <div className="image-input-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    id="imageInput"
                    className="image-input"
                  />
                  <label htmlFor="imageInput" className="image-input-label">
                    Click to select image
                  </label>
                </div>

                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}

                {selectedImage && !uploadedImageCID && (
                  <button
                    type="button"
                    onClick={uploadImageToPinata}
                    disabled={imageUploading}
                    className="btn-upload-image"
                  >
                    {imageUploading ? "Uploading..." : "Upload to IPFS"}
                  </button>
                )}

                {uploadedImageCID && (
                  <div className="upload-success">
                    ✓ Image uploaded to IPFS successfully
                  </div>
                )}
              </div>
            </div>

            {/* Starting Price */}
            <div className="form-group">
              <label htmlFor="startingPrice">Starting Price ($) *</label>
              <input
                type="number"
                id="startingPrice"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>

            {/* Bidding Time */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="biddingTime">Bidding Duration (minutes) *</label>
                <input
                  type="number"
                  id="biddingTime"
                  name="biddingTime"
                  value={formData.biddingTime}
                  onChange={handleInputChange}
                  min="1"
                  max="10080"
                  required
                />
                <small>1 min to 7 days (10080 min)</small>
              </div>
 
              <div className="form-group">
                <label htmlFor="minIncrement">Min Bid Increment ($) *</label>
                <input
                  type="number"
                  id="minIncrement"
                  name="minIncrement"
                  value={formData.minIncrement}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
            </div>

            {/* Extension Time */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="extensionTime">Extension Time (minutes) *</label>
                <input
                  type="number"
                  id="extensionTime"
                  name="extensionTime"
                  value={formData.extensionTime}
                  onChange={handleInputChange}
                  min="0"
                  max="120"
                  required
                />
                <small>0-120 minutes (auto-extends if bidded in last minutes)</small>
              </div>

              {/* Max Bid (Optional) */}
              <div className="form-group">
                <label htmlFor="maxBid">Maximum Bid ($) (Optional)</label>
                <input
                  type="number"
                  id="maxBid"
                  name="maxBid"
                  value={formData.maxBid}
                  onChange={handleInputChange}
                  placeholder="Leave empty for no limit"
                  step="0.01"
                  min={parseFloat(formData.startingPrice) || 0}
                />
                <small>Set a reserve price if desired</small>
              </div>
            </div>

            {/* Wallet Status */}
            <div className="form-group">
              <label>Wallet Connection Status</label>
              {walletAddress ? (
                <div className="wallet-connected">
                  ✓ Connected: {walletAddress.substring(0, 10)}...{walletAddress.substring(35)}
                </div>
              ) : (
                <div className="wallet-disconnected">
                  ✗ Wallet not connected. Click "Connect Wallet" to proceed.
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/seller-dashboard")}
                className="btn-cancel"
              >
                Cancel
              </button>
              {!walletAddress ? (
                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={loading}
                  className="btn-submit"
                >
                  {loading ? "Connecting..." : "Connect Wallet"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !uploadedImageCID}
                  className="btn-submit"
                >
                  {loading ? "Creating Auction..." : "Create Auction"}
                </button>
              )}
            </div>
          </form>
        </div>

        <div
          className="auction-create-image"
          style={{ backgroundImage: `url(${imagenew})` }}
        ></div>
      </div>
    </div>
  );
};

export default AuctionCreate;
