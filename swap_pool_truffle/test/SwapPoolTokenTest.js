const truffleAssert = require("truffle-assertions");

const token1 = artifacts.require("TestERC20");
const token2 = artifacts.require("Test2ERC20");
const SwapPoolToken = artifacts.require("SwapPoolToken");

contract("SwapPoolToken", (accounts) => {
  // let token1Instance;
  // let token2Instance;

  beforeEach(async () => {
    token1Instance = await token1.deployed(1000000, "token1", "tkn1", {
      from: accounts[0],
    });

    token2Instance = await token2.deployed(1000000, "token2", "tkn2", {
      from: accounts[0],
    });
    contract = await SwapPoolToken.deployed(
      token1Instance.address,
      token2Instance.address,
      { from: accounts[0] }
    );

    console.log("beforeEach token1Instance.address", token1Instance.address);
    console.log("beforeEach token2Instance.address", token2Instance.address);
  });

  // it("queries the token name", async () => {
  //   let name = await contract.name();
  //   assert.equal(name, "SwapPoolToken", "The name of the token does not match");
  // });

  it("adds liquidity to token pool", async () => {
    // console.log("token1", token1Instance.address);
    // console.log("token2", token2Instance.address);

    // let name1 = await token1Instance.name();
    // console.log("token1name", name1);
    // let name2 = await token2Instance.name();
    // console.log("token2name", name2);

    await token1Instance.mintTestTokens(400, { from: accounts[1] });
    await token2Instance.mintTestTokens(800, { from: accounts[1] });

    const balance = await token1Instance.balanceOf(accounts[1], {
      from: accounts[1],
    });
    assert.equal(balance, 400, "balance of account1 does not match");

    const balance2 = await token2Instance.balanceOf(accounts[1], {
      from: accounts[1],
    });
    assert.equal(balance2, 800, "balance of account1 does not match");

    await token1Instance.approve(contract.address, 200, { from: accounts[1] });
    await token2Instance.approve(contract.address, 400, { from: accounts[1] });

    const token0Address = await contract._token0();
    console.log("token0Address", token0Address);

    console.log("token0instanceAddress", token1Instance.address);

    const allowance = await token1Instance.allowance(
      accounts[1],
      contract.address
    );
    console.log("allowance", allowance);

    await contract.addLiquidity(accounts[1], 200, 400);

    const poolToken0balance = await token1Instance.balanceOf(contract.address);
    assert.equal(
      poolToken0balance,
      200,
      "Pool's balance of token0 does not match"
    );

    const poolToken1balance = await token2Instance.balanceOf(contract.address);
    assert.equal(
      poolToken1balance,
      400,
      "Pool's balance of token1 does not match"
    );

    const lpTokens = await contract.balanceOf(accounts[1]);
    assert.equal(
      lpTokens,
      Math.sqrt(200 * 400),
      "Account1 balance of liquidity tokens does not match."
    );

    const accountToken0Balance = await token1Instance.balance(accounts[1]);
    assert.equal(
      accountToken0Balance,
      200,
      "Account1 balance of token0 does not match"
    );

    const accountToken1Balance = await token2Instance.balance(accounts[1]);
    assert.equal(
      accountToken1Balance,
      400,
      "Account1 balance of token1 does not match"
    );
  });

  // it("checks MySplitNft has correct uri", async () => {
  //   const tokenUri = await contract.tokenURI(1);
  //   const splitNftUri = await splitNftContract.uri(1);

  //   assert.equal(tokenUri, "example.com/foo", "The token uri does not match");
  //   assert.equal(splitNftUri, tokenUri, "The split token uri does not match");
  // });

  // it("fails to lock Nft due to not approved account", async () => {
  //   await truffleAssert.reverts(
  //     splitNftContract.lock(contract.address, 1),
  //     truffleAssert.ErrorType.REVERT,
  //     "Not approved to transfer NFT"
  //   );

  //   let owner = await contract.ownerOf(1);
  //   assert.equal(owner, accounts[0], "Owner of NFT isn't account[0]");
  // });
});
