const MySplitNft = artifacts.require("MySplitNft");

module.exports = function (deployer) {
  deployer.deploy(MySplitNft, "example.com/foo");
};
