pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./MyNft.sol";


contract MySplitNft is ERC1155 {
    constructor(string memory uri) ERC1155(uri) {}

    function lock(MyNft nft, uint256 tokenId) public{
        require(nft.getApproved(tokenId) == address(this),"Not approved to transfer NFT");
        nft.transferFrom(msg.sender, address(this), tokenId);
        _mint(msg.sender, tokenId, 5,"");
    }

    function unlock(MyNft nft, uint256 tokenId) public{
        require(balanceOf(msg.sender, tokenId) == 5,"Insufficient balance of NFTs");
        nft.safeTransferFrom(address(this),msg.sender, tokenId);
        _burn(msg.sender, tokenId, 5);
    }
}