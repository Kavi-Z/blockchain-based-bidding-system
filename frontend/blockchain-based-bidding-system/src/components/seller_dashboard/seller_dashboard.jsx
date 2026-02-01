import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SecureAuction from "./SecureAuction.json";

export default function SellerDashboard() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [contractExists, setContractExists] = useState(false);

  const [biddingTime, setBiddingTime] = useState("");
  const [minIncrement, setMinIncrement] = useState("");
  const [extensionTime, setExtensionTime] = useState("");
  const [maxBid, setMaxBid] = useState("");

  const [highestBid, setHighestBid] = useState("0");
  const [highestBidder, setHighestBidder] = useState("None");
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [seller, setSeller] = useState("");
  const [error, setError] = useState("");

  // IMPORTANT: Replace this with your actual deployed contract address
  const CONTRACT_ADDRESS = "0x931CEaac29d98976FBF165b919A572101E93E6E1";

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        setError("Please install MetaMask!");
        return;
      }

      try {
        const web3Instance = new Web3(window.ethereum);
        
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const userAccounts = await web3Instance.eth.getAccounts();
        
        // Check network
        const network = await web3Instance.eth.net.getId();
        const chainId = await web3Instance.eth.getChainId();
        console.log("Connected to network ID:", network, "Chain ID:", chainId);
        setNetworkId(network);

        // CRITICAL: Verify contract exists
        const code = await web3Instance.eth.getCode(CONTRACT_ADDRESS);
        console.log("Contract code length:", code.length);
        
        if (code === "0x" || code.length <= 2) {
          setError(
            `❌ No contract found at ${CONTRACT_ADDRESS} on network ${network}. ` +
            "Please verify: 1) Correct network selected in MetaMask, " +
            "2) Contract is deployed, 3) Correct contract address"
          );
          setContractExists(false);
          return;
        }

        console.log("✅ Contract exists at address");
        setContractExists(true);

        // Create contract instance
        const contractInstance = new web3Instance.eth.Contract(
          SecureAuction.abi,
          CONTRACT_ADDRESS
        );

        setWeb3(web3Instance);
        setAccounts(userAccounts);
        setContract(contractInstance);

        // Load initial state with comprehensive error handling
        await loadAuctionState(contractInstance, web3Instance);

        // Setup event listeners
        setupEventListeners(contractInstance, web3Instance);

      } catch (error) {
        console.error("Initialization error:", error);
        setError(`Initialization failed: ${error.message}`);
      }
    };

    init();
  }, []);

  const loadAuctionState = async (contractInstance, web3Instance) => {
    try {
      // Step 1: Get seller address (this should ALWAYS work if contract is deployed)
      let sellerAddress = "";
      try {
        sellerAddress = await contractInstance.methods.seller().call();
        setSeller(sellerAddress);
        console.log("Seller:", sellerAddress);
      } catch (e) {
        console.error("❌ CRITICAL: Cannot read seller() - ABI mismatch likely!");
        console.error("Error details:", e);
        setError("ABI mismatch detected! The SecureAuction.json ABI doesn't match the deployed contract.");
        return;
      }

      // Step 2: Get auction status flags
      let started = false;
      let ended = false;

      try {
        started = await contractInstance.methods.auctionStarted().call();
        console.log("Auction started:", started);
      } catch (e) {
        console.error("Error reading auctionStarted:", e.message);
        // Don't return, continue with defaults
      }

      try {
        ended = await contractInstance.methods.ended().call();
        console.log("Auction ended:", ended);
      } catch (e) {
        console.error("Error reading ended:", e.message);
      }

      setAuctionStarted(started);
      setAuctionEnded(ended);

      // Step 3: Only read bid data if auction has been started
      if (started || ended) {
        try {
          const bid = await contractInstance.methods.highestBid().call();
          const bidder = await contractInstance.methods.highestBidder().call();
          const end = await contractInstance.methods.endTime().call();

          setHighestBid(
            bid && bid !== "0" 
              ? web3Instance.utils.fromWei(bid.toString(), "ether") 
              : "0"
          );
          
          setHighestBidder(
            bidder && bidder !== "0x0000000000000000000000000000000000000000"
              ? bidder
              : "None"
          );
          
          setEndTime(end ? Number(end) : 0);

          console.log("Loaded auction data:", { bid, bidder, end });
        } catch (e) {
          console.error("Error loading auction data:", e.message);
          // Set safe defaults
          setHighestBid("0");
          setHighestBidder("None");
          setEndTime(0);
        }
      } else {
        // Auction not started - set defaults
        setHighestBid("0");
        setHighestBidder("None");
        setEndTime(0);
        console.log("Auction not started yet - using default values");
      }

    } catch (error) {
      console.error("Error loading auction state:", error);
      setError(`Failed to load auction state: ${error.message}`);
    }
  };

  const setupEventListeners = (contractInstance, web3Instance) => {
    try {
      contractInstance.events.HighestBidIncreased({})
        .on('data', (event) => {
          if (event?.returnValues) {
            setHighestBid(
              web3Instance.utils.fromWei(event.returnValues.amount, "ether")
            );
            setHighestBidder(event.returnValues.bidder);
            console.log("Bid increased event:", event.returnValues);
          }
        })
        .on('error', (error) => {
          console.error("Event error:", error);
        });

      contractInstance.events.AuctionEnded({})
        .on('data', (event) => {
          setAuctionEnded(true);
          setAuctionStarted(false);
          console.log("Auction ended event:", event);
        })
        .on('error', (error) => {
          console.error("Event error:", error);
        });

    } catch (error) {
      console.error("Error setting up events:", error);
    }
  };

  const startAuctionOnChain = async () => {
    if (!contract) {
      alert("Contract not loaded");
      return;
    }

    if (!biddingTime || !minIncrement || !extensionTime) {
      alert("Please fill in all required fields (Bidding Time, Min Increment, Extension Time)");
      return;
    }

    try {
      // ✅ FIX: Convert to strings to avoid BigInt mixing error
      const bidTime = biddingTime.toString();
      const extension = extensionTime.toString();
      
      // Validate values
      if (parseFloat(bidTime) <= 0 || parseFloat(extension) < 0) {
        alert("Invalid time values");
        return;
      }

      const increment = web3.utils.toWei(minIncrement.toString(), "ether");
      const max = maxBid && parseFloat(maxBid) > 0 
        ? web3.utils.toWei(maxBid.toString(), "ether") 
        : "0";

      console.log("Starting auction with:", { bidTime, increment, extension, max });

      // Estimate gas first
      const gasEstimate = await contract.methods
        .startAuction(bidTime, increment, extension, max)
        .estimateGas({ from: accounts[0] });

      console.log("Estimated gas:", gasEstimate);

      const receipt = await contract.methods
        .startAuction(bidTime, increment, extension, max)
        .send({
          from: accounts[0],
          gas: Math.floor(Number(gasEstimate) * 1.2), // Add 20% buffer, convert BigInt to Number
        });

      console.log("Transaction receipt:", receipt);

      // Reload state
      await loadAuctionState(contract, web3);

      alert("✅ Auction started successfully!");
      
      // Clear form
      setBiddingTime("");
      setMinIncrement("");
      setExtensionTime("");
      setMaxBid("");

    } catch (err) {
      console.error("Error starting auction:", err);
      
      if (err.code === 4001) {
        alert("Transaction rejected by user");
      } else if (err.message.includes("Auction already started")) {
        alert("Auction is already running");
      } else if (err.message.includes("Only seller")) {
        alert("Only the seller can start the auction");
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const endAuctionOnChain = async () => {
    if (!contract) {
      alert("Contract not loaded");
      return;
    }

    try {
      // Check if enough time has passed
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (endTime && currentTime < endTime) {
        alert(
          `Auction cannot be ended yet. Please wait until ${new Date(
            endTime * 1000
          ).toLocaleString()}`
        );
        return;
      }

      const gasEstimate = await contract.methods
        .endAuction()
        .estimateGas({ from: accounts[0] });

      const receipt = await contract.methods.endAuction().send({
        from: accounts[0],
        gas: Math.floor(Number(gasEstimate) * 1.2), // Convert BigInt to Number
      });

      console.log("Auction ended:", receipt);

      // Reload state
      await loadAuctionState(contract, web3);

      alert("✅ Auction ended successfully!");

    } catch (err) {
      console.error("Error ending auction:", err);
      
      if (err.code === 4001) {
        alert("Transaction rejected by user");
      } else if (err.message.includes("Auction not yet ended")) {
        alert("Auction time has not elapsed yet");
      } else if (err.message.includes("Only seller")) {
        alert("Only the seller can end the auction");
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const refreshState = async () => {
    if (contract && web3) {
      await loadAuctionState(contract, web3);
      alert("State refreshed!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1>🔨 Seller Dashboard</h1>

      {error && (
        <div style={{
          padding: "15px",
          backgroundColor: "#fee",
          border: "1px solid #fcc",
          borderRadius: "5px",
          marginBottom: "20px",
          color: "#c00"
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      <div style={{
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "5px",
        marginBottom: "20px",
        fontSize: "13px"
      }}>
        <strong>Connection Info:</strong><br/>
        Network ID: {networkId || "Not connected"}<br/>
        Your Account: {accounts[0] || "Not connected"}<br/>
        Contract: {CONTRACT_ADDRESS}<br/>
        Contract Exists: {contractExists ? "✅ Yes" : "❌ No"}<br/>
        Seller: {seller || "Unknown"}
        <button 
          onClick={refreshState}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            fontSize: "12px"
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "#fafafa"
      }}>
        <h2>Start New Auction</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="number"
            placeholder="Bidding Time (seconds) *"
            value={biddingTime}
            onChange={(e) => setBiddingTime(e.target.value)}
            style={{ padding: "10px", fontSize: "14px" }}
          />
          <input
            type="number"
            step="0.001"
            placeholder="Min Increment (ETH) *"
            value={minIncrement}
            onChange={(e) => setMinIncrement(e.target.value)}
            style={{ padding: "10px", fontSize: "14px" }}
          />
          <input
            type="number"
            placeholder="Extension Time (seconds) *"
            value={extensionTime}
            onChange={(e) => setExtensionTime(e.target.value)}
            style={{ padding: "10px", fontSize: "14px" }}
          />
          <input
            type="number"
            step="0.001"
            placeholder="Max Bid (ETH) - Optional"
            value={maxBid}
            onChange={(e) => setMaxBid(e.target.value)}
            style={{ padding: "10px", fontSize: "14px" }}
          />
          <button
            onClick={startAuctionOnChain}
            disabled={!contractExists || (auctionStarted && !auctionEnded)}
            style={{
              padding: "12px",
              fontSize: "16px",
              backgroundColor: (!contractExists || (auctionStarted && !auctionEnded)) ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: (!contractExists || (auctionStarted && !auctionEnded)) ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            {auctionStarted && !auctionEnded ? "Auction Already Running" : "Start Auction"}
          </button>
        </div>
      </div>

      <div style={{
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "20px",
        backgroundColor: "#fafafa"
      }}>
        <h2>📊 Current Auction Status</h2>
        <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
          <p>
            <strong>Status:</strong>{" "}
            <span style={{
              padding: "3px 8px",
              borderRadius: "3px",
              backgroundColor: auctionStarted ? "#4CAF50" : auctionEnded ? "#f44336" : "#999",
              color: "white",
              fontSize: "14px"
            }}>
              {auctionStarted ? "🟢 Running" : auctionEnded ? "🔴 Ended" : "⚪ Not Started"}
            </span>
          </p>
          <p><strong>Highest Bid:</strong> {highestBid} ETH</p>
          <p><strong>Highest Bidder:</strong> {highestBidder}</p>
          <p>
            <strong>End Time:</strong>{" "}
            {endTime && endTime > 0
              ? new Date(endTime * 1000).toLocaleString()
              : "Not started"}
          </p>
        </div>

        <button
          onClick={endAuctionOnChain}
          disabled={!contractExists || !auctionStarted || auctionEnded}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: (!contractExists || !auctionStarted || auctionEnded) ? "#ccc" : "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: (!contractExists || !auctionStarted || auctionEnded) ? "not-allowed" : "pointer",
            marginTop: "15px",
            fontWeight: "bold"
          }}
        >
          End Auction
        </button>
      </div>
    </div>
  );
}