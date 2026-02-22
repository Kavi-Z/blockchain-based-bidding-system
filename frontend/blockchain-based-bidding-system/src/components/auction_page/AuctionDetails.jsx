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

  useEffect(() => {
    if (!user || user.role !== "SELLER") {
      alert("You must be logged in as a seller to view auction details");
      navigate("/seller-login");
      return;
    }
    fetchAuctionDetails();
  }, [auctionId, user, navigate]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch auction details
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

      // Fetch bid history
      const bidsResponse = await fetch(`http://localhost:8080/api/bids/auction/${auctionId}`, {
        headers: {
          Authorization: `Bearer ${user.token || ""}`,
          "X-User-ID": user.id,
        },
      });

      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json();
        if (bidsData.success && Array.isArray(bidsData.bids)) {
          setBids(bidsData.bids);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load auction details");
      console.error("Error fetching auction details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAuctionDetails();
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
          </div>
        </div>

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
                <div className="col-wallet">Wallet Address</div>
                <div className="col-amount">Bid Amount</div>
                <div className="col-time">Timestamp</div>
                <div className="col-tx">Transaction Hash</div>
              </div>
              {bids.map((bid, index) => (
                <div key={bid.id} className="bid-row">
                  <div className="col-rank">#{index + 1}</div>
                  <div className="col-wallet">
                    <code>{bid.walletAddress}</code>
                  </div>
                  <div className="col-amount">
                    <span className="amount">${parseFloat(bid.bidAmount).toFixed(2)}</span>
                  </div>
                  <div className="col-time">
                    {new Date(bid.timestamp).toLocaleString()}
                  </div>
                  <div className="col-tx">
                    <code className="tx-hash">{bid.transactionHash || "N/A"}</code>
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
