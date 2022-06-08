const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SwapPoolToken contract", function () {
  beforeEach(async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const TestERC20 = await ethers.getContractFactory("TestERC20");
    testToken0 = await TestERC20.deploy(1000000, "token0", "tkn0");

    const Test2ERC20 = await ethers.getContractFactory("TestERC20");
    testToken1 = await Test2ERC20.deploy(1000000, "token1", "tkn1");

    const SwapPoolToken = await ethers.getContractFactory("SwapPoolToken");

    swapPoolToken = await SwapPoolToken.deploy(
      testToken0.address,
      testToken1.address
    );
  });
  it("Deployment should set tokens", async function () {
    const token0Addr = await swapPoolToken._token0();
    const token1Addr = await swapPoolToken._token1();

    expect(token0Addr).to.equal(testToken0.address);
    expect(token1Addr).to.equal(testToken1.address);

    // const ownerBalance = await hardhatToken.balanceOf(owner.address);
  });
  it("should add liquidity to a token pool swap", async () => {
    const [owner, addr1] = await ethers.getSigners();
    await testToken0.connect(addr1).mintTestTokens(400);
    await testToken1.connect(addr1).mintTestTokens(800);

    const balance = await testToken0.balanceOf(addr1.address);
    expect(balance).to.equal(400, "balance of account1 does not match");

    const balance2 = await testToken1.balanceOf(addr1.address);
    expect(balance2).to.equal(800, "balance of account1 does not match");

    await testToken0.connect(addr1).approve(swapPoolToken.address, 200);
    await testToken1.connect(addr1).approve(swapPoolToken.address, 400);

    const poolBalance0 = await testToken0.balanceOf(swapPoolToken.address);
    expect(poolBalance0).to.equal(0, "Pool's balance of token0 does not match");

    const poolBalance1 = await testToken1.balanceOf(swapPoolToken.address);
    expect(poolBalance1).to.equal(0, "Pool's balance of token1 does not match");

    const allowance = await testToken0.allowance(
      addr1.address,
      swapPoolToken.address
    );
    console.log("allowance", allowance);

    await swapPoolToken.addLiquidity(addr1.address, 200, 400);

    const poolToken0balance = await testToken0.balanceOf(swapPoolToken.address);
    expect(poolToken0balance).to.equal(
      200,
      "Pool's balance of token0 does not match"
    );

    const poolToken1balance = await testToken1.balanceOf(swapPoolToken.address);
    expect(poolToken1balance).to.equal(
      400,
      "Pool's balance of token1 does not match"
    );

    const lpTokens = await swapPoolToken.balanceOf(addr1.address);
    expect(lpTokens).to.equal(
      200 * 400,
      "Account1 balance of liquidity tokens does not match."
    );

    const accountToken0Balance = await testToken0.balanceOf(addr1.address); //should be 0
    expect(accountToken0Balance).to.equal(
      200,
      "Account1 balance of token0 does not match"
    );

    const accountToken1Balance = await testToken1.balanceOf(addr1.address); //should be 0
    expect(accountToken1Balance).to.equal(
      400,
      "Account1 balance of token1 does not match"
    );

    const allowance2 = await testToken0.allowance(
      addr1.address,
      swapPoolToken.address
    );
    console.log("allowance", allowance2);
  });
});
