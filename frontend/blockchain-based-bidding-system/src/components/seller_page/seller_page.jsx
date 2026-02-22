import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./seller_page.css";

export default function SellerPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [countdowns, setCountdowns] = useState({});
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(5000); // 5 seconds
  const fetchOnce = useRef(false);
  const pollIntervalRef = useRef(null);

  // Check authentication
  useEffect(() => {
    if (!user || user.role !== "SELLER") {
      alert("You must be logged in as a seller to access this page");
      navigate("/seller-login");
      return;
    }
    // Prevent double-fetch in React StrictMode (dev) or duplicate mounts
    if (!fetchOnce.current) {
      fetchOnce.current = true;
      fetchSellerAuctions();
    }

    // Set up polling for real-time updates
    pollIntervalRef.current = setInterval(() => {
      fetchSellerAuctions();
    }, autoRefreshInterval);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [user, navigate, autoRefreshInterval]);

  // Fetch seller's auctions from database
  const fetchSellerAuctions = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user || !user.id) {
        setError("User not loaded");
        setLoading(false);
        return;
      }

      console.log("fetchSellerAuctions -> user:", user);

      const response = await fetch(`http://localhost:8080/api/auctions/seller/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token || ""}`,
          "X-User-ID": user.id,
        },
      });
 
      const contentType = response.headers.get("content-type") || "";
      console.log("fetchSellerAuctions -> response.status:", response.status, "content-type:", contentType);
 
      if (response.status === 204) {
        setAuctions([]);
        return;
      }

      let data = null;
      let rawText = null;

      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (parseError) {
 
          try {
            rawText = await response.text();
          } catch (tErr) {
            rawText = null;
          }
          console.error("JSON parse error:", parseError, "rawText:", rawText);
          throw new Error(`Invalid JSON response from server${rawText ? ": " + rawText : "."}`);
        }
      } else {
        // Not JSON: read text body (may contain exception class name or message)
        try {
          rawText = await response.text();
        } catch (tErr) {
          rawText = null;
        }
        const message = rawText && rawText.trim().length > 0 ? rawText.trim() : `Server returned ${response.status}`;
        // If server returned a non-OK status include the raw text
        if (!response.ok) {
          throw new Error(message);
        }
        // If OK but not JSON, nothing to set
        setAuctions([]);
        return;
      }

      // At this point we have `data` parsed from JSON
      if (!response.ok) {
        const errMsg = (data && (data.error || data.message)) || `Server error: ${response.status}`;
        throw new Error(errMsg);
      }

      if (data && data.success) {
        if (Array.isArray(data.auctions)) {
          setAuctions(data.auctions);
        } else {
          setAuctions([]);
        }
      } else {
        throw new Error((data && (data.error || data.message)) || "Invalid response format from server");
      }
    } catch (error) {
      setError(error.message || "Failed to load auctions");
      console.error("fetchSellerAuctions error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update countdowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      auctions.forEach((auction) => {
        const now = new Date();
        const end = new Date(auction.endTime);
        const diff = end - now;

        if (diff <= 0) {
          newCountdowns[auction.id] = "Ended";
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);

          if (days > 0) {
            newCountdowns[auction.id] = `${days}d ${hours}h ${minutes}m`;
          } else {
            newCountdowns[auction.id] = `${hours}h ${minutes}m ${seconds}s`;
          }
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [auctions]);

  const handleCreateAuction = () => {
    navigate("/auction-create");
  };

  const handleRefresh = () => {
    fetchSellerAuctions();
  };

  const handleEndAuction = async (auctionId) => {
    try {
      if (!window.confirm("Are you sure you want to end this auction? This action cannot be undone.")) {
        return;
      }

      const response = await fetch(`http://localhost:8080/api/auctions/${auctionId}/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token || ""}`,
          "X-User-ID": user.id,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to end auction");
        return;
      }

      // Show success message
      alert(
        `🎉 Auction ended successfully!\n\n` +
        `Winner: ${data.winner || "No bidder"}\n` +
        `Final Bid: $${data.finalBid?.toFixed(2) || "0.00"}`
      );

      // Refresh auctions list
      await fetchSellerAuctions();
    } catch (error) {
      setError("Error ending auction: " + error.message);
      console.error("handleEndAuction error:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <span className="badge badge-active">Active</span>;
      case "CLOSED":
        return <span className="badge badge-closed">Closed</span>;
      case "CANCELLED":
        return <span className="badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const isAuctionEnded = (endTime) => {
    return new Date() > new Date(endTime);
  };

  return (
    <div className="seller-dashboard-container">
      {/* Header */}
      <div className="seller-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📦 Seller Dashboard</h1>
            <p>Welcome, {user?.username || user?.email}</p>
          </div>
          <div className="header-right">
            <button className="btn-refresh" onClick={handleRefresh}>
              🔄 Refresh
            </button>
            <button className="btn-create-auction" onClick={handleCreateAuction}>
              ➕ Create New Auction
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="seller-content">
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your auctions...</p>
          </div>
        ) : auctions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No Auctions Yet</h2>
            <p>You haven't created any auctions yet.</p>
            <button className="btn-primary" onClick={handleCreateAuction}>
              Create Your First Auction
            </button>
          </div>
        ) : (
          <div className="auctions-section">
            <div className="section-header">
              <h2>Your Auctions ({auctions.length})</h2>
            </div>

            <div className="auctions-grid">
              {auctions.map((auction) => (
                <div key={auction.id} className="auction-card">
                  {/* Image */}
                  <div className="card-image">
                    <img
                      src={auction.imageUrl || "https://via.placeholder.com/300"}
                      alt={auction.itemName}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                    />
                    {getStatusBadge(auction.status)}
                  </div>

                  {/* Card Content */}
                  <div className="card-content">
                    <h3 className="item-name">{auction.itemName}</h3>
                    <p className="description">
                      {auction.description.length > 100
                        ? auction.description.substring(0, 100) + "..."
                        : auction.description}
                    </p>

                    {/* Price Info */}
                    <div className="price-section">
                      <div className="price-item">
                        <label>Starting Price</label>
                        <span className="price">${auction.startingPrice.toFixed(2)}</span>
                      </div>
                      <div className="price-item">
                        <label>Current Bid</label>
                        <span className="price">${auction.currentHighestBid.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Bidder Info */}
                    {auction.highestBidderId && (
                      <div className="bidder-info">
                        <label>Highest Bidder</label>
                        <p>{auction.highestBidderUsername || "Anonymous"}</p>
                      </div>
                    )}

                    {/* Countdown */}
                    <div className="countdown">
                      <label>Time Remaining</label>
                      <p className={auction.status === "ACTIVE" ? "active" : "ended"}>
                        {countdowns[auction.id] || "Calculating..."}
                      </p>
                    </div>

                    {/* Auction Details */}
                    <div className="auction-details-mini">
                      <div className="detail-item">
                        <span>Min Increment:</span> ${auction.minIncrement.toFixed(2)}
                      </div>
                      <div className="detail-item">
                        <span>Duration:</span> {auction.biddingTime} min
                      </div>
                      {auction.maxBid && (
                        <div className="detail-item">
                          <span>Max Bid:</span> ${auction.maxBid.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      className="btn-view-details"
                      onClick={() => navigate(`/auction/${auction.id}`)}
                    >
                      View Details →
                    </button>
                    
                    {/* End Auction Button - shown when auction has ended */}
                    {auction.status === "ACTIVE" && isAuctionEnded(auction.endTime) && (
                      <button
                        className="btn-end-auction"
                        onClick={() => handleEndAuction(auction.id)}
                      >
                        🏁 End Auction & Award
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="seller-footer">
        <p>&copy; 2025 Bidding System. All rights reserved.</p>
      </footer>
    </div>
  );
}
