// Save as: migrations/2_deploy_contracts.js

const SecureAuction = artifacts.require("SecureAuction");

module.exports = function(deployer) {
  deployer.deploy(SecureAuction).then(() => {
    console.log("\n=================================");
    console.log("✅ SecureAuction Contract Deployed!");
    console.log("=================================");
    console.log("Contract Address:", SecureAuction.address);
    console.log("\n📋 COPY THIS ADDRESS TO YOUR REACT APP:");
    console.log("const CONTRACT_ADDRESS = \"" + SecureAuction.address + "\";");
    console.log("=================================\n");
  });
};