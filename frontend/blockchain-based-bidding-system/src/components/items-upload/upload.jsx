import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import loginBg from "../../assets/login.png";
import "./upload.css";



const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [formData, setFormData] = useState({
    itemName: "",
    startingBid: "",
    bidIncrement: "",
    startTime: "",
    endTime: "",
  });

  // Detect scroll for UI animation
  useEffect(() => {
    const handleScroll = () => {};
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // -----------------------------
  // WALLET CONNECTION
  // -----------------------------
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

  // -----------------------------
  // FILE UPLOAD HANDLERS
  // -----------------------------
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a JPEG or PNG file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    setSelectedFile(file);
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

  // -----------------------------
  // CREATE AUCTION (SMART CONTRACT)
  // -----------------------------
  const handleCreateAuction = async (event) => {
    event.preventDefault();

    if (!walletAddress) {
      alert("Connect your wallet first");
      return;
    }

    if (
      !selectedFile ||
      !formData.itemName ||
      !formData.startingBid ||
      !formData.bidIncrement ||
      !formData.startTime ||
      !formData.endTime
    ) {
      alert("Fill all fields and select an image!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const start = Math.floor(new Date(formData.startTime).getTime() / 1000);
      const end = Math.floor(new Date(formData.endTime).getTime() / 1000);

      const tx = await contract.createAuction(
        formData.itemName,
        ethers.parseEther(formData.startingBid.toString()),
        ethers.parseEther(formData.bidIncrement.toString()),
        start,
        end
      );

      await tx.wait();
      alert("Auction created successfully!");

      // reset
      setFormData({
        itemName: "",
        startingBid: "",
        bidIncrement: "",
        startTime: "",
        endTime: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      alert("Failed to create auction!");
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
            <span className="upload-main-text">Create Auction</span>
          </div>

          <form className="upload-form" onSubmit={handleCreateAuction}>
            {/* File Upload */}
            <div className="form-group">
              <label className="form-label">Item Image</label>
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
                    <div className="file-icon">📄</div>
                    <div className="file-info">
                      <p className="file-name">{selectedFile.name}</p>
                      <p className="file-size">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-file"
                      onClick={() => setSelectedFile(null)}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">📁</div>
                    <p className="upload-text">Drag and Drop the item</p>
                    <p className="upload-subtext">or</p>
                    <label className="file-input-label">
                      Click Add Item
                      <input
                        type="file"
                        accept=".jpeg,.jpg,.png"
                        onChange={handleFileSelect}
                        className="file-input"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Item Name */}
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                name="itemName"
                placeholder="Enter item name"
                className="form-input"
                value={formData.itemName}
                onChange={handleInputChange}
              />
            </div>

            {/* Starting Bid */}
            <div className="form-group">
              <label className="form-label">Starting Bid (ETH)</label>
              <input
                type="number"
                name="startingBid"
                placeholder="Enter starting bid"
                className="form-input"
                value={formData.startingBid}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>

            {/* Bid Increment */}
            <div className="form-group">
              <label className="form-label">Bid Increment (ETH)</label>
              <input
                type="number"
                name="bidIncrement"
                placeholder="Enter bid increment"
                className="form-input"
                value={formData.bidIncrement}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>

            {/* Start & End Time */}
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                className="form-input"
                value={formData.startTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                className="form-input"
                value={formData.endTime}
                onChange={handleInputChange}
              />
            </div>
 
            <div className="form-group">
              <label className="form-label">Wallet</label>
              <div className="wallet-address">
                {walletAddress ? (
                  <span className="wallet-text">
                    {walletAddress.substring(0, 6)}...
                    {walletAddress.substring(walletAddress.length - 4)}
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
 
            <div className="form-group">
              <button type="submit" className="create-auction-btn">
                Create Auction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
