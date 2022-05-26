const SwapPool = artifacts.require("SwapPool");

module.exports = function (deployer) {
  deployer.deploy(SwapPool);
};
