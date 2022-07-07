const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test all", function () {
  it("test all", async function () {
    const Foo = await ethers.getContractFactory("Foo");
    const foo = await Foo.deploy();

    
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
