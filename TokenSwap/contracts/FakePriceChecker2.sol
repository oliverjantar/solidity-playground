pragma solidity ^0.8.0;

import "./ITokenReceiver.sol";
import "./TestERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FakePriceChecker2 is ITokenReceiver {
    address public _token;

    constructor(address token) {
        _token = token;
    }

    function tokenReceived(uint256 amount) external override {
        IERC20(_token).approve(msg.sender, amount + 100000);
    }
}
