pragma solidity ^0.8.0;

import "./ITokenReceiver.sol";
import "./TestERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FakePriceChecker is ITokenReceiver {
    address public _token;

    constructor(address token) {
        _token = token;
    }

    function tokenReceived(uint256 amount) external override {
        TestERC20(_token).mintTestTokens(100000);
        IERC20(_token).approve(msg.sender, 0);
    }
}
