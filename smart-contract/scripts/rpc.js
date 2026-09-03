require("dotenv").config();
const { ethers } = require("ethers");

function getRpcUrls() {
  const urls = [];

  if (process.env.INFURA_PROJECT_ID) {
    urls.push(
      process.env.INFURA_PROJECT_ID.startsWith("http")
        ? process.env.INFURA_PROJECT_ID
        : `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    );
  }

  if (process.env.SEPOLIA_RPC_URL) {
    urls.push(process.env.SEPOLIA_RPC_URL);
  }

  urls.push(
    "https://ethereum-sepolia.publicnode.com",
    "https://1rpc.io/sepolia"
  );

  return [...new Set(urls)];
}

function createProvider(url) {
  return new ethers.JsonRpcProvider(url, 11155111, { staticNetwork: true });
}

async function getReadProvider() {
  let lastError;

  for (const url of getRpcUrls()) {
    try {
      const provider = createProvider(url);
      await provider.getBlockNumber();
      return { provider, url };
    } catch (error) {
      lastError = error;
      console.log("RPC read failed:", url, "-", error.message);
    }
  }

  throw lastError || new Error("No working Sepolia RPC endpoint found");
}

module.exports = {
  getRpcUrls,
  createProvider,
  getReadProvider,
};
