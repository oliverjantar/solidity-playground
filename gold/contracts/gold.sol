pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GLDToken is ERC20 {
    address public _owner;

    constructor(uint256 initialSupply) ERC20("Gold", "GLD") {
        _mint(msg.sender, initialSupply);
        _owner = msg.sender;
    }

//0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2


//0x17F6AD8Ef982297579C203069C1DbfFE4348c372
//0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678
    function buyFrom(address payable owner) payable public {
        // require(msg.value >0);

        require(msg.sender != owner);

        uint256 ownerBalance = balanceOf(owner);

        require(ownerBalance >= msg.value);

        owner.transfer(msg.value);

        transferFrom(owner,msg.sender,msg.value);
    }

    function buyGLD(address payable owner) payable public {
        require(msg.sender != owner);

        uint256 ownerBalance = balanceOf(owner);

        require(ownerBalance >= msg.value);
        
        _mint(msg.sender,msg.value);
        owner.transfer(msg.value);
        _burn(owner,msg.value);
    }

}
