//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Proxy {
    struct Facet {
        address _address;
        bytes4[] _selectors;
    }

    mapping(bytes4 => address) selectorsToAddresses;
    bool public _isInitialized;

    constructor(Facet[] memory facets) {
        for (uint256 i; i < facets.length; i = i + 1) {
            Facet memory f = facets[i];

            address target = f._address;

            (bool success, bytes memory data) = target.delegatecall(
                abi.encodeWithSignature("init()")
            );

            require(success);

            for (uint256 j; j < f._selectors.length; j++) {
                selectorsToAddresses[f._selectors[j]] = f._address;
            }
        }
        _isInitialized = true;
    }

     fallback(bytes calldata inputData) external returns(bytes memory) {
    
        address foo = selectorsToAddresses[msg.sig];
        console.log("test");
        require(foo != address(0));

        (bool success, bytes memory data) = foo.delegatecall(msg.data);

        if (success) {
             return data;
        }

        revert();
    }
}
