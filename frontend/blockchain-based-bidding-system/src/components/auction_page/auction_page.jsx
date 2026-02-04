import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AuctionContract from "./SecureAuction.json";
import "./auction_page.css";

const CONTRACT_ADDRESS = "0xc3662276B3594bD8d70778b093caC2F31E6D497E";

const AuctionPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [account, setAccount] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadSellerAuctions();
    const interval = setInterval(loadSellerAuctions, 5000);  
    return () => clearInterval(interval);
  }, []);

  const loadSellerAuctions = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const sellerAddress = accounts[0];
    setAccount(sellerAddress);

    const contract = new web3.eth.Contract(AuctionContract.abi, CONTRACT_ADDRESS);
    const auctionCount = await contract.methods.auctionCount().call();

    const allAuctions = await Promise.all(
      Array.from({ length: auctionCount }, (_, i) => contract.methods.auctions(i).call())
    );

    // Filter only current active auctions by this seller
    const activeSellerAuctions = allAuctions
      .filter(
        (a) =>
          a.seller.toLowerCase() === sellerAddress.toLowerCase() &&
          a.active &&
          Number(a.endTime) > Math.floor(Date.now() / 1000)
      )
      .map((a, idx) => ({
        id: idx,
        image: a.nftURI,
        startPrice: web3.utils.fromWei(a.startPrice, "ether"),
        highestBid: web3.utils.fromWei(a.highestBid, "ether"),
        highestBidder: a.highestBidder,
        endTime: Number(a.endTime),
        active: a.active,
      }));

    setAuctions(activeSellerAuctions);
  };

  const getRemainingTime = (endTime) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = endTime - now;

    if (diff <= 0) return "Ended";

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}m ${seconds}s`;
  };

  const shortenAddress = (addr) => {
    if (!addr || addr === "0x0000000000000000000000000000000000000000") return "No bids";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="auction-page">
      <div className="auction-navbar">
        <h2 className="auction-logo">CryptOps</h2>
        <button onClick={() => navigate("/")}>Home</button>
      </div>

      <div className="auction-header">
        <h1>Your Current Auctions</h1>
        <p className="user-id">Seller: {shortenAddress(account)}</p>
      </div>

      <div className="auctions-grid">
        {auctions.length === 0 && (
          <p className="no-auctions">No active auctions at the moment</p>
        )}

        {auctions.map((auction) => (
          <div key={auction.id} className="auction-card">
            <img src={auction.image} alt="NFT" className="auction-image" />

            <div className="auction-details">
              <p>Start Price: {auction.startPrice} ETH</p>
              <p>Highest Bid: {auction.highestBid} ETH</p>
              <p>Highest Bidder: {shortenAddress(auction.highestBidder)}</p>

              <p className="auction-time">
                Ends in {getRemainingTime(auction.endTime)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="create-auction-btn" onClick={() => navigate("/upload")}>
        Create New Auction
      </button>
    </div>
  );
};

export default AuctionPage;
