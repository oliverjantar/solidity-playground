import "./App.css";
import { useMetaMask } from "metamask-react";
import React, { useState } from "react";

function App() {
  return (
    <div>
      <StartMetaMask />
    </div>
  );
}

const StartMetaMask = () => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const [txResult, setTxResult] = useState({
    isSet: false,
  });

  let metamaskStatus = () => {
    if (status === "initializing")
      return <div>Synchronisation with MetaMask ongoing...</div>;

    if (status === "unavailable") return <div>MetaMask not available :(</div>;

    if (status === "notConnected")
      return <button onClick={connect}>Connect to MetaMask</button>;

    if (status === "connecting") return <div>Connecting...</div>;

    if (status === "connected")
      return (
        <div>
          Connected account {account} on chain ID {chainId}
        </div>
      );
  };

  const changeChain = async () => {
    try {
      const result = await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x578" }],
      });
      console.log("result: ", result);
    } catch (switchError) {
      debugger;
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x578",
                chainName: "local hardhat",
                rpcUrls: ["http://127.0.0.1:8545/"],
              },
            ],
          });
        } catch (addError) {
          console.log("Error: ", addError);
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }

    console.log("change chain");
  };

  const sendEth = async () => {
    try {
      const params = [
        {
          from: ethereum.selectedAddress,
          to: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          gas: "0x76c0", // 30400
          gasPrice: "0x9184e72a000", // 10000000000000
          value: "0x9184e72a", // 2441406250
          data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
        },
      ];

      await ethereum.request({
        method: "eth_sendTransaction",
        params,
      });

      setTxResult({ success: true, isSet: true });
    } catch (err) {
      if (err.code === 4001) {
        setTxResult({
          success: false,
          err: { ...err, message: "You rejected the transaction!" },
          isSet: true,
        });
      } else {
        setTxResult({ success: false, err: err, isSet: true });
      }
    }
  };

  return (
    <div>
      <button onClick={() => changeChain()}>change chain</button>
      <button onClick={() => sendEth()}>give me eth</button>
      {!txResult.isSet ? (
        <div></div>
      ) : txResult.success ? (
        <div>Thanks, now go ahead and send me more eth!</div>
      ) : (
        <div>{txResult.err.message}</div>
      )}
      {metamaskStatus()}
    </div>
  );
};

export default App;
