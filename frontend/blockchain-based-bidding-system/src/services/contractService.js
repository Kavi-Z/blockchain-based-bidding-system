import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../config/env";

export const SEPOLIA_CHAIN_ID = 11155111;

export const getConfiguredContractAddress = () => CONTRACT_ADDRESS;

export const getNetworkContractAddress = (chainId, artifact) => {
  if (!chainId || !artifact || !artifact.networks) return null;
  return artifact.networks[String(chainId)]?.address || null;
};

export const resolveContractAddress = async (artifact) => {
  const configuredAddress = getConfiguredContractAddress();
  if (configuredAddress) return configuredAddress;

  if (!artifact || typeof window === "undefined" || !window.ethereum) {
    return null;
  }

  try {
    const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
    if (!chainIdHex) return null;

    const chainId = parseInt(chainIdHex, 16);
    return getNetworkContractAddress(chainId, artifact);
  } catch (err) {
    console.warn("Could not resolve contract address from network:", err);
    return null;
  }
};

// Matches SecureAuction.sol: highestBid + minIncrement (first bid needs minIncrement)
export const getRequiredBidWei = (highestBid, minIncrement) =>
  BigInt(highestBid) + BigInt(minIncrement);

export const formatEthAmount = (wei) => {
  try {
    return ethers.formatEther(wei);
  } catch {
    return "0";
  }
};

export const decodeContractError = (error) => {
  if (error?.reason) return error.reason;

  const message = error?.message || String(error);
  
  // Check for insufficient funds FIRST
  if (message.includes("OutOfFunds") || message.includes("insufficient funds") || message.includes("out of funds")) {
    return "Insufficient balance: Your wallet doesn't have enough ETH for this bid. Please add more ETH to your wallet and try again.";
  }
  
  // Enhanced revert reason detection
  if (message.includes("Bid below min increment")) {
    return "Bid is too low. First bid must be at least the min increment (in ETH). Later bids must be current highest + min increment.";
  }
  if (message.includes("Seller cannot bid")) {
    return "You cannot bid on your own auction.";
  }
  if (message.includes("Auction ended") || message.includes("Not started")) {
    return "This auction is not currently active. Check the auction start/end times on-chain.";
  }
  if (message.includes("Already ended")) {
    return "This auction has already ended.";
  }
  if (message.includes("Above maxBid")) {
    return "Bid exceeds the maximum allowed for this auction.";
  }
  if (message.includes("missing revert data") || message.includes("CALL_EXCEPTION")) {
    return "Contract call failed without revert message. Common causes: (1) Wrong auction ID on blockchain, (2) Auction doesn't exist, (3) Network/RPC timeout, (4) Auction state changed. Check console logs and try again.";
  }
  return message;
};

export const getWalletBalance = async (address) => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not detected");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    return balance;
  } catch (err) {
    console.error("Error fetching wallet balance:", err);
    return null;
  }
};

export const decodeRevertFromCall = async (provider, populated) => {
  try {
    const result = await provider.call(populated);
    if (result && result !== "0x") {
      // Standard Error() encoding: 0x08c379a0 + length + data
      if (result.startsWith("0x08c379a0")) {
        const utf8Hex = "0x" + result.slice(138);
        try {
          return ethers.toUtf8String(utf8Hex);
        } catch {
          return result;
        }
      }
      return result;
    }
  } catch (e) {
    console.warn("Could not decode revert from call:", e.message);
  }
  return null;
};

export const ensureSepoliaNetwork = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected");
  }

  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
  const chainId = parseInt(chainIdHex, 16);

  if (chainId === SEPOLIA_CHAIN_ID) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
    });
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
            chainName: "Sepolia",
            nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://sepolia.infura.io/v3/"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
      return;
    }
    throw error;
  }
};
