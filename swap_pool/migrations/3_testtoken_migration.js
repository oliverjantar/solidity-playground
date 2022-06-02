const TestERC20 = artifacts.require("TestERC20");
const Test2ERC20 = artifacts.require("Test2ERC20");

module.exports = function (deployer) {
  deployer.deploy(TestERC20, 1000000, "token1", "tkn1");
  deployer.deploy(Test2ERC20, 1000000, "token2", "tkn2");
};
