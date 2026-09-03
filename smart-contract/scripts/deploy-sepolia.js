require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const { getRpcUrls, createProvider, getReadProvider } = require("./rpc");

function resolvePrivateKey() {
  const key = (process.env.PRIVATE_KEY || "").trim();
  if (!key) {
    throw new Error("Set PRIVATE_KEY in smart-contract/.env");
  }
  return key.startsWith("0x") ? key : `0x${key}`;
}

function loadArtifact(contractName) {
  const artifactPath = path.join(
    __dirname,
    "..",
    "build",
    "contracts",
    `${contractName}.json`
  );

  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Missing ${contractName} artifact. Run: npm run compile`);
  }

  return require(artifactPath);
}

async function deployWithProvider(url, privateKey, contractName) {
  const provider = createProvider(url);
  const wallet = new ethers.Wallet(privateKey, provider);
  const artifact = loadArtifact(contractName);
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  console.log(`Deploying ${contractName} via ${url} ...`);
  const contract = await factory.deploy();
  const receipt = await contract.deploymentTransaction().wait();

  return {
    address: await contract.getAddress(),
    hash: receipt.hash,
    rpc: url,
  };
}

async function main() {
  const privateKey = resolvePrivateKey();
  const { provider, url } = await getReadProvider();
  const wallet = new ethers.Wallet(privateKey, provider);
  const balance = await provider.getBalance(wallet.address);

  console.log("RPC check OK:", url);
  console.log("Deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "Sepolia ETH");

  if (balance === 0n) {
    throw new Error(
      `Wallet ${wallet.address} has 0 Sepolia ETH. Get test ETH from a faucet first.`
    );
  }

  let lastError;

  for (const rpcUrl of getRpcUrls()) {
    try {
      const result = await deployWithProvider(
        rpcUrl,
        privateKey,
        "SecureAuction"
      );

      console.log("\n=================================");
      console.log("Deployment complete");
      console.log("=================================");
      console.log("Contract:", result.address);
      console.log("Tx hash:", result.hash);
      console.log("RPC used:", result.rpc);
      console.log("\nAdd to frontend .env:");
      console.log(`VITE_CONTRACT_ADDRESS=${result.address}`);
      console.log("=================================\n");
      return;
    } catch (error) {
      lastError = error;
      console.log("Deploy failed on", rpcUrl, "-", error.message);
    }
  }

  throw lastError || new Error("All RPC endpoints failed during deployment");
}

main().catch((error) => {
  console.error("\nDeployment failed:", error.message);
  process.exit(1);
});
