import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SecureAuction from "./SecureAuction.json";
import loginBg from "../../assets/login.png";


export default function BiddersDashboard() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [highestBid, setHighestBid] = useState("0");
  const [highestBidder, setHighestBidder] = useState("None");
  const [endTime, setEndTime] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [showConnectionInfo, setShowConnectionInfo] = useState(false);
  
  
  const [currentAuction, setCurrentAuction] = useState(null);
  const [myBids, setMyBids] = useState([]);
  const [isWinning, setIsWinning] = useState(false);

  const CONTRACT_ADDRESS = "0xc3662276B3594bD8d70778b093caC2F31E6D497E";

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();

        setAccount(accounts[0]);
        setWeb3(web3Instance);

        const contractInstance = new web3Instance.eth.Contract(
          SecureAuction.abi,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);

        await loadAuction(contractInstance, web3Instance, accounts[0]);
        setupEvents(contractInstance, web3Instance);
        
        // Load auction data from backend
        await fetchCurrentAuction();
        await fetchMyBids(accounts[0]);
      } catch (err) {
        console.error("Web3 initialization error:", err);
        alert("Failed to connect wallet: " + err.message);
      }
    };

    init();
  }, []);

  // Fetch current auction from Spring Boot backend
  const fetchCurrentAuction = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auctions/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentAuction(data);
      }
    } catch (error) {
      console.error("Error fetching auction:", error);
    }
  };

  // Fetch my bids from backend
  const fetchMyBids = async (walletAddress) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bids/user/${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setMyBids(data);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  // Load auction state from blockchain
  const loadAuction = async (contractInstance, web3Instance, userAccount) => {
    try {
      const started = await contractInstance.methods.auctionStarted().call();
      const ended = await contractInstance.methods.ended().call();
      const bid = await contractInstance.methods.highestBid().call();
      const bidder = await contractInstance.methods.highestBidder().call();
      const end = await contractInstance.methods.endTime().call();

      setAuctionStarted(started);
      setAuctionEnded(ended);
      setHighestBid(web3Instance.utils.fromWei(bid.toString(), "ether"));
      
      const bidderAddress = bidder !== "0x0000000000000000000000000000000000000000" ? bidder : "None";
      setHighestBidder(bidderAddress);
      setEndTime(Number(end));
      
      // Check if current user is winning
      if (userAccount && bidderAddress.toLowerCase() === userAccount.toLowerCase()) {
        setIsWinning(true);
      } else {
        setIsWinning(false);
      }
    } catch (err) {
      console.error("Error loading auction:", err);
    }
  };

  // Event listeners
  const setupEvents = (contractInstance, web3Instance) => {
    contractInstance.events.HighestBidIncreased({})
      .on("data", (event) => {
        setHighestBid(web3Instance.utils.fromWei(event.returnValues.amount, "ether"));
        setHighestBidder(event.returnValues.bidder);
        
        // Check if current user is the new highest bidder
        if (account && event.returnValues.bidder.toLowerCase() === account.toLowerCase()) {
          setIsWinning(true);
        } else {
          setIsWinning(false);
        }
        
        // Reload bids from backend
        fetchMyBids(account);
      })
      .on("error", (err) => console.error("Event error:", err));

    contractInstance.events.AuctionEnded({})
      .on("data", () => {
        setAuctionEnded(true);
        setAuctionStarted(false);
        
        // Reload auction data
        fetchCurrentAuction();
      })
      .on("error", (err) => console.error("Event error:", err));
  };

  // Place a bid
  const placeBid = async (e) => {
    e.preventDefault();
    
    if (!web3 || !contract) {
      alert("Web3 or contract not loaded yet!");
      return;
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      alert("Enter a valid bid amount");
      return;
    }

    try {
      const value = web3.utils.toWei(bidAmount.toString(), "ether");

      // Send transaction to blockchain
      const receipt = await contract.methods.bid().send({
        from: account,
        value,
      });

      console.log("Bid transaction:", receipt);

      // Save bid to backend
      await saveBidToBackend({
        walletAddress: account,
        auctionId: currentAuction?.id,
        bidAmount: bidAmount,
        transactionHash: receipt.transactionHash,
        timestamp: new Date().toISOString()
      });

      setBidAmount("");
      alert("✅ Bid placed successfully!");
      
      // Reload data
      await loadAuction(contract, web3, account);
      await fetchMyBids(account);
      
    } catch (err) {
      console.error("Bid error:", err);
      if (err.code === 4001) {
        alert("❌ Transaction rejected by user");
      } else {
        alert("❌ Failed to place bid: " + err.message);
      }
    }
  };

  // Save bid to Spring Boot backend
  const saveBidToBackend = async (bidData) => {
    try {
      const response = await fetch('http://localhost:8080/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bidData)
      });

      if (!response.ok) {
        console.error("Failed to save bid to backend");
      }
    } catch (error) {
      console.error("Error saving bid:", error);
    }
  };

  const refreshData = async () => {
    if (contract && web3) {
      await loadAuction(contract, web3, account);
      await fetchCurrentAuction();
      await fetchMyBids(account);
      alert("✅ Data refreshed!");
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
            <span className="upload-main-text">🛒 Bidders Dashboard</span>
          </div>

          {/* Connection Info - Collapsible */}
          <div className="form-group">
            <button
              type="button"
              onClick={() => setShowConnectionInfo(!showConnectionInfo)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>📊 Connection Information</span>
              <span>{showConnectionInfo ? "▼" : "▶"}</span>
            </button>

            {showConnectionInfo && (
              <div style={{
                padding: "15px",
                backgroundColor: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "10px",
                fontSize: "13px",
                lineHeight: "1.8"
              }}>
                <div><strong>Your Wallet:</strong> {account ? `${account.substring(0, 10)}...${account.substring(account.length - 8)}` : "Not connected"}</div>
                <div><strong>Contract:</strong> {CONTRACT_ADDRESS.substring(0, 10)}...{CONTRACT_ADDRESS.substring(CONTRACT_ADDRESS.length - 8)}</div>
                <div><strong>Status:</strong> {web3 ? "✅ Connected" : "❌ Not Connected"}</div>
                <button 
                  onClick={refreshData}
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  🔄 Refresh Data
                </button>
              </div>
            )}
          </div>

          {/* Current Auction NFT Display */}
          {currentAuction && (
            <div className="form-group" style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "20px"
            }}>
              <label className="form-label" style={{ fontSize: "16px", marginBottom: "15px" }}>
                🎨 Current Auction NFT
              </label>
              
              {/* NFT Image */}
              <div style={{
                width: "100%",
                height: "300px",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "15px",
                backgroundColor: "#000"
              }}>
                <img 
                  src={currentAuction.imageUrl || "https://via.placeholder.com/400x400?text=NFT"} 
                  alt={currentAuction.itemName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>

              <div style={{ fontSize: "14px", lineHeight: "2" }}>
                <div><strong>Item Name:</strong> {currentAuction.itemName}</div>
                <div><strong>Owner:</strong> {currentAuction.ownerAddress ? `${currentAuction.ownerAddress.substring(0, 10)}...${currentAuction.ownerAddress.substring(currentAuction.ownerAddress.length - 8)}` : "Unknown"}</div>
              </div>
            </div>
          )}

          {/* Auction Status */}
          <div className="form-group" style={{
            padding: "20px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            <label className="form-label" style={{ fontSize: "16px", marginBottom: "15px" }}>
              📊 Auction Status
            </label>
            <div style={{ fontSize: "14px", lineHeight: "2" }}>
              <div>
                <strong>Status:</strong>{" "}
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "4px",
                  backgroundColor: auctionStarted ? "#4CAF50" : auctionEnded ? "#f44336" : "#999",
                  color: "white",
                  fontSize: "13px",
                  marginLeft: "8px"
                }}>
                  {auctionStarted ? "🟢 Running" : auctionEnded ? "🔴 Ended" : "⚪ Not Started"}
                </span>
              </div>
              <div><strong>Highest Bid:</strong> {highestBid} ETH</div>
              <div>
                <strong>Highest Bidder:</strong>{" "}
                {highestBidder !== "None" 
                  ? `${highestBidder.substring(0, 10)}...${highestBidder.substring(highestBidder.length - 8)}`
                  : "None"}
                {isWinning && (
                  <span style={{
                    marginLeft: "10px",
                    padding: "2px 8px",
                    backgroundColor: "#FFD700",
                    color: "#000",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    👑 You're Winning!
                  </span>
                )}
              </div>
              <div>
                <strong>End Time:</strong>{" "}
                {endTime ? new Date(endTime * 1000).toLocaleString() : "N/A"}
              </div>
            </div>
          </div>

          {/* Place Bid Form */}
          <form className="upload-form" onSubmit={placeBid}>
            <div className="form-group">
              <label className="form-label">💰 Place Your Bid</label>
              <input
                type="number"
                step="0.001"
                placeholder="Enter bid amount in ETH (e.g., 0.015)"
                className="form-input"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min="0"
                disabled={!auctionStarted || auctionEnded}
              />
              <div style={{ 
                fontSize: "12px", 
                color: "#666", 
                marginTop: "8px",
                fontStyle: "italic"
              }}>
                Minimum bid: {highestBid !== "0" ? `${(parseFloat(highestBid) + 0.001).toFixed(3)} ETH` : "0.015 ETH"}
              </div>
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="create-auction-btn"
                disabled={!web3 || !contract || !auctionStarted || auctionEnded}
                style={{
                  backgroundColor: (!web3 || !contract || !auctionStarted || auctionEnded) ? "#ccc" : "#4CAF50",
                  cursor: (!web3 || !contract || !auctionStarted || auctionEnded) ? "not-allowed" : "pointer",
                }}
              >
                {auctionEnded ? "Auction Ended" : !auctionStarted ? "Auction Not Started" : "Place Bid"}
              </button>
            </div>
          </form>

          {/* My Bids History */}
          {myBids.length > 0 && (
            <div className="form-group" style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "8px"
            }}>
              <label className="form-label" style={{ fontSize: "16px", marginBottom: "15px" }}>
                📜 My Bid History
              </label>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {myBids.map((bid, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: "10px",
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      marginBottom: "8px",
                      fontSize: "13px",
                      border: "1px solid #e0e0e0"
                    }}
                  >
                    <div><strong>Amount:</strong> {bid.bidAmount} ETH</div>
                    <div><strong>Time:</strong> {new Date(bid.timestamp).toLocaleString()}</div>
                    {bid.transactionHash && (
                      <div style={{ fontSize: "11px", color: "#666" }}>
                        <strong>TX:</strong> {bid.transactionHash.substring(0, 20)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}