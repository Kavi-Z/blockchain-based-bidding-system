const SecureAuction = artifacts.require("SecureAuction");

module.exports = function (deployer) {
  // Example deployment params: 1 hour, 0.01 ETH min increment, 5 min extension, no max bid
  const biddingTime = 3600;       // 1 hour
  const minIncrement = web3.utils.toWei("0.01", "ether");
  const extensionTime = 300;      // 5 minutes
  const maxBid = 0;               // no cap  0x977c533bbbcDBDB667302442F68Cfa4F90AedA1D

  deployer.deploy(SecureAuction, biddingTime, minIncrement, extensionTime, maxBid);
};
