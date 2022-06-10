pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Test2ERC20 is ERC20 {
    address owner;

    constructor(
        uint256 initialSupply,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        owner = msg.sender;
    }

    function mintTestTokens(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
