const SecureAuction = artifacts.require("SecureAuction");

module.exports = async function (deployer) {
  const instance = await deployer.deploy(SecureAuction);

  console.log("\n=================================");
  console.log("SecureAuction contract deployed");
  console.log("=================================");
  console.log("Contract address:", instance.address);
  console.log("\nCopy to your frontend .env:");
  console.log(`VITE_CONTRACT_ADDRESS=${instance.address}`);
  console.log("=================================\n");
};
