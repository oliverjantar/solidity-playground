const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SwapPoolToken contract", function () {
  beforeEach(async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const TestERC20 = await ethers.getContractFactory("TestERC20");
    testToken0 = await TestERC20.deploy(0, "token0", "tkn0");

    const Test2ERC20 = await ethers.getContractFactory("TestERC20");
    testToken1 = await Test2ERC20.deploy(0, "token1", "tkn1");

    const SwapPoolToken = await ethers.getContractFactory("SwapPoolToken");

    swapPoolToken = await SwapPoolToken.deploy(
      testToken0.address,
      testToken1.address
    );

    await testToken0.connect(addr1).mintTestTokens(4 * 10 ** 6);
    await testToken1.connect(addr1).mintTestTokens(8 * 10 ** 6);

    const balance = await testToken0.balanceOf(addr1.address);
    expect(balance).to.equal(4 * 10 ** 6, "balance of account1 does not match");

    const balance2 = await testToken1.balanceOf(addr1.address);
    expect(balance2).to.equal(
      8 * 10 ** 6,
      "balance of account1 does not match"
    );

    await testToken0.connect(addr1).approve(swapPoolToken.address, 2 * 10 ** 6);
    await testToken1.connect(addr1).approve(swapPoolToken.address, 4 * 10 ** 6);

    const poolBalance0 = await testToken0.balanceOf(swapPoolToken.address);
    expect(poolBalance0).to.equal(0, "Pool's balance of token0 does not match");

    const poolBalance1 = await testToken1.balanceOf(swapPoolToken.address);
    expect(poolBalance1).to.equal(0, "Pool's balance of token1 does not match");

    await swapPoolToken.connect(addr1).addLiquidity(2 * 10 ** 6, 4 * 10 ** 6);
  });

  it("Deployment should correctly set tokens", async function () {
    const token0Addr = await swapPoolToken._token0();
    const token1Addr = await swapPoolToken._token1();

    expect(token0Addr).to.equal(testToken0.address);
    expect(token1Addr).to.equal(testToken1.address);
  });

  it("Checks added liquidity to a pool", async () => {
    const [, addr1] = await ethers.getSigners();
    const poolToken0balance = await testToken0.balanceOf(swapPoolToken.address);
    expect(poolToken0balance).to.equal(
      2 * 10 ** 6,
      "Pool's balance of token0 does not match"
    );

    const poolToken1balance = await testToken1.balanceOf(swapPoolToken.address);
    expect(poolToken1balance).to.equal(
      4 * 10 ** 6,
      "Pool's balance of token1 does not match"
    );

    const lpTokens = await swapPoolToken.balanceOf(addr1.address);
    expect(lpTokens).to.equal(
      2 * 10 ** 6 * (4 * 10 ** 6),
      "Account1 balance of liquidity tokens does not match."
    );

    const balance0After = await testToken0.balanceOf(addr1.address);
    expect(balance0After).to.equal(
      2 * 10 ** 6,
      "balance of account1 does not match"
    );

    const balance1After = await testToken1.balanceOf(addr1.address);
    expect(balance1After).to.equal(
      4 * 10 ** 6,
      "balance of account1 does not match"
    );

    const allowance2 = await testToken0.allowance(
      addr1.address,
      swapPoolToken.address
    );
    expect(allowance2).to.equal(0);
  });

  it("Removes liquidity from pool", async () => {
    const [, addr1] = await ethers.getSigners();

    await swapPoolToken
      .connect(addr1)
      .removeLiquidity(2 * 10 ** 6 * (4 * 10 ** 6));

    const poolToken0balance = await testToken0.balanceOf(swapPoolToken.address);
    expect(poolToken0balance).to.equal(
      0,
      "Pool's balance of token0 does not match"
    );

    const poolToken1balance = await testToken1.balanceOf(swapPoolToken.address);
    expect(poolToken1balance).to.equal(
      0,
      "Pool's balance of token1 does not match"
    );

    const lpTokens = await swapPoolToken.balanceOf(addr1.address);
    expect(lpTokens).to.equal(
      0,
      "Account1 balance of liquidity tokens does not match."
    );

    const balance0After = await testToken0.balanceOf(addr1.address);
    expect(balance0After).to.equal(
      4 * 10 ** 6,
      "balance of account1 does not match"
    );

    const balance1After = await testToken1.balanceOf(addr1.address);
    expect(balance1After).to.equal(
      8 * 10 ** 6,
      "balance of account1 does not match"
    );
  });

  it("Swaps one token for another", async () => {
    const [, , addr2] = await ethers.getSigners();

    await testToken0.connect(addr2).mintTestTokens(1 * 10 ** 6);

    testToken0.connect(addr2).approve(swapPoolToken.address, 1 * 10 ** 6);

    const balanceBeforeSwap = await testToken1.balanceOf(addr2.address);
    expect(balanceBeforeSwap).to.equal(
      0,
      "Addr2 balance of token1 does not match"
    );

    await swapPoolToken.connect(addr2).swap(1 * 10 ** 6, 2 * 10 ** 6);

    const balanceAfterSwapToken0 = await testToken0.balanceOf(addr2.address);
    expect(balanceAfterSwapToken0).to.equal(
      0,
      "Swap of token 0 was successful"
    );

    const balanceAfterSwapToken1 = await testToken1.balanceOf(addr2.address);
    expect(balanceAfterSwapToken1).to.equal(
      2 * 10 ** 6 - (2 * 10 ** 6 * 3) / 1000,
      "Swap of token 1 was successful"
    );

    const balancePoolToken0 = await testToken0.balanceOf(swapPoolToken.address);
    expect(balancePoolToken0).to.equal(3000000);

    const balancePoolToken1 = await testToken1.balanceOf(swapPoolToken.address);
    expect(balancePoolToken1).to.equal(2006000);
  });

  it("Removes liquidity to collect fees", async () => {
    const [, addr1, addr2] = await ethers.getSigners();

    await testToken0.connect(addr2).mintTestTokens(1 * 10 ** 6);

    testToken0.connect(addr2).approve(swapPoolToken.address, 1 * 10 ** 6);

    await swapPoolToken.connect(addr2).swap(1 * 10 ** 6, 2 * 10 ** 6);

    await swapPoolToken.connect(addr1).removeLiquidity(4 * 10 ** 12);

    const poolToken0balance = await testToken0.balanceOf(swapPoolToken.address);
    expect(poolToken0balance).to.equal(
      1020000,
      "Pool's balance of token0 does not match"
    );

    const poolToken1balance = await testToken1.balanceOf(swapPoolToken.address);
    expect(poolToken1balance).to.equal(
      678080,
      "Pool's balance of token1 does not match"
    );

    const lpTokens = await swapPoolToken.balanceOf(addr1.address);
    expect(lpTokens).to.equal(
      4 * 10 ** 12,
      "Account1 balance of liquidity tokens does not match."
    );

    const balance0After = await testToken0.balanceOf(addr1.address);
    expect(balance0After).to.equal(
      3980000,
      "balance of account1 does not match"
    );

    const balance1After = await testToken1.balanceOf(addr1.address);
    expect(balance1After).to.equal(
      5327920,
      "balance of account1 does not match"
    );
  });

  it("Cannot remove more liquidity than is in the pool", async () => {
    const [, addr1, addr2] = await ethers.getSigners();

    await testToken0.connect(addr2).mintTestTokens(1 * 10 ** 6);

    testToken0.connect(addr2).approve(swapPoolToken.address, 1 * 10 ** 6);

    await swapPoolToken.connect(addr2).swap(1 * 10 ** 6, 2 * 10 ** 6);

    await expect(
      swapPoolToken.connect(addr1).removeLiquidity(8 * 10 ** 12)
    ).to.be.revertedWith("Not enough liquidity in pool");
  });

  it("Cannot swap two tokens with different price", async () => {
    const [, , addr2] = await ethers.getSigners();

    await testToken0.connect(addr2).mintTestTokens(1 * 10 ** 6);

    testToken0.connect(addr2).approve(swapPoolToken.address, 1 * 10 ** 6);

    const balanceBeforeSwap = await testToken1.balanceOf(addr2.address);
    expect(balanceBeforeSwap).to.equal(
      0,
      "Addr2 balance of token1 does not match"
    );

    await expect(
      swapPoolToken.connect(addr2).swap(1 * 10 ** 6, 1 * 10 ** 6)
    ).to.be.revertedWith("Incorrect ratio of tokens");
  });

  it("Performs flash loan", async () => {
    const PriceChecker = await ethers.getContractFactory("PriceChecker");

    priceChecker = await PriceChecker.deploy(testToken0.address);

    await swapPoolToken.flashLoan(priceChecker.address, 0, 1000000);

    const balancePoolToken0 = await testToken0.balanceOf(swapPoolToken.address);
    expect(balancePoolToken0).to.equal(2003000);

    const balancePriceChecker = await testToken0.balanceOf(
      priceChecker.address
    );
    expect(balancePriceChecker).to.equal(97000);
  });

  it("Fails to do flashloan due to insufficient amount in the swap pool", async () => {
    const PriceChecker = await ethers.getContractFactory("PriceChecker");

    priceChecker = await PriceChecker.deploy(testToken0.address);

    await expect(
      swapPoolToken.flashLoan(priceChecker.address, 0, 3000000)
    ).to.be.revertedWith("Insufficient balance in the swap pool");

    const balancePoolToken0 = await testToken0.balanceOf(swapPoolToken.address);
    expect(balancePoolToken0).to.equal(2000000);

    const balancePriceChecker = await testToken0.balanceOf(
      priceChecker.address
    );
    expect(balancePriceChecker).to.equal(0);
  });
});
