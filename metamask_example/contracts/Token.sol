//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Token is ERC20 {
    constructor(uint256 initialSupply) ERC20("Gold", "GLD") {
        _mint(msg.sender, initialSupply);
    }

    function validate(bytes memory signature) public view returns (address) {
        bytes32 messageHash = ECDSA.toEthSignedMessageHash(
            keccak256(abi.encodePacked("hello"))
        );

        address x = ECDSA.recover(messageHash, signature);
        return x;
    }

    function getSignedMessage(
        address from,
        address to,
        uint256 amount,
        bytes memory signature
    ) public view returns (address) {
        bytes32 messageHash = ECDSA.toEthSignedMessageHash(
            keccak256(abi.encodePacked(from, to, amount))
        );

        address x = ECDSA.recover(messageHash, signature);
        return x;
    }

    function transferTokens(
        address from,
        address to,
        uint256 amount,
        bytes memory signature
    ) public returns (bool) {
        bytes32 messageHash = ECDSA.toEthSignedMessageHash(
            keccak256(abi.encodePacked(from, to, amount))
        );

        address signer = ECDSA.recover(messageHash, signature);
        require(signer == from, "Sender address is not a signer");

        uint256 balance = ERC20(address(this)).balanceOf(from);

        require(balance >= amount, "Insufficient balance in account");

        uint256 allowance = ERC20(address(this)).allowance(from, to);

        require(allowance >= amount, "Insufficient allowance in account");

        _transfer(from, to, amount);
        return true;
    }
}
