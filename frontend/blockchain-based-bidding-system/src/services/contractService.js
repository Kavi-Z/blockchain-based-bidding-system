export const getConfiguredContractAddress = () => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_CONTRACT_ADDRESS) {
    return import.meta.env.VITE_CONTRACT_ADDRESS;
  }

  if (typeof process !== "undefined" && process.env) {
    return process.env.REACT_APP_CONTRACT_ADDRESS || process.env.VITE_CONTRACT_ADDRESS || null;
  }

  return null;
};

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
