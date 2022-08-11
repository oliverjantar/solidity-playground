const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Factory", function () {
  async function deployContract() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Factory");
    const factory = await Factory.deploy();

    return { factory };
  }

  describe("Deployment", function () {
    it("Should create item contract", async function () {
      const { factory } = await deployContract();

      await factory.deployItem();
      let itemAddress = await factory._itemAddress();
      // await factory.deployItem();
      console.log("itemAddress", itemAddress);

      const itemFactory = await ethers.getContractFactory("Item");
      const item = await itemFactory.attach(itemAddress);

      await item.destroy();

      await factory.deployItem();
      itemAddress = await factory._itemAddress();
      console.log("itemAddress", itemAddress);

      const time = await item.getTimestamp();
      console.log("timestamp", time);

      const int = await item.getInt();
      console.log("int", int);

      const storeInFreeMemory = await item.storeInFreeMemory();
      console.log("storeInFreeMemory", storeInFreeMemory);

      console.log("setNumber");
      await item.setNumber(9876);
      const int2 = await item.getInt();
      console.log("int", int2);

      // expect(itemAddress).to.not.be.empty("Address is empty");
    });
  });
});
