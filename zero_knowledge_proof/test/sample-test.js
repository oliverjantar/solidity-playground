const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
  // it("Should return the new greeting once it's changed", async function () {
  //   const Token = await ethers.getContractFactory("Token");
  //   const token = await Token.deploy(100000);
  //   await token.deployed();

  //   const signers = await ethers.getSigners();
  //   const signer = signers[0];

  //   const message = ethers.utils.solidityPack(["string"], ["hello"]);
  //   const messageHash = ethers.utils.solidityKeccak256(["bytes"], [message]);
  //   const result = signer.signMessage(ethers.utils.arrayify(messageHash));

  //   // const result = await signer.signMessage("hello");
  //   console.log(result);

  //   console.log(signer.address);

  //   const address = await token.validate(result);

  //   console.log(address);

  //   //encodepack
  //   //encode - encode neodstranuje 0
  // });

  it("Should transfer tokens", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(100000);
    await token.deployed();

    await token.transfer(addr1.address, 10000);
    const amount = 1000;

    await token.connect(addr1).approve(addr2.address, amount);

    const allowance = await token
      .connect(addr1)
      .allowance(addr1.address, addr2.address);

    expect(allowance).to.be.equal(1000, "allowance not setup");

    const message = ethers.utils.solidityPack(
      ["address", "address", "uint256"],
      [addr1.address, addr2.address, amount]
    );

    const messageHash = ethers.utils.solidityKeccak256(["bytes"], [message]);
    const signedMessage = await addr1.signMessage(
      ethers.utils.arrayify(messageHash)
    );

    console.log("signed message", signedMessage);

    const contractResult = await token.getSignedMessage(
      addr1.address,
      addr2.address,
      amount,
      signedMessage
    );

    console.log(addr1.address);

    console.log("contract result", contractResult);
    console.log("addr2", addr2.address);

    const result = await token.transferTokens(
      addr1.address,
      addr2.address,
      amount,
      signedMessage
    );

    expect(result)
      .to.emit(token, "Transfer")
      .withArgs(addr1.address, addr2.address, amount);
  });
});
