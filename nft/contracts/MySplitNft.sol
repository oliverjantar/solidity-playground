pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./MyNft.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MySplitNft is ERC1155 {
    bytes[] private signatures;

    constructor(string memory uri) ERC1155(uri) {}

    function lock(
        MyNft nft,
        uint256 tokenId,
        bytes memory signature
    ) public {
        require(
            nft.getApproved(tokenId) == address(this),
            "Not approved to transfer NFT"
        );
        nft.transferFrom(msg.sender, address(this), tokenId);

        signatures.push(signature);

        address x = ECDSA.recover(message, signature);
        require(x == msg.sender);

        //  _mint(msg.sender, tokenId, 5,"");

        //emitnu zpravu o vygenerovany zprave, predam ji nekomu jinymu offchain a v unlocku ji zkontroluju
    }

    function unlock(
        MyNft nft,
        uint256 tokenId,
        bytes memory signature,
        string memory message
    ) public {
        require(
            balanceOf(msg.sender, tokenId) == 5,
            "Insufficient balance of NFTs"
        );
        nft.safeTransferFrom(address(this), msg.sender, tokenId);

        address x = ECDSA.recover(message, signature);
        require(x == msg.sender);

        //  _burn(msg.sender, tokenId, 5);
    }
}
