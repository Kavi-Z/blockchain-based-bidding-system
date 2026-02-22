import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import SecureAuction from "./SecureAuction.json";
import "./bidderdashboard.css";

const BidderDashboard = () => {
  const navigate = useNavigate();
 
  const getStoredUser = () => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn("Invalid JSON in localStorage.user", e);
      }
    }
 
    const id = localStorage.getItem("userId") || localStorage.getItem("id");
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    const role = localStorage.getItem("role") || localStorage.getItem("userRole");

    if (id || token || role) {
      return { id, token, role };
    }

    return null;
  };

  const [user, setUser] = useState(getStoredUser());

  // Wallet & Contract state
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auctions state
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  // Fetching control
  const fetchOnce = useRef(false);

  const CONTRACT_ADDRESS =
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_CONTRACT_ADDRESS) ||
    (typeof process !== "undefined" && process.env && (process.env.REACT_APP_CONTRACT_ADDRESS || process.env.VITE_CONTRACT_ADDRESS)) ||
    "0x55286Ac3A309c90918CDa8B0093ED5ECb5aF07fD";
 
  useEffect(() => {
    if (!user || user.role !== "BIDDER") {
      alert("You must be logged in as a bidder to access this dashboard");
      navigate("/bidder-dashboard");
    }
  }, [user, navigate]);
 
  useEffect(() => {
    if (fetchOnce.current) return;
    fetchOnce.current = true;

    const init = async () => {
      setLoading(true);
      try {
        // Fetch active auctions from backend
        await fetchActiveAuctions();
      } catch (err) {
        setError(err.message || "Failed to initialize dashboard");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);
 
  const fetchActiveAuctions = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auctions", {
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "X-User-ID": user.id,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }

      const data = await response.json();
      // Filter for active auctions only
      const active = Array.isArray(data) 
        ? data.filter(a => a.status === "ACTIVE")
        : data.auctions?.filter(a => a.status === "ACTIVE") || [];
      
      // Log missing blockchain data for debugging
      active.forEach(auction => {
        if (!auction.transactionHash || !auction.blockNumber) {
          console.warn(`Auction ${auction.id} missing blockchain data. TxHash: ${auction.transactionHash}, BlockNum: ${auction.blockNumber}`);
        }
      });
      
      setAuctions(active);
      console.log("Loaded active auctions:", active);
    } catch (err) {
      console.error("Error fetching auctions:", err);
      setError(err.message);
    }
  };
  const findBlockchainAuctionIdByFallback = async (sellerWalletAddress, minIncrement) => {
    try {
      if (!contract) {
        throw new Error("Contract not initialized. Please connect your wallet first.");
      }

      console.log("Attempting fallback lookup with contract address:", CONTRACT_ADDRESS);
      console.log("Looking for auction: seller =", sellerWalletAddress, "minIncrement =", minIncrement);
 
      const provider = new ethers.BrowserProvider(window.ethereum);
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === "0x") {
        throw new Error(
          `No contract found at address ${CONTRACT_ADDRESS}. ` +
          `Please ensure the contract is deployed on the correct network (Ganache). ` +
          `Run 'truffle migrate --network ganache' and update CONTRACT_ADDRESS.`
        );
      }

      // Get total auction count
      let auctionCount;
      try {
        auctionCount = await contract.auctionCount();
      } catch (countErr) {
        throw new Error(
          `Failed to read auctionCount from contract. This usually means: ` +
          `1) Wrong contract address (${CONTRACT_ADDRESS}), ` +
          `2) Contract not deployed to this network, or ` +
          `3) ABI mismatch. Error: ${countErr.message}`
        );
      }

      const count = Number(auctionCount);

      console.log("Total auctions on blockchain:", count);

      if (count === 0) {
        throw new Error("No auctions found on blockchain");
      }
 
      for (let i = 1; i <= count; i++) {
        try {
          const auction = await contract.auctions(i);
          const { seller, minIncrement: chainMinIncrement, endTime, ended } = auction;

          const chainMinIncrementEth = ethers.formatEther(chainMinIncrement);
          const expectedMinIncrement = parseFloat(minIncrement).toFixed(18);
          const chainMinIncrementCompare = parseFloat(chainMinIncrementEth).toFixed(18);
          
          console.log(`Auction ${i}: seller=${seller}, minIncrement=${chainMinIncrementEth}, ended=${ended}`);
 
          if (
            seller.toLowerCase() === sellerWalletAddress.toLowerCase() &&
            Math.abs(parseFloat(chainMinIncrementEth) - parseFloat(minIncrement)) < 0.0001
          ) {
            console.log("✓ Found matching auction on blockchain at index:", i);
            return BigInt(i);
          }
        } catch (auctionErr) {
          console.warn(`Could not read auction ${i}:`, auctionErr.message);
          continue;
        }
      }

      throw new Error(
        `Could not find matching auction on blockchain. Searched ${count} auctions. ` +
        `Ensure this auction was created with the correct contract.`
      );
    } catch (err) {
      console.error("Error in fallback auction lookup:", err);
      throw new Error(`Fallback blockchain lookup failed: ${err.message}`);
    }
  }; 
  const getBlockchainAuctionId = async (transactionHash, blockNumber) => {
    if (!transactionHash || !window.ethereum) {
      throw new Error("Missing transaction hash or MetaMask");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
       
      const receipt = await provider.getTransactionReceipt(transactionHash);
      if (!receipt) {
        throw new Error("Could not find transaction receipt");
      }
 
      const iface = new ethers.Interface(SecureAuction.abi);
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed && parsed.name === "AuctionCreated") {
            // AuctionCreated event has: auctionId (indexed), seller
            const auctionId = parsed.args[0];
            console.log("Found blockchain auctionId from receipt:", auctionId.toString());
            return BigInt(auctionId);
          }
        } catch {
         
        }
      }

      throw new Error("AuctionCreated event not found in transaction");
    } catch (err) {
      console.error("Error extracting auction ID:", err);
      throw new Error(`Failed to get blockchain auction ID: ${err.message}`);
    }
  };

  /**
   * Connect MetaMask wallet
   */
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install MetaMask.");
        return false;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWalletAddress(accounts[0]);
      setSuccess(`Wallet connected: ${accounts[0].substring(0, 10)}...`);
      setTimeout(() => setSuccess(""), 3000);

      // Initialize contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        SecureAuction.abi,
        signer
      );
      setContract(contractInstance);

      return true;
    } catch (err) {
      setError(`Wallet connection failed: ${err.message}`);
      return false;
    }
  };

  /**
   * Place a bid on selected auction
   */
  const placeBid = async () => {
    if (!selectedAuctionId) {
      setError("Please select an auction");
      return;
    }

    // Pre-bid check: fetch and verify contract state
    if (!contract) {
      setError("Contract not initialized. Please connect wallet first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Find the selected auction from frontend state
      const frontendAuction = auctions.find(a => a.id === selectedAuctionId);
      if (!frontendAuction) {
        throw new Error("Auction not found in local state");
      }

      // Get blockchain auction ID - try transaction hash first, fallback to on-chain lookup
      let blockchainAuctionId;

      if (frontendAuction.transactionHash && frontendAuction.blockNumber) {
        blockchainAuctionId = await getBlockchainAuctionId(
          frontendAuction.transactionHash,
          frontendAuction.blockNumber
        );
      } else {
        console.warn("Transaction hash/block number missing, using fallback lookup...");
        // Fallback: query all auctions to find the match
        blockchainAuctionId = await findBlockchainAuctionIdByFallback(
          frontendAuction.ownerAddress || walletAddress,
          frontendAuction.minIncrement
        );
      }

      // Fetch auction struct from contract using blockchain auction ID
      const auction = await contract.auctions(blockchainAuctionId);
      const { seller, startTime, endTime, ended, highestBidder, highestBid, minIncrement, extensionTime, maxBid } = auction;

      console.log("=== On-Chain Auction State ===");
      console.log("blockchainAuctionId:", blockchainAuctionId.toString());
      console.log("seller:", seller);
      console.log("startTime:", startTime.toString());
      console.log("endTime:", endTime.toString(), "| now:", Math.floor(Date.now() / 1000));
      console.log("ended:", ended);
      console.log("highestBid:", ethers.formatEther(highestBid), "ETH");
      console.log("minIncrement:", ethers.formatEther(minIncrement), "ETH");
      console.log("maxBid:", ethers.formatEther(maxBid), "ETH");
      console.log("bidder (you):", walletAddress);
      console.log("==============================");

      // Check if auction is active
      const nowSeconds = Math.floor(Date.now() / 1000);
      const endTimeSeconds = Number(endTime);
      const startTimeSeconds = Number(startTime);
      
      console.log("Validation check:");
      console.log("  nowSeconds:", nowSeconds);
      console.log("  startTimeSeconds:", startTimeSeconds, "started?", startTimeSeconds <= nowSeconds);
      console.log("  endTimeSeconds:", endTimeSeconds, "not ended?", nowSeconds < endTimeSeconds);
      console.log("  ended flag:", ended);
      
      if (startTimeSeconds > nowSeconds) {
        throw new Error(`Auction has not started yet on blockchain. Starts at ${new Date(startTimeSeconds * 1000).toLocaleString()}`);
      }
      if (nowSeconds >= endTimeSeconds) {
        throw new Error(`Auction has ended on blockchain at ${new Date(endTimeSeconds * 1000).toLocaleString()}`);
      }
      if (ended) {
        throw new Error("Auction is marked as ended on blockchain.");
      }
      if (walletAddress?.toLowerCase() === seller?.toLowerCase()) {
        throw new Error("You are the seller and cannot bid on your own auction.");
      }

      if (!bidAmount || parseFloat(bidAmount) <= 0) {
        throw new Error("Please enter a valid bid amount");
      }

      if (!walletAddress) {
        const connected = await connectWallet();
        if (!connected) return;
      }

      // Check minimum bid (highest current bid + minimum increment, or starting price if no bids)
      const highestBidEth = parseFloat(ethers.formatEther(highestBid));
      const minIncrementEth = parseFloat(ethers.formatEther(minIncrement));
      const startingPrice = parseFloat(frontendAuction.startingPrice || 0);
      const minBid = highestBidEth > 0 ? highestBidEth + minIncrementEth : startingPrice;

      console.log("Bid validation:");
      console.log("  highestBidEth:", highestBidEth);
      console.log("  minIncrementEth:", minIncrementEth);
      console.log("  startingPrice:", startingPrice);
      console.log("  required minBid:", minBid);
      console.log("  userBidAmount:", parseFloat(bidAmount));

      if (parseFloat(bidAmount) < minBid) {
        throw new Error(`Your bid ($${parseFloat(bidAmount).toFixed(2)}) is below minimum ($${minBid.toFixed(2)}). Current bid: $${highestBidEth.toFixed(2)} + increment: $${minIncrementEth.toFixed(2)}`);
      }

      // Check max bid if set
      if (maxBid && maxBid > 0n) {
        const maxBidEth = parseFloat(ethers.formatEther(maxBid));
        if (parseFloat(bidAmount) > maxBidEth) {
          throw new Error(`Your bid ($${parseFloat(bidAmount).toFixed(2)}) exceeds maximum allowed ($${maxBidEth.toFixed(2)})`);
        }
      }

      setSuccess("Confirming bid in MetaMask...");

      // Send bid transaction to blockchain
      const value = ethers.parseEther(bidAmount.toString());
      
      console.log("Sending bid transaction:");
      console.log("  auctionId:", blockchainAuctionId.toString());
      console.log("  bidAmount (ETH):", bidAmount);
      console.log("  value (wei):", value.toString());
      
      let tx;
      try {
        tx = await contract.bid(blockchainAuctionId, { value });
        console.log("Bid transaction sent, hash:", tx.hash);
      } catch (err) {
        console.error("Bid transaction failed:", err);
        console.error("Full error object:", JSON.stringify(err, null, 2));
        
        // Try to extract revert reason from the error
        let revertMsg = "Transaction reverted on smart contract";
        if (err?.reason) {
          revertMsg = err.reason;
        } else if (err?.message) {
          if (err.message.includes("reverted")) {
            revertMsg = "Smart contract rejected the bid. Check console logs for auction state.";
          } else {
            revertMsg = err.message;
          }
        }

        // Don't retry - if it reverted, retrying won't help
        throw new Error(
          `Blockchain bid failed: ${revertMsg}\n\nCheck browser console (F12) for detailed auction state logs above.`
        );
      }

      setSuccess("Bid submitted! Waiting for blockchain confirmation...");
      
      // CRITICAL: Wait for transaction to be mined - DO NOT proceed until receipt is received
      const receipt = await tx.wait();
      
      // Verify transaction was actually mined and successful
      if (!receipt) {
        throw new Error("Bid transaction was not confirmed (receipt is null). Your bid may have failed or was rejected.");
      }
      
      if (receipt.status === 0) {
        throw new Error("Bid transaction failed on blockchain (status = 0). Check contract revert reason in console logs.");
      }
      
      console.log("✅ Bid confirmed in block:", receipt.blockNumber, "Tx hash:", receipt.transactionHash);

      // Save bid to backend with confirmed blockchain data
      const bidData = {
        auctionId: selectedAuctionId,
        bidderWalletAddress: walletAddress,
        bidAmount: parseFloat(bidAmount),
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      };

      console.log("Saving bid to backend:", bidData);
      
      const backendResponse = await fetch("http://localhost:8080/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
          "X-User-ID": user.id,
        },
        body: JSON.stringify(bidData),
      });

      if (!backendResponse.ok) {
        console.warn("Bid saved on blockchain but failed to save backend metadata");
      }

      setSuccess("✅ Bid placed successfully!");
      setBidAmount("");
      setSelectedAuctionId(null);

      // Refresh auctions
      await fetchActiveAuctions();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to place bid");
      console.error("Bid error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format time remaining
   */
  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="bidder-dashboard-container">
      <div className="bidder-dashboard-header">
        <h1>🛒 Bidder Dashboard</h1>
        <p>Browse and bid on active auctions</p>
      </div>

      {/* Error & Success Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Wallet Connection Status */}
      <div className="wallet-status-section">
        {walletAddress ? (
          <div className="wallet-connected">
            ✓ Wallet Connected: {walletAddress.substring(0, 10)}...{walletAddress.substring(35)}
          </div>
        ) : (
          <button onClick={connectWallet} className="btn-connect-wallet">
            🔗 Connect MetaMask Wallet
          </button>
        )}
      </div>

      {/* Active Auctions Grid */}
      <div className="auctions-section">
        <h2>Active Auctions</h2>
        
        {loading ? (
          <div className="loading">Loading auctions...</div>
        ) : auctions.length === 0 ? (
          <div className="no-auctions">No active auctions available</div>
        ) : (
          <div className="auctions-grid">
            {auctions.map((auction) => {
              const isSelected = selectedAuctionId === auction.id;
              const timeRemaining = getTimeRemaining(auction.endTime);
              const minNextBid =
                Math.max(
                  parseFloat(auction.currentHighestBid || auction.startingPrice) +
                  parseFloat(auction.minIncrement),
                  parseFloat(auction.startingPrice)
                ).toFixed(2);

              return (
                <div
                  key={auction.id}
                  className={`auction-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedAuctionId(isSelected ? null : auction.id)}
                >
                  {/* Auction Image */}
                  <div className="auction-image">
                    <img
                      src={auction.imageCID || auction.imageUrl || "https://via.placeholder.com/200x200?text=No+Image"}
                      alt={auction.itemName}
                      onError={(e) => {
                        console.warn("Image failed to load:", auction.imageCID || auction.imageUrl);
                        e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
                      }}
                      onLoad={() => console.log("Image loaded:", auction.itemName)}
                    />
                    <div className="time-badge">{timeRemaining}</div>
                  </div>

                  {/* Auction Details */}
                  <div className="auction-details">
                    <h3>{auction.itemName}</h3>
                    <p className="description">{auction.description.substring(0, 50)}...</p>

                    <div className="bid-info">
                      <div className="bid-row">
                        <span>Starting Price:</span>
                        <strong>${auction.startingPrice}</strong>
                      </div>
                      <div className="bid-row">
                        <span>Current Highest:</span>
                        <strong>${auction.currentHighestBid || auction.startingPrice}</strong>
                      </div>
                      <div className="bid-row">
                        <span>Min Next Bid:</span>
                        <strong>${minNextBid}</strong>
                      </div>
                      <div className="bid-row">
                        <span>Seller:</span>
                        <span>{auction.sellerUsername}</span>
                      </div>
                    </div>

                    {/* Bid Input (shown when selected) */}
                    {isSelected && (
                      <div className="bid-input-section">
                        <input
                          type="number"
                          placeholder={`Min: $${minNextBid}`}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          step="0.01"
                          min={minNextBid}
                          className="bid-input"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            placeBid();
                          }}
                          disabled={loading || !walletAddress}
                          className="btn-place-bid"
                        >
                          {loading ? "Placing..." : "Place Bid"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Links to Profile and Dashboard */}
      <div className="dashboard-links">
        <button onClick={() => navigate("/profile")} className="btn-secondary">
          👤 My Profile (NFTs)
        </button>
        <button onClick={() => navigate("/bidders-info")} className="btn-secondary">
          🏆 My Auction Victories & Bids
        </button>
      </div>
    </div>
  );
};

export default BidderDashboard;
