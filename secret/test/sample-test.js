const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const SecretNumber = await ethers.getContractFactory("SecretNumber");
    const secretNumber = await SecretNumber.deploy();
    await secretNumber.deployed();

    const result = await ethers.provider.getStorageAt(secretNumber.address, 0);

    console.log(result);

    // wait until the transaction is mined
  });
});

describe("rulette", function () {
  it("test", async function () {
    const CryptoRoulette = await ethers.getContractFactory("CryptoRoulette");
    const rulette = await CryptoRoulette.deploy({ value: 10 });
    await rulette.deployed();

    const result = await ethers.provider.getStorageAt(rulette.address, 0);

    await rulette.play(6, { value: ethers.utils.parseEther("1") });

    const result2 = await ethers.provider.getStorageAt(rulette.address, 0);

    console.log(result);
    console.log(result2);

    // wait until the transaction is mined
  });
});
