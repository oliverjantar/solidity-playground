const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require('merkletreejs');

describe("Voting", () => {
	let accounts, contract, deadline, proposalId, totalGas = 0;
	let tree;

	before(async () => {
		accounts = await ethers.getSigners();
		let contractFactory = await ethers.getContractFactory("Voting_nonoptimized");

		const leaves = [accounts[0].address].map(leaf => ethers.utils.keccak256(leaf));
		tree = new MerkleTree(leaves, ethers.utils.keccak256, {sortPairs: true});


		contract = await contractFactory.deploy(
			tree.getHexRoot(),
			// [accounts[0].address],
			[accounts[1].address, accounts[2].address, accounts[3].address],
		);
		await contract.deployed();
		deadline = Math.floor((new Date()).getTime() / 1000) + 10; // in 10 seconds
	});

	it("submits proposal", async () => {
		const leaf = ethers.utils.keccak256(accounts[0].address);
		const proof = tree.getHexProof(leaf);

		const tx = await contract.connect(accounts[0]).submitProposal(deadline,proof);
		const txReceipt = await tx.wait();
		proposalId = txReceipt.events[0].args.proposalId.toNumber();
		totalGas += txReceipt.cumulativeGasUsed.toNumber();
	})

	it("cannot submit proposal from unauthorized address", async () => {

		const leaf = ethers.utils.keccak256(accounts[1].address);
		const proof = tree.getHexProof(leaf);

		await expect(
			contract.connect(accounts[1]).submitProposal(deadline,proof)
		).to.be.revertedWith("NOT_PROPOSER");
	})

	it("submits votes", async () => {
		for (let i = 1; i <= 3; i++) {
			const tx = await contract.connect(accounts[i]).vote(proposalId, 1); // second argument is the index of the enum
			const txReceipt = await tx.wait();
			expect(tx).to.emit(contract, "VoteSubmitted");
			totalGas += txReceipt.cumulativeGasUsed.toNumber();
		}
	})

	it("fails to vote more than once", async () => {
		await expect(
			contract.connect(accounts[1]).vote(proposalId, 2)
		).to.be.revertedWith("ALREADY_VOTED");
	})

	it("fails to submit empty vote", async () => {
		await expect(
			contract.connect(accounts[1]).vote(proposalId, 0)
		).to.be.revertedWith("CANNOT_VOTE_NONE");
	})

	it("fails to submit vote to non-existent proposal", async () => {
		await expect(
			contract.connect(accounts[1]).vote(1, 1)
		).to.be.revertedWithPanic();
	})

	it("retrieves the votes", async () => {
		const proposal = await contract.getProposalDetails(proposalId);
		expect(proposal.status).to.equal(2); // IN_PROGRESS
		expect(proposal.votesFor).to.equal(3);
		expect(proposal.votesAgainst).to.equal(0);
	})

	after(() => {
		console.log("Total gas spent: ", totalGas); // optimized contract has 246723
	});

});
