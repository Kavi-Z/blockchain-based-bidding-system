require("dotenv").config();
const { ethers } = require("ethers");
const { getReadProvider } = require("./rpc");

function resolvePrivateKey() {
  const key = (process.env.PRIVATE_KEY || process.env.MNEMONIC || "").trim();
  if (!key) {
    throw new Error("Set PRIVATE_KEY in smart-contract/.env");
  }
  if (/^(0x)?[0-9a-fA-F]{64}$/.test(key)) {
    return key.startsWith("0x") ? key : `0x${key}`;
  }
  throw new Error(
    "PRIVATE_KEY must be a 64-character hex key."
  );
}

async function main() {
  const { provider, url } = await getReadProvider();
  const wallet = new ethers.Wallet(resolvePrivateKey(), provider);
  const balance = await provider.getBalance(wallet.address);

  console.log("RPC OK:", url);
  console.log("Deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "Sepolia ETH");

  if (balance === 0n) {
    console.error("\nBLOCKED: Wallet has 0 Sepolia ETH. Fund this address first:");
    console.error(wallet.address);
    console.error("Faucet: https://www.alchemy.com/faucets/ethereum-sepolia");
    process.exit(1);
  }

  console.log("\nReady to deploy.");
}

main().catch((error) => {
  console.error("\nSetup check failed:", error.message);
  process.exit(1);
});
