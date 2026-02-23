import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SecureAuction from "./SecureAuction.json";
import loginBg from "../../assets/login.png";
import "../items-upload/upload.css";

const Upload = () => {

  const user = JSON.parse(localStorage.getItem("user") || "null");

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

  const CONTRACT_ADDRESS = "0xD19A4cfF92E1F5F2B63446E3506205e9720793d6";

  useEffect(() => {
    if (window.ethereum && walletAddress) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const contractInstance = new web3Instance.eth.Contract(
        SecureAuction.abi,
        CONTRACT_ADDRESS
      );
      setContract(contractInstance);
    }
  }, [walletAddress]);

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadNFTImage = async () => {
    if (!selectedFile) {
      throw new Error("No file selected");
    }

    const formDataObj = new FormData();
    formDataObj.append("file", selectedFile);
    formDataObj.append("walletAddress", walletAddress);

   
    const headers = {};
    if (user && user.token) {
      headers["Authorization"] = `Bearer ${user.token}`;
      headers["X-User-ID"] = user.id;
    }

    try {
      const response = await fetch("http://localhost:8080/api/nft/upload", {
        method: "POST",
        headers: headers,
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || `Upload failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.imageUrl) {
        throw new Error("No image URL returned from server");
      }
      return data.imageUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  const handleCreateAuction = async (event) => {
    event.preventDefault();

    if (!user || user.role !== "SELLER") {
      alert("Only sellers can create auctions");
      return;
    }

    if (!walletAddress) {
      alert("Connect wallet first");
      return;
    }

    if (
      !selectedFile ||
      !formData.itemName ||
      !formData.biddingTime ||
      !formData.minIncrement ||
      !formData.extensionTime
    ) {
      alert("Fill all required fields");
      return;
    }

    if (!web3 || !contract) {
      alert("Web3 not initialized");
      return;
    }

    setUploading(true);

    try {
       
      const imageUrl = await uploadNFTImage();
 
      const bidTime = formData.biddingTime.toString();
      const extension = formData.extensionTime.toString();
      const increment = web3.utils.toWei(formData.minIncrement.toString(), "ether");
      const max = formData.maxBid && parseFloat(formData.maxBid) > 0
        ? web3.utils.toWei(formData.maxBid.toString(), "ether")
        : "0";

      const gasEstimate = await contract.methods
        .createtAuction(bidTime, increment, extension, max)
        .estimateGas({ from: walletAddress });

      const receipt = await contract.methods
        .createtAuction(bidTime, increment, extension, max)
        .send({
          from: walletAddress,
          gas: Math.floor(Number(gasEstimate) * 1.2),
        });

      
      const auctionData = {
        itemName: formData.itemName,
        imageUrl: imageUrl,
        sellerId: user.id,
        sellerUsername: user.username,
        ownerAddress: walletAddress,
        biddingTime: parseInt(formData.biddingTime),
        minIncrement: parseFloat(formData.minIncrement),
        extensionTime: parseInt(formData.extensionTime),
        maxBid: formData.maxBid ? parseFloat(formData.maxBid) : null,
        contractAddress: CONTRACT_ADDRESS,
        transactionHash: receipt.transactionHash
      };

      const backendResponse = await fetch(
        "http://localhost:8080/api/seller/auction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(user && user.token && {
              "Authorization": `Bearer ${user.token}`,
              "X-User-ID": user.id
            })
          },
          body: JSON.stringify(auctionData),
        }
      );

      const backendData = await backendResponse.json().catch(() => ({}));
      
      if (!backendResponse.ok) {
        const errorMsg = backendData.error || backendData.message || "Backend save failed";
        throw new Error(errorMsg);
      }

      alert("✅ Auction created successfully!");

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
      console.error(error);
      alert("❌ Auction creation failed: " + error.message);
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
          <h2>Create NFT Auction</h2>

          <form onSubmit={handleCreateAuction}>

            <input type="file" onChange={handleFileSelect} required />

            <input
              type="text"
              name="itemName"
              placeholder="NFT Name"
              value={formData.itemName}
              onChange={handleInputChange}
              required
            />

            <input
              type="number"
              name="biddingTime"
              placeholder="Bidding Time (seconds)"
              value={formData.biddingTime}
              onChange={handleInputChange}
              required
            />

            <input
              type="number"
              name="minIncrement"
              placeholder="Min Increment (ETH)"
              value={formData.minIncrement}
              onChange={handleInputChange}
              required
            />

            <input
              type="number"
              name="extensionTime"
              placeholder="Extension Time (seconds)"
              value={formData.extensionTime}
              onChange={handleInputChange}
              required
            />

            <input
              type="number"
              name="maxBid"
              placeholder="Max Bid (Optional)"
              value={formData.maxBid}
              onChange={handleInputChange}
            />

            {!walletAddress ? (
              <button type="button" onClick={connectWallet}>
                Connect Wallet
              </button>
            ) : (
              <p>Wallet: {walletAddress}</p>
            )}

            <button type="submit" disabled={uploading}>
              {uploading ? "Creating..." : "Create Auction"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
