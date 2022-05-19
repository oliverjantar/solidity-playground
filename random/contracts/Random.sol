pragma solidity ^0.8.0;

contract Random {

    uint256 public _random;

    event random();

    function emitRandom() public {
        emit random();
    }

    function receiveRandom(uint256 number) public{
        _random = number;
    }
}