require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const {
  MNEMONIC,
  PRIVATE_KEY,
  INFURA_PROJECT_ID,
  SEPOLIA_RPC_URL,
} = process.env;

function resolveRpcUrl() {
  if (SEPOLIA_RPC_URL) {
    return SEPOLIA_RPC_URL;
  }

  if (!INFURA_PROJECT_ID) {
    return null;
  }

  if (INFURA_PROJECT_ID.startsWith("http")) {
    return INFURA_PROJECT_ID;
  }

  return `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;
}

function resolvePrivateKey() {
  if (PRIVATE_KEY) {
    return PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;
  }

  const maybeKey = (MNEMONIC || "").trim();
  if (/^(0x)?[0-9a-fA-F]{64}$/.test(maybeKey)) {
    return maybeKey.startsWith("0x") ? maybeKey : `0x${maybeKey}`;
  }

  return null;
}

function resolveMnemonic() {
  const phrase = (MNEMONIC || "").trim();
  if (!phrase || /^(0x)?[0-9a-fA-F]{64}$/.test(phrase)) {
    return null;
  }

  const wordCount = phrase.split(/\s+/).length;
  if (wordCount < 12) {
    throw new Error(
      "MNEMONIC must be a 12- or 24-word phrase. Use PRIVATE_KEY for hex keys."
    );
  }

  return phrase;
}

function createSepoliaProvider() {
  const rpcUrl = resolveRpcUrl();
  if (!rpcUrl) {
    throw new Error(
      "Set SEPOLIA_RPC_URL or INFURA_PROJECT_ID in smart-contract/.env"
    );
  }

  const walletOptions = {
    providerOrUrl: rpcUrl,
    chainId: 11155111,
    pollingInterval: 30000,
  };

  const privateKey = resolvePrivateKey();
  if (privateKey) {
    return new HDWalletProvider({
      ...walletOptions,
      privateKeys: [privateKey],
    });
  }

  const mnemonic = resolveMnemonic();
  if (mnemonic) {
    return new HDWalletProvider({
      ...walletOptions,
      mnemonic,
    });
  }

  throw new Error(
    "Set PRIVATE_KEY or MNEMONIC in smart-contract/.env for Sepolia deployment"
  );
}

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    sepolia: {
      provider: createSepoliaProvider,
      network_id: 11155111,
      confirmations: 1,
      timeoutBlocks: 500,
      skipDryRun: true,
      gas: 6000000,
      networkCheckTimeout: 300000,
      disableConfirmationListener: true,
    },
  },

  mocha: {
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
