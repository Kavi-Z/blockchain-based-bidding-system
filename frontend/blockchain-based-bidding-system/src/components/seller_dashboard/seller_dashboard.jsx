import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SecureAuction from "./SecureAuction.json";

export default function SellerDashboard() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  const [biddingTime, setBiddingTime] = useState("");
  const [minIncrement, setMinIncrement] = useState("");
  const [extensionTime, setExtensionTime] = useState("");
  const [maxBid, setMaxBid] = useState("");

  const [highestBid, setHighestBid] = useState("0");
  const [highestBidder, setHighestBidder] = useState("None");
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [endTime, setEndTime] = useState(null);

  const CONTRACT_ADDRESS = "0x81efbcf260A84402cAF089f9cDDB77Ea888A8181";

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Please install MetaMask!");
      const web3Instance = new Web3(window.ethereum);
      window.web3 = web3Instance;   
      window.Web3 = Web3;
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const userAccounts = await web3Instance.eth.getAccounts();
      const contractInstance = new web3Instance.eth.Contract(
        SecureAuction.abi,
        CONTRACT_ADDRESS
      );

      setWeb3(web3Instance);
      setAccounts(userAccounts);
      setContract(contractInstance);
 
      const auctionStartedOnChain = await contractInstance.methods.auctionStarted().call();
      setAuctionStarted(auctionStartedOnChain);

      const endedOnChain = await contractInstance.methods.ended().call();
      setAuctionEnded(endedOnChain);

      const highestBidOnChain = await contractInstance.methods.highestBid().call();
      setHighestBid(web3Instance.utils.fromWei(highestBidOnChain, "ether"));

      const highestBidderOnChain = await contractInstance.methods.highestBidder().call();
      setHighestBidder(highestBidderOnChain || "None");

      const endTimeOnChain = await contractInstance.methods.endTime().call();
      setEndTime(Number(endTimeOnChain));

      // Real-time updates
      contractInstance.events.HighestBidIncreased({}, (err, event) => {
        if (!err) {
          setHighestBid(web3Instance.utils.fromWei(event.returnValues.amount, "ether"));
          setHighestBidder(event.returnValues.bidder);
        }
      });
      contractInstance.events.AuctionEnded({}, (err) => {
        if (!err) setAuctionEnded(true);
      });
    };
    init();
  }, []);

  const startAuctionOnChain = async () => {
    if (!contract) return;
    if (!biddingTime) return alert("Enter bidding time");

    try {
const bidTime = biddingTime ? Number(biddingTime) : 300;
const extension = extensionTime ? Number(extensionTime) : 60;
const increment = minIncrement ? web3.utils.toWei(minIncrement, "ether") : web3.utils.toWei("0.01", "ether");
const max = maxBid ? web3.utils.toWei(maxBid, "ether") : web3.utils.toWei("1", "ether");

      await contract.methods
        .startAuction(bidTime, increment, extension, max)
        .send({
          from: accounts[0],
          gas: 3000000,
          gasPrice: await web3.eth.getGasPrice() 
        });

      const endTimeOnChain = await contract.methods.endTime().call();
      setEndTime(Number(endTimeOnChain));

      setAuctionStarted(true);
      setAuctionEnded(false);
      alert("Auction started on blockchain!");
    } catch (err) {
      console.error(err);
      if (err.code === 4001) alert("Transaction rejected by user.");
      else alert("Error starting auction. Check console.");
    }
  };

  const endAuctionOnChain = async () => {
    if (!contract) return;
    try {
      await contract.methods.endAuction().send({
  from: accounts[0],
  gas: 3000000,
  gasPrice: await web3.eth.getGasPrice()  
});
      setAuctionEnded(true);
      alert("Auction ended on blockchain!");
    } catch (err) {
      console.error(err);
      alert("Error ending auction.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Seller Dashboard</h1>

      <h2>Start Auction</h2>
      <input
        placeholder="Bidding Time (seconds)"
        value={biddingTime}
        onChange={(e) => setBiddingTime(e.target.value)}
      />
      <input
        placeholder="Min Increment (ETH)"
        value={minIncrement}
        onChange={(e) => setMinIncrement(e.target.value)}
      />
      <input
        placeholder="Extension Time (seconds)"
        value={extensionTime}
        onChange={(e) => setExtensionTime(e.target.value)}
      />
      <input
        placeholder="Max Bid (ETH)"
        value={maxBid}
        onChange={(e) => setMaxBid(e.target.value)}
      />
      <button onClick={startAuctionOnChain} disabled={auctionStarted && !auctionEnded}>
        Start Auction
      </button>

      <h2>Auction Status</h2>
      <p>Highest Bid: {highestBid} ETH</p>
      <p>Highest Bidder: {highestBidder}</p>
      <p>Auction Ended: {auctionEnded ? "Yes" : "No"}</p>
      <p>
        Auction End Time: {endTime ? new Date(endTime * 1000).toLocaleString() : "Not started"}
      </p>

      <button onClick={endAuctionOnChain} disabled={!auctionStarted || auctionEnded}>
        End Auction
      </button>
    </div>
  );
}
