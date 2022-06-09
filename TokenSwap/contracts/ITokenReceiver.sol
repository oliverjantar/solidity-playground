pragma solidity ^0.8.0;

interface ITokenReceiver {
    function tokenReceived(uint256 amount) external;
}
