const gold = artifacts.require("gold");

module.exports = function (deployer) {
  deployer.deploy(gold, 1000000000);
};
