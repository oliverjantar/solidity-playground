//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Proxy {
    struct Facet {
        address _address;
        bytes4[] _selectors;
    }

    mapping(bytes4 => address) selectorsToAddresses;

    constructor(Facet[] memory facets) {
        for (uint256 i; i < facets.length; i = i + 1) {
            Facet memory f = facets[i];

            f._address.delegatecall(abi.encodeWithSignature("init()"));

            for (uint256 j; j < f._selectors.length; j++) {
                selectorsToAddresses[f._selectors[j]] = f._address;
            }
        }
    }

    fallback() external {
        address foo = selectorsToAddresses[msg.sig];
        require(foo != address(0));

        (bool success, bytes memory data) = foo.delegatecall(msg.data);

        if (success) {
            return data;
        }

        revert();
    }
}
