const truffleAssert = require("truffle-assertions");

contract("Random", (accounts) => {
  beforeEach(async () => {
    contract = await Random.deployed();
  });

  it("test random", async () => {
    let name = await contract.on("random", (err, data) => {});

    assert.equal(name, "Gold", "The name of the token does not match");
  });
});
