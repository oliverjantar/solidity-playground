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

      await item.setNumberArray([123]);

      await item.setNumberArray2([123],[456]);

      
    });

    // it("Deploys fake number contract and returns getNumber of different contract", async function () {

    //   const bytecode = "0x608060405234801561001057600080fd5b5060bc8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063f2c9ecd814602d575b600080fd5b60336047565b604051603e9190606d565b60405180910390f35b6000607b905090565b600063ffffffff82169050919050565b6067816050565b82525050565b6000602082019050608060008301846060565b9291505056fea264697066735822122004e438354f3e5709f7c2becad28998698d5d99162d48b718dfcea45a7df80af564736f6c63430008090033";


    //   const FakeNumber = await ethers.getContractFactory("FakeNumber");
    //   const fakeNumber = await FakeNumber.deploy(bytecode);
    //   console.log(fakeNumber);

    //   const number = await fakeNumber.getNumber();
    //   console.log(number);

    //   // const code = await provider.getCode(fakeNumber.itemAddress);

      
     
    // })


    it("Deploys fake number contract and returns getNumber of different contract", async function () {

      // const bytecode = "0x608060405234801561001057600080fd5b506004361061002b5760003560e01c8063b4ba349f14610030575b600080fd5b61003861004e565b6040516100459190610124565b60405180910390f35b60606040518060400160405280601d81526020017f5468652054696d65732054686579204172652061204368616e67696e21000000815250905090565b600081519050919050565b600082825260208201905092915050565b60005b838110156100c55780820151818401526020810190506100aa565b838111156100d4576000848401525b50505050565b6000601f19601f8301169050919050565b60006100f68261008b565b6101008185610096565b93506101108185602086016100a7565b610119816100da565b840191505092915050565b6000602082019050818103600083015261013e81846100eb565b90509291505056fea26469706673582212206f52e317773c0063a5888d204277821aaf1a0ef4c6baac8a6ec76ef3673e589a64736f6c6343000809003300000000";
const bytecode = "0x608060405234801561001057600080fd5b5061017c806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063b4ba349f14610030575b600080fd5b61003861004e565b6040516100459190610124565b60405180910390f35b60606040518060400160405280600b81526020017f4c6f72656d20697073756d000000000000000000000000000000000000000000815250905090565b600081519050919050565b600082825260208201905092915050565b60005b838110156100c55780820151818401526020810190506100aa565b838111156100d4576000848401525b50505050565b6000601f19601f8301169050919050565b60006100f68261008b565b6101008185610096565b93506101108185602086016100a7565b610119816100da565b840191505092915050565b6000602082019050818103600083015261013e81846100eb565b90509291505056fea26469706673582212204193d210dd5df1f11880d6dfeb0ec482ad1b958d097aea4a0d8129c1aee8102d64736f6c63430008090033";

      const ContractA = await ethers.getContractFactory("ContractA");
      const contractA = await ContractA.deploy(bytecode);
    //  console.log(contractA);

      const number = await contractA.sing();
      console.log(number);

      // const code = await provider.getCode(fakeNumber.itemAddress);

      
     
    })
  });
});
