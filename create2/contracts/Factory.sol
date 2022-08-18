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

    function setNumberArray(uint32[] calldata number) public {
        bytes32 foo;
        bytes32 foo2;
        bytes32 foo3;
        assembly {
            foo := calldataload(4) // na 32bytu je pointer na slot delky
            foo2 := calldataload(36) // delka pole
            foo3 := calldataload(68) // konkretni 1. cislo v poli
        }
        console.logBytes(abi.encode(foo));
        console.logBytes(abi.encode(foo2));
        console.logBytes(abi.encode(foo3));
    }

    function setNumberArray2(uint32[] calldata a, uint32[] calldata b) public {
        bytes32 a1;
        bytes32 a2;
        bytes32 a3;

        bytes32 b1;
        bytes32 b2;
        bytes32 b3;

        assembly {
            a1 := calldataload(4) // na 32 bytu je pointer na slot delky
            a2 := calldataload(68) // delka pole
            a3 := calldataload(100) // konkretni 1. cislo v poli

            b1 := calldataload(36)
            b2 := calldataload(132) // 128 + 4 (selector funkce)
            b3 := calldataload(164)
        }
        console.logBytes(abi.encode(a1));
        console.logBytes(abi.encode(a2));
        console.logBytes(abi.encode(a3));

        console.logBytes(abi.encode(b1));
        console.logBytes(abi.encode(b2));
        console.logBytes(abi.encode(b3));
    }
}

contract FakeNumber {
    function getNumber() public pure returns (uint32) {
        return 456;
    }

    constructor(bytes memory originalBytecode) {
        assembly {
            return(0xc0, 411) // 192, 192 + 219
        }
    }
}

contract OriginalNumber {
    function getNumber() public pure returns (uint32) {
        return 123;
    }
}

contract ContractA {
    constructor(bytes memory a) public {
        /*
           The Values to return opcode can come from a complex logic 
           but to keep it simple and for demo, we have hard coded them. 
           It may be different in your case. 
        */

        assembly {
            return(0xc0, add(0xc0, 414))
        }
    }

    function sing() public pure returns (string memory) {
        return "It's a Wonderful World!";
    }
}

contract AlteredContractA {
    function sing() public pure returns (string memory) {
        return "The Times They Are a Changin!";
    }
}

contract AlteredContractB {
    function sing() public pure returns (string memory) {
        return "Lorem ipsum";
    }
}
