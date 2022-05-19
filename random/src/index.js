const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "http://172.17.224.1:7545"
);

const signer = provider.getSigner();

const abi = [
  {
    anonymous: false,
    inputs: [],
    name: "random",
    type: "event",
  },
  {
    inputs: [],
    name: "_random",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "emitRandom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "number",
        type: "uint256",
      },
    ],
    name: "receiveRandom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contract = new ethers.Contract(
  "0x2EEc5627322192c0f35Ca4648C7a4b31a0673259",
  abi,
  signer
);

const main = async function () {
  const result = await contract._random();
  console.log(result);

  contract.on("random", async (err, data) => {
    await contract.receiveRandom(32);
    const result2 = await contract._random();
    console.log(result2);
  });

  await contract.emitRandom();
};

main();
