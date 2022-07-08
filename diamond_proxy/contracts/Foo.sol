//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Foo {
    bool public isInitialized;

    function init() public {
        isInitialized = true;
    }

    function bar() public view returns (string memory) {
        return "bar from foo";
    }

    function sign() public view returns (bytes memory) {
        return abi.encodeWithSignature("bar2()");
    }
}
