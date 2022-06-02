const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SwapPoolToken contract", function () {
  it("Deployment should set tokens and owner", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const TestERC20 = await ethers.getContractFactory("TestERC20");
    const testToken0 = await TestERC20.deploy(1000000, "token0", "tkn0");

    const Test2ERC20 = await ethers.getContractFactory("TestERC20");
    const testToken1 = await Test2ERC20.deploy(1000000, "token1", "tkn1");

    const SwapPoolToken = await ethers.getContractFactory("SwapPoolToken");

    const swapPoolToken = await SwapPoolToken.deploy(
      testToken0.address,
      testToken1.address
    );

    const token0Addr = await swapPoolToken._token0();
    const token1Addr = await swapPoolToken._token1();

    expect(token0Addr).to.equal(testToken0.address);
    expect(token1Addr).to.equal(testToken1.address);

    // const ownerBalance = await hardhatToken.balanceOf(owner.address);
  });
});
