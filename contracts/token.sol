// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol"; 

contract NFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress; 
    mapping(uint256 => Attr) public attributes;
    mapping (string => uint256) public tokenIDTrack;
    struct Attr {
        string name;
    }


    constructor(address marketplaceAddress) ERC721("TEST LISK NFTS", "GELDNFTT1") {
        marketplaceAddress=0xb3a94a6b4e3f473ab950972d2FA260e8A6Fb2B4d;
        contractAddress = marketplaceAddress;
    }

    function mintNFT(address reciver,string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(reciver, newItemId);
         attributes[newItemId] = Attr(tokenURI);
        setApprovalForAll(contractAddress, true);
        tokenIDTrack[tokenURI] = newItemId; 
        return _tokenIds.current();
    }

    function getTokenID(string memory tokenURI) public view returns (uint itemId) {
       uint256 ItemId = tokenIDTrack[tokenURI];
         return ItemId;
    }


    
}