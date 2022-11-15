const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("MerkleTree", function () {

  async function deploy() {
  
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const MerkleTree = await ethers.getContractFactory("MerkleTree");
    const merkleTree = await MerkleTree.deploy();

    return { merkleTree, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should pass", async function () {
      const { merkleTree } = await deploy();


      const test = await merkleTree.test();

      console.log("test", test);
      expect().to.equal(42);
    });
  });
});
