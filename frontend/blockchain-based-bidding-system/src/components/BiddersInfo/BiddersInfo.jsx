import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./BiddersInfo.css";

export default function BiddersInfo() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("won"); // "won", "active", "all"
  const [searchTerm, setSearchTerm] = useState("");
  const fetchOnce = useRef(false);

  // Check authentication
  useEffect(() => {
    if (!user || user.role !== "BIDDER") {
      alert("You must be logged in as a bidder to access this page");
      navigate("/bidder-login");
      return;
    }
    
    if (!fetchOnce.current) {
      fetchOnce.current = true;
      fetchBiddersNFTs();
    }
  }, [user, navigate]);
 
  const fetchBiddersNFTs = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user || !user.id) {
        setError("User not loaded");
        setLoading(false);
        return;
      }

      console.log("Fetching NFTs for bidder:", user.id);
 
      const response = await fetch("http://localhost:8080/api/auctions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token || ""}`,
          "X-User-ID": user.id,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch auctions: ${response.status}`);
      }

      const data = await response.json();
      const allAuctions = Array.isArray(data) ? data : data.auctions || [];

      console.log("All auctions fetched:", allAuctions.length);
 
      const nfts = allAuctions.filter(auction => {
       
        const isHighestBidder = 
          auction.highestBidderId === user.id || 
          auction.highestBidderUsername === user.username ||
          auction.highestBidderUsername === user.email;
        
        return isHighestBidder;
      });

      console.log("NFTs owned by user:", nfts.length);
      setOwnedNFTs(nfts);
    } catch (error) {
      setError(error.message || "Failed to load NFTs");
      console.error("fetchBiddersNFTs error:", error);
    } finally {
      setLoading(false);
    }
  }; 
  const getFilteredNFTs = () => {
    let filtered = ownedNFTs;

   
    if (filterStatus === "won") {
      filtered = filtered.filter(nft => nft.status === "CLOSED");
    } else if (filterStatus === "active") {
      filtered = filtered.filter(nft => nft.status === "ACTIVE");
    } 
    if (searchTerm) {
      filtered = filtered.filter(nft =>
        nft.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.sellerUsername.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

 
  const getDaysUntilEnd = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  
  const claimNFT = (auctionId) => {
    console.log("Claiming NFT for auction:", auctionId);
    // TODO: Implement blockchain NFT transfer or minting
    alert("NFT claim functionality will be implemented soon!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CLOSED":
        return "status-won";
      case "ACTIVE":
        return "status-active";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "CLOSED":
        return "✅ Won";
      case "ACTIVE":
        return "🔄 Active Bid";
      case "CANCELLED":
        return "❌ Cancelled";
      default:
        return status;
    }
  };

  const filteredNFTs = getFilteredNFTs();

  return (
    <div className="bidders-info-container">
      {/* Header */}
      <div className="bidders-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🏆 My Auction Victories & Bids</h1>
            <p>Track your won auctions and active bidding history</p>
          </div>
          <div className="header-right">
            <button
              className="btn-dashboard"
              onClick={() => navigate("/bidder-dashboard")}
            >
              ← Back to Bidding
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Search by item name, seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All ({ownedNFTs.length})
          </button>
          <button
            className={`filter-tab ${filterStatus === "won" ? "active" : ""}`}
            onClick={() => setFilterStatus("won")}
          >
            🏆 Won ({ownedNFTs.filter(n => n.status === "CLOSED").length})
          </button>
          <button
            className={`filter-tab ${filterStatus === "active" ? "active" : ""}`}
            onClick={() => setFilterStatus("active")}
          >
            🔄 Active Bids ({ownedNFTs.filter(n => n.status === "ACTIVE").length})
          </button>
        </div>
      </div>
 
      {error && <div className="alert alert-error">{error}</div>}

  
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your auction history...</p>
        </div>
      ) : filteredNFTs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No Auction Victories Yet</h2>
          <p>
            {ownedNFTs.length === 0
              ? "Start bidding to win your first NFT!"
              : "No results match your filters."}
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate("/bidder-dashboard")}
          >
            Browse Auctions
          </button>
        </div>
      ) : (
        <div className="nfts-section">
          <div className="nfts-grid">
            {filteredNFTs.map((nft) => (
              <div key={nft.id} className={`nft-card ${getStatusColor(nft.status)}`}>
                {/* Image */}
                <div className="nft-image">
                  <img
                    src={nft.imageUrl || nft.imageCID || "https://via.placeholder.com/300x300?text=No+Image"}
                    alt={nft.itemName}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                  <div className={`status-badge ${getStatusColor(nft.status)}`}>
                    {getStatusLabel(nft.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="nft-content">
                  <h3>{nft.itemName}</h3>
                  <p className="description">
                    {nft.description.substring(0, 80)}...
                  </p>

                  {/* Details */}
                  <div className="nft-details">
                    <div className="detail-row">
                      <span className="label">Seller</span>
                      <span className="value">{nft.sellerUsername}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Your Bid</span>
                      <span className="value price">${nft.currentHighestBid?.toFixed(2) || "N/A"}</span>
                    </div>
                    {nft.status === "ACTIVE" && (
                      <div className="detail-row">
                        <span className="label">Days Left</span>
                        <span className="value">{getDaysUntilEnd(nft.endTime)} days</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="label">Start Price</span>
                      <span className="value">${nft.startingPrice?.toFixed(2) || "N/A"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="nft-actions">
                    {nft.status === "CLOSED" && (
                      <>
                        <button
                          className="btn-claim"
                          onClick={() => claimNFT(nft.id)}
                        >
                          📜 Claim Certificate
                        </button>
                      </>
                    )}
                    {nft.status === "ACTIVE" && (
                      <button
                        className="btn-bid-more"
                        onClick={() => navigate("/bidder-dashboard")}
                      >
                        📈 Place Higher Bid
                      </button>
                    )}
                    <button
                      className="btn-details"
                      onClick={() => navigate(`/auction/${nft.id}`)}
                    >
                      View Full Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bidders-footer">
        <p>&copy; 2025 Blockchain Bidding System. All rights reserved.</p>
      </footer>
    </div>
  );
}
