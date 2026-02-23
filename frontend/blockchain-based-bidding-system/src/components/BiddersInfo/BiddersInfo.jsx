import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./BiddersInfo.css";

export default function BiddersInfo() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("won"); // "won", "active", "all"
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("won-auctions"); // "won-auctions", "bid-history"
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
      fetchBidHistory();
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
  
  const fetchBidHistory = async () => {
    try {
      if (!user || !user.id) {
        console.warn("User not loaded, cannot fetch bid history");
        return;
      }

      console.log("Fetching bid history for user:", user.id);
 
      const response = await fetch("http://localhost:8080/api/bids/user/history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token || ""}`,
          "X-User-ID": user.id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bid history fetched:", data.totalBids);
        setBidHistory(data.bids || []);
      } else {
        console.warn("Failed to fetch bid history:", response.status);
      }
    } catch (error) {
      console.error("fetchBidHistory error:", error);
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
        {/* Main Tab Switcher */}
        <div className="main-tabs">
          <button
            className={`main-tab ${activeTab === "won-auctions" ? "active" : ""}`}
            onClick={() => setActiveTab("won-auctions")}
          >
            🏆 Won Auctions
          </button>
          <button
            className={`main-tab ${activeTab === "bid-history" ? "active" : ""}`}
            onClick={() => setActiveTab("bid-history")}
          >
            📊 All Bid History
          </button>
        </div>

        {/* Auction Filters (only for won-auctions tab) */}
        {activeTab === "won-auctions" && (
          <>
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
          </>
        )}
      </div>
 
      {error && <div className="alert alert-error">{error}</div>}

      {/* Won Auctions Tab */}
      {activeTab === "won-auctions" && (
        <>
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
        </>
      )}

      {/* Bid History Tab */}
      {activeTab === "bid-history" && (
        <>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading your bid history...</p>
            </div>
          ) : bidHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h2>No Bids Yet</h2>
              <p>Start bidding on auctions to see your bid history here.</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/bidder-dashboard")}
              >
                Browse Auctions
              </button>
            </div>
          ) : (
            <div className="bid-history-section">
              <div className="bid-history-table">
                <div className="table-header">
                  <div className="col-item">
Item</div>
                  <div className="col-amount">Bid Amount</div>
                  <div className="col-auction">Auction Status</div>
                  <div className="col-highest">Highest?</div>
                  <div className="col-time">Bid Time</div>
                </div>
                {bidHistory.map((bid, index) => (
                  <div key={index} className="table-row">
                    <div className="col-item">
                      <div className="bid-item-info">
                        {bid.imageUrl && (
                          <img
                            src={bid.imageUrl}
                            alt={bid.itemName}
                            className="bid-item-image"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/50x50?text=No+Image";
                            }}
                          />
                        )}
                        <span>{bid.itemName}</span>
                      </div>
                    </div>
                    <div className="col-amount">
                      <strong>${parseFloat(bid.bidAmount).toFixed(2)}</strong>
                    </div>
                    <div className="col-auction">
                      <span className={`status-badge ${bid.auctionStatus === "CLOSED" ? "status-closed" : "status-active"}`}>
                        {bid.auctionStatus === "CLOSED" ? "✅ Closed" : "🔄 Active"}
                      </span>
                    </div>
                    <div className="col-highest">
                      <span className={bid.isHighestBid ? "is-highest" : "not-highest"}>
                        {bid.isHighestBid ? "🏆 Yes" : "No"}
                      </span>
                    </div>
                    <div className="col-time">
                      {new Date(bid.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer className="bidders-footer">
        <p>&copy; 2025 Blockchain Bidding System. All rights reserved.</p>
      </footer>
    </div>
  );
}
