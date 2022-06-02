const truffleAssert = require("truffle-assertions");

const gold = artifacts.require("gold");

contract("gold", (accounts) => {
  beforeEach(async () => {
    contract = await gold.deployed({ from: accounts[0] });
  });

  it("queries the token name", async () => {
    let name = await contract.name();
    console.log(name);
  });

  it("call buyGold", async () => {
    let txReceipt = await contract.buyFrom(accounts[0], {
      value: 10000,
      from: accounts[1],
    });

    truffleAssert.eventEmitted(txReceipt, "Transfer", (e) => {
      return (e.to = accounts[0]);
    });

    await truffleAssert.fails(
      contract.mint("1000", { from: accounts[1] }),
      truffleAssert.ErrorType.REVERT
    );
  });
});
