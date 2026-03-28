import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./auction_details.css";

export default function AuctionDetails() {
  const navigate = useNavigate();
  const { auctionId } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [finalizing, setFinalizing] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "SELLER") {
      alert("You must be logged in as a seller to view auction details");
      navigate("/seller-login");
      return;
    }
    fetchAuctionDetails();
  }, [auctionId]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      setError("");
 
      const auctionResponse = await fetch(`http://localhost:8080/api/auctions/${auctionId}`, {
        headers: {
          Authorization: `Bearer ${user.token || ""}`,
          "X-User-ID": user.id,
        },
      });

      if (!auctionResponse.ok) {
        throw new Error("Failed to fetch auction details");
      }

      const auctionData = await auctionResponse.json();
      if (auctionData.success && auctionData.auction) {
        setAuction(auctionData.auction);
      }
 
      // Fetch bids with comprehensive error handling
      console.log("Fetching bids for auction:", auctionId);
      const bidsResponse = await fetch(
        `http://localhost:8080/api/bids/auction/${auctionId}/bids-with-details`,
        {
          headers: {
            Authorization: `Bearer ${user.token || ""}`,
            "X-User-ID": user.id,
          },
        }
      );

      console.log("Bids response status:", bidsResponse.status);

      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json();
        console.log("Bids API response:", bidsData);
        
        let bidsArray = [];
        
        // Handle different response formats
        if (bidsData.success && Array.isArray(bidsData.bids)) {
          bidsArray = bidsData.bids;
          console.log("Format 1: success.bids - Loaded", bidsArray.length, "bids");
        } else if (Array.isArray(bidsData)) {
          bidsArray = bidsData;
          console.log("Format 2: direct array - Loaded", bidsArray.length, "bids");
        } else if (bidsData.data && Array.isArray(bidsData.data)) {
          bidsArray = bidsData.data;
          console.log("Format 3: data array - Loaded", bidsArray.length, "bids");
        } else if (bidsData.success === false) {
          console.warn("API returned error:", bidsData.message);
          bidsArray = [];
        } else {
          console.warn("Unexpected bids response format:", bidsData);
          bidsArray = [];
        }
        
        setBids(bidsArray);
        console.log("Final bids set to:", bidsArray.length);
      } else {
        console.warn("Bids fetch failed with status:", bidsResponse.status);
        try {
          const errorData = await bidsResponse.json();
          console.warn("Error response:", errorData);
          if (errorData.message) {
            setError("Failed to load bids: " + errorData.message);
          }
        } catch (e) {
          const textError = await bidsResponse.text();
          console.warn("Error response text:", textError);
        }
        setBids([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load auction details");
      console.error("Error fetching auction details:", err);
      setBids([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAuctionDetails();
  };

  const handleEndAuction = async () => {
    if (!window.confirm("Are you sure you want to end this auction?")) {
      return;
    }

    setFinalizing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/auctions/${auctionId}/end`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token || ""}`,
            "X-User-ID": user.id,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to end auction");
      }

      setSuccess("✅ Auction ended successfully! Ready to finalize.");
      setTimeout(() => {
        fetchAuctionDetails();
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to end auction");
      console.error("Error ending auction:", err);
    } finally {
      setFinalizing(false);
    }
  };

  const handleFinalizeAuction = async () => {
    if (!window.confirm("Finalize this auction and transfer NFT to the highest bidder?")) {
      return;
    }

    setFinalizing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/auctions/${auctionId}/finalize`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token || ""}`,
            "X-User-ID": user.id,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to finalize auction");
      }

      setSuccess(`🎉 NFT Successfully Transferred to ${data.winner || auction.highestBidderUsername}!`);
      setTimeout(() => {
        fetchAuctionDetails();
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to finalize auction");
      console.error("Error finalizing auction:", err);
    } finally {
      setFinalizing(false);
    }
  };

  if (loading) {
    return (
      <div className="auction-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="auction-details-container">
        <div className="error-state">
          <h2>Auction Not Found</h2>
          <p>The auction you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/seller-dashboard")} className="btn-back">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auction-details-container">
      <div className="details-header">
        <button onClick={() => navigate("/seller-dashboard")} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>Auction Details</h1>
        <button onClick={handleRefresh} className="btn-refresh">
          🔄 Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="details-content">
        {/* Auction Info Card */}
        <div className="auction-info-card">
          <div className="info-left">
            <img
              src={auction.imageUrl || "https://via.placeholder.com/400"}
              alt={auction.itemName}
              onError={(e) => (e.target.src = "https://via.placeholder.com/400")}
              className="auction-image"
            />
          </div>

          <div className="info-right">
            <h2>{auction.itemName}</h2>
            <p className="description">{auction.description}</p>

            <div className="info-grid">
              <div className="info-item">
                <label>Status</label>
                <span className={`status badge-${auction.status.toLowerCase()}`}>
                  {auction.status}
                </span>
              </div>
              <div className="info-item">
                <label>Starting Price</label>
                <span>${auction.startingPrice.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <label>Current Highest Bid</label>
                <span className="highlight">${auction.currentHighestBid.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <label>Min Increment</label>
                <span>${auction.minIncrement.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <label>Highest Bidder</label>
                <span>{auction.highestBidderUsername || "No bids yet"}</span>
              </div>
              <div className="info-item">
                <label>Bidding Duration</label>
                <span>{auction.biddingTime} minutes</span>
              </div>
              <div className="info-item">
                <label>Extension Time</label>
                <span>{auction.extensionTime} minutes</span>
              </div>
              {auction.maxBid && (
                <div className="info-item">
                  <label>Max Bid</label>
                  <span>${auction.maxBid.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="time-info">
              <div>
                <label>Start Time</label>
                <p>{new Date(auction.startTime).toLocaleString()}</p>
              </div>
              <div>
                <label>End Time</label>
                <p>{new Date(auction.endTime).toLocaleString()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              {auction.status === "ACTIVE" && new Date(auction.endTime) <= new Date() && (
                <>
                  <button
                    onClick={handleEndAuction}
                    disabled={finalizing}
                    className="btn-end-auction"
                  >
                    {finalizing ? "Processing..." : "🏁 End Auction"}
                  </button>
                </>
              )}
              {auction.status === "CLOSED" && bids.length > 0 && auction.highestBidderId && (
                <button
                  onClick={handleFinalizeAuction}
                  disabled={finalizing}
                  className="btn-finalize-auction"
                >
                  {finalizing ? "Finalizing..." : "✨ Finalize & Transfer NFT"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* NFT Ownership Status */}
        {auction.status === "CLOSED" && auction.highestBidderId && (
          <div className="nft-ownership-card">
            <h3>🎁 NFT Ownership</h3>
            <div className="ownership-info">
              <div className="ownership-status">
                <label>Current NFT Owner</label>
                <div className="owner-display">
                  <div className="owner-name">
                    <strong>{auction.highestBidderUsername || "N/A"}</strong>
                  </div>
                  <div className="owner-wallet">
                    <small>Wallet: {auction.highestBidderId}</small>
                  </div>
                </div>
              </div>
              <div className="ownership-amount">
                <label>Winning Bid Amount</label>
                <span className="winning-amount">${auction.currentHighestBid.toFixed(2)}</span>
              </div>
            </div>
            <div className="ownership-note">
              ✅ The highest bidder has won this auction and owns the NFT!
            </div>
          </div>
        )}

        {/* Bidding History */}
        <div className="bidding-history-card">
          <h3>Bidding History ({bids.length} bids)</h3>

          {bids.length === 0 ? (
            <div className="empty-bids">
              <p>No bids placed yet on this auction.</p>
            </div>
          ) : (
            <div className="bids-table">
              <div className="bids-header">
                <div className="col-rank">Rank</div>
                <div className="col-bidder">Bidder</div>
                <div className="col-username">Username</div>
                <div className="col-amount">Bid Amount</div>
                <div className="col-time">Time</div>
              </div>
              {bids.map((bid, index) => (
                <div key={bid.bidId} className={`bid-row ${bid.isHighestBid ? "highest-bid" : ""}`}>
                  <div className="col-rank">#{index + 1} {bid.isHighestBid && "🏆"}</div>
                  <div className="col-bidder">
                    {bid.bidderProfileImage ? (
                      <img
                        src={bid.bidderProfileImage}
                        alt={bid.bidderUsername}
                        className="bidder-avatar"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="bidder-avatar-placeholder">👤</div>
                    )}
                  </div>
                  <div className="col-username">
                    <strong>{bid.bidderUsername || "Anonymous"}</strong>
                    <small>{bid.walletAddress?.slice(0, 10)}...{bid.walletAddress?.slice(-8)}</small>
                  </div>
                  <div className="col-amount">
                    <span className={`amount ${bid.isHighestBid ? "highest" : ""}`}>
                      ${parseFloat(bid.bidAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="col-time">
                    {new Date(bid.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Blockchain Info */}
        {auction.transactionHash && (
          <div className="blockchain-info-card">
            <h3>Blockchain Information</h3>
            <div className="blockchain-grid">
              <div>
                <label>Contract Address</label>
                <code>{auction.contractAddress}</code>
              </div>
              <div>
                <label>Creation Transaction</label>
                <code>{auction.transactionHash}</code>
              </div>
              <div>
                <label>Block Number</label>
                <span>{auction.blockNumber}</span>
              </div>
              <div>
                <label>Seller Wallet</label>
                <code>{auction.ownerAddress}</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
