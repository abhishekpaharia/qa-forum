// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//import "@openzeppelin/contracts@4.8.2/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract RewardPoint is ERC721, IERC721Receiver {

    uint public tokenIdCounter = 1;
    mapping(address owner => uint[] tokenIds) public owner2tokenIds;

    constructor() ERC721("RewardPoint", "RP") {
    }

    modifier onlyOwnerOrApproved(uint tokenId) {
        require(_isApprovedOrOwner(msg.sender, tokenId), "caller is not token owner or approved");
        _;
    }

    function safeMint(address to) public {
        uint tokenId = tokenIdCounter;
        tokenIdCounter++;
        _safeMint(to, tokenId);
        _setApprovalForAll(to, msg.sender, true);
        owner2tokenIds[to].push(tokenId);
    }

    function safeBurn(uint tokenId) public onlyOwnerOrApproved(tokenId) {
        address own = ownerOf(tokenId);
        uint[] memory arr1 = owner2tokenIds[own];
        uint[] memory arr2 = new uint[](arr1.length-1);
        uint j = 0;
        for(uint i; i<arr1.length; i++){
            if(arr1[i] != tokenId) {
                arr2[j] = arr1[i];
                j++;
            }
        }
        assert(j+1 == arr1.length);
        owner2tokenIds[own] = arr2;
        delete arr1;
        _burn(tokenId);
    }

    function safeTransfer(address from, address to, uint tokenCount) public {
        uint256 fromTokenCount = balanceOf(from);
        require(fromTokenCount >= tokenCount);
        assert(fromTokenCount == owner2tokenIds[from].length);
        //require(msg.sender == from, "msg sender is not same as owner of token");
        uint i = 0;
        for(; i<tokenCount; i++){
            _transfer(from, to, owner2tokenIds[from][i]);
            owner2tokenIds[to].push(owner2tokenIds[from][i]);
        }

        uint newArrLength = fromTokenCount - tokenCount;
        uint[] memory arr2 = new uint[](newArrLength);
        for(uint j = 0; j<newArrLength; j++){
            arr2[j] = owner2tokenIds[from][i];
            i++;
        }
        assert(i - tokenCount == newArrLength);
        delete owner2tokenIds[from];
        owner2tokenIds[from] = arr2;

    }

    function getInfo(address add) view public returns(uint){
        return owner2tokenIds[add].length;
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
        //return IERC721.onERC721Received.selector;
    }
}
