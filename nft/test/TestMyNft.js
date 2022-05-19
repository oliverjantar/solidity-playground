const truffleAssert = require("truffle-assertions");

const MyNft = artifacts.require("MyNft");
const MySplitNft = artifacts.require("MySplitNft");

contract("MyNft", (accounts) => {
  beforeEach(async () => {
    contract = await MyNft.deployed({ from: accounts[0] });
    const tokenUri = await contract.tokenURI(1);

    splitNftContract = await MySplitNft.deployed(tokenUri, {
      from: accounts[1],
    });
  });

  it("queries the token name", async () => {
    let name = await contract.name();
    assert.equal(name, "mynft", "The name of the token does not match");
  });

  it("checks MySplitNft has correct uri", async () => {
    const tokenUri = await contract.tokenURI(1);
    const splitNftUri = await splitNftContract.uri(1);

    assert.equal(tokenUri, "example.com/foo", "The token uri does not match");
    assert.equal(splitNftUri, tokenUri, "The split token uri does not match");
  });

  it("fails to lock Nft due to not approved account", async () => {
    await truffleAssert.reverts(
      splitNftContract.lock(contract.address, 1),
      truffleAssert.ErrorType.REVERT,
      "Not approved to transfer NFT"
    );

    let owner = await contract.ownerOf(1);
    assert.equal(owner, accounts[0], "Owner of NFT isn't account[0]");
  });

  it("approves MySplitNft to transfer Nft", async () => {
    await contract.approve(splitNftContract.address, 1);

    const account = await contract.getApproved(1);
    assert.equal(
      account,
      splitNftContract.address,
      "SplitNftContract isn't approved to transfer token"
    );
  });

  it("MySplitNft locks Nft", async () => {
    await contract.approve(splitNftContract.address, 1);

    let owner = await contract.ownerOf(1);
    assert.equal(owner, accounts[0], "Owner of NFT isn't account[0]");

    await splitNftContract.lock(contract.address, 1);

    owner = await contract.ownerOf(1);
    assert.equal(
      owner,
      splitNftContract.address,
      "Owner of NFT isn't splitNftContract"
    );
  });

  it("MySplitNft won't unlock Nft if account has insufficient balance", async () => {
    await truffleAssert.reverts(
      splitNftContract.unlock(contract.address, 1, {
        from: accounts[1],
      }),
      truffleAssert.ErrorType.REVERT,
      "Insufficient balance of NFTs"
    );
  });

  it("MySplitNft unlocks NFT", async () => {
    await splitNftContract.unlock(contract.address, 1, {
      from: accounts[0],
    });

    let owner = await contract.ownerOf(1);
    assert.equal(owner, accounts[0], "Owner of NFT isn't account[0]");

    let balance = await contract.balanceOf(accounts[0]);
    assert.equal(balance, 1, "account[0] doesn't have NFT");
  });
});
