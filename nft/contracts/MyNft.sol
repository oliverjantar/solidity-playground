pragma solidity ^0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNft is ERC721URIStorage {
    constructor() ERC721("mynft", "mynft") {
      _mint(msg.sender,1);
      _setTokenURI(1,"/foo");
    }

    function _baseURI() override internal pure returns (string memory) {
        return "example.com";
    }
}

