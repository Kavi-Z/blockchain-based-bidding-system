import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import Web3 from "web3";
import SecureAuction from "./SecureAuction.json";
import { getConfiguredContractAddress } from "../../services/contractService";
import loginBg from "../../assets/login.png";
import "./upload.css";

import { apiUrl } from "../../config/env";

const Upload = () => {
  const { getIDToken } = useAuthContext();
  const internalUserId = localStorage.getItem("internalUserId");
  const userRole = localStorage.getItem("userRole");

  const [walletAddress, setWalletAddress] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    biddingTime: "",
    minIncrement: "",
    extensionTime: "",
    maxBid: "",
  });

  const CONTRACT_ADDRESS = getConfiguredContractAddress();

  // Initialize Web3 and contract when walletAddress is set
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
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async () => {
    if (!selectedFile) throw new Error("No file selected");

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("walletAddress", walletAddress);

    const headers = {};
    const token = await getIDToken();
    if (token && internalUserId) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["X-User-ID"] = internalUserId;
    }

    const response = await fetch(apiUrl("/api/nft/upload"), {
      method: "POST",
      headers: headers,
      body: data,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || err.message || "Image upload failed");
    }

    const resData = await response.json();
    if (!resData.imageUrl) throw new Error("No image URL returned from server");

    return resData.imageUrl;
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();

    if (userRole !== "SELLER") {
      alert("Only sellers can create auctions");
      return;
    }
    if (!walletAddress) {
      alert("Connect wallet first");
      return;
    }
    if (!selectedFile || !formData.itemName || !formData.biddingTime || !formData.minIncrement || !formData.extensionTime) {
      alert("Fill all required fields");
      return;
    }
    if (!web3 || !contract) {
      alert("Web3 not initialized");
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadImage();

      const bidTime = parseInt(formData.biddingTime);
      const extension = parseInt(formData.extensionTime);
      const increment = web3.utils.toWei(formData.minIncrement.toString(), "ether");
      const max = formData.maxBid && parseFloat(formData.maxBid) > 0
        ? web3.utils.toWei(formData.maxBid.toString(), "ether")
        : "0";

      const gasEstimate = await contract.methods
        .createtAuction(bidTime, increment, extension, max)
        .estimateGas({ from: walletAddress });

      const receipt = await contract.methods
        .createtAuction(bidTime, increment, extension, max)
        .send({ from: walletAddress, gas: Math.floor(Number(gasEstimate) * 1.2) });

      const token = await getIDToken();
      const auctionData = {
        itemName: formData.itemName,
        imageUrl,
        sellerId: internalUserId,
        sellerUsername: localStorage.getItem("userEmail"),
        ownerAddress: walletAddress,
        biddingTime: bidTime,
        minIncrement: parseFloat(formData.minIncrement),
        extensionTime: extension,
        maxBid: formData.maxBid ? parseFloat(formData.maxBid) : null,
        contractAddress: CONTRACT_ADDRESS,
        transactionHash: receipt.transactionHash,
      };

      const backendResp = await fetch(apiUrl("/api/seller/auction"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && {
            "Authorization": `Bearer ${token}`,
            "X-User-ID": internalUserId,
          }),
        },
        body: JSON.stringify(auctionData),
      });

      const backendData = await backendResp.json().catch(() => ({}));
      if (!backendResp.ok) {
        throw new Error(backendData.error || backendData.message || "Backend save failed");
      }

      alert("✅ Auction created successfully!");
      setFormData({ itemName: "", biddingTime: "", minIncrement: "", extensionTime: "", maxBid: "" });
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
    <div className="upload-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="upload-content">
        <div className="upload-box">
          <h2>Create NFT Auction</h2>
          <form onSubmit={handleCreateAuction}>
            <input type="file" onChange={handleFileSelect} required />
            {imagePreview && <img src={imagePreview} alt="preview" style={{ width: "150px", margin: "10px 0" }} />}
            <input type="text" name="itemName" placeholder="NFT Name" value={formData.itemName} onChange={handleInputChange} required />
            <input type="number" name="biddingTime" placeholder="Bidding Time (seconds)" value={formData.biddingTime} onChange={handleInputChange} required />
            <input type="number" name="minIncrement" placeholder="Min Increment (ETH)" value={formData.minIncrement} onChange={handleInputChange} required />
            <input type="number" name="extensionTime" placeholder="Extension Time (seconds)" value={formData.extensionTime} onChange={handleInputChange} required />
            <input type="number" name="maxBid" placeholder="Max Bid (Optional)" value={formData.maxBid} onChange={handleInputChange} />
            {!walletAddress ? (
              <button type="button" onClick={connectWallet}>Connect Wallet</button>
            ) : (
              <p>Wallet: {walletAddress}</p>
            )}
            <button type="submit" disabled={uploading}>{uploading ? "Creating..." : "Create Auction"}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;