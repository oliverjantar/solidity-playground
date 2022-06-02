const SwapPoolToken = artifacts.require("SwapPoolToken");

module.exports = function (deployer) {
  deployer.deploy(SwapPoolToken);
};
