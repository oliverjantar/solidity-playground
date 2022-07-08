//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Foo2 {
    bool public isInitialized;

    function init() public {
        isInitialized = true;
    }

    function bar2() public view returns (string memory) {
        return "bar2 from foo2";
    }
}
