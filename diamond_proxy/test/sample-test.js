const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test all", function () {
  it("test all", async function () {
    const Foo = await ethers.getContractFactory("Foo");
    const foo = await Foo.deploy();
    await foo.deployed();

    expect(await foo.bar()).to.equal("bar from foo");

    // const result = await foo.sign();
    // console.log("result", result);

    const Foo2 = await ethers.getContractFactory("Foo2");
    const foo2 = await Foo2.deploy();
    await foo2.deployed();

    expect(await foo2.bar2()).to.equal("bar2 from foo2");

    const Proxy = await ethers.getContractFactory("Proxy");

    const facets = [
      { _address: foo.address, _selectors: ["0xfebb0f7e"] },
      { _address: foo2.address, _selectors: ["0x64bdaf57"] },
    ];

    const proxy = await Proxy.deploy(facets);
    await proxy.deployed();

    // expect(await foo._isInitialized()).to.equal(true);
    // expect(await foo2._isInitialized()).to.equal(true);
    expect(await proxy._isInitialized()).to.equal(true);

    const [addr1] = await ethers.getSigners();

    const data = foo.interface.encodeFunctionData("bar", []);

    const abiCoder = new ethers.utils.AbiCoder();

    const signer = await ethers.getSigner();
    const result = await signer.call({
      from: addr1.address,
      to: proxy.address,
      data: data,
    });

    const decodedResult = abiCoder.decode(["string"], result);
    console.log("result", decodedResult);

    expect(decodedResult[0]).to.equal("bar from foo");
  });
});
