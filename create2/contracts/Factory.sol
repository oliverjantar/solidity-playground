// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract Factory {
    address public _itemAddress;

    function deployItem() public {
        address item = address(new Item{salt: "sth"}());
        _itemAddress = item;
    }
}

contract Item {
    uint32 x = 123;

    function destroy() public {
        selfdestruct(payable(msg.sender));
    }

    function getTimestamp() public view returns (uint256) {
        uint256 time;
        assembly {
            time := timestamp()
        }
        return time;
    }

    function getInt() public view returns (uint32) {
        assembly {
            let y := sload(0x0)
            mstore(0, y)
            return(0, 32)
        }
    }

    function storeInFreeMemory() public view returns (uint32) {
        assembly {
            let y := sload(0x0)
            let p := mload(0x40)
            mstore(p, y)

            mstore(0x40, add(p, 32))

            return(0x40, 32)
        }
    }

    function setNumber(uint32 number) public {
        assembly {
            let n := calldataload(4)
            sstore(0x0, n)
        }
    }
}
