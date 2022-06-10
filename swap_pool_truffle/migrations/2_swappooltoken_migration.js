const token1 = artifacts.require("ERC20");
const token2 = artifacts.require("ERC20");
const SwapPoolToken = artifacts.require("SwapPoolToken");

module.exports = async function (deployer) {
  await deployer.deploy(token1,"token1","tkn1");
  await deployer.deploy(token2,"token2","tkn2");

  const token1Instance = await token1.deployed();
  const token2Instance = await token2.deployed();

  await deployer.deploy(SwapPoolToken,token1Instance.address,token2Instance.address);

};
