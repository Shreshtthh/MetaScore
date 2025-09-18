// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "../interfaces/IActivityTracker.sol";

contract DemoNFT {
    mapping(uint256 => address) public owners;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public tokenApprovals;
    mapping(address => mapping(address => bool)) public operatorApprovals;
    
    uint256 public nextTokenId = 1;
    string public name = "Demo NFT Collection";
    string public symbol = "DNFT";
    
    address public immutable ACTIVITY_TRACKER;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    constructor(address _activityTracker) {
        ACTIVITY_TRACKER = _activityTracker;
    }
    
    function mint() external {
        uint256 tokenId = nextTokenId++;
        owners[tokenId] = msg.sender;
        balanceOf[msg.sender]++;
        
        emit Transfer(address(0), msg.sender, tokenId);
        
        // Notify MetaScore
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            msg.sender,
            "nft",
            20,
            "NFT Minting"
        );
    }
    
    function transfer(address to, uint256 tokenId) external {
        require(owners[tokenId] == msg.sender, "Not owner");
        require(to != address(0), "Invalid recipient");
        
        owners[tokenId] = to;
        balanceOf[msg.sender]--;
        balanceOf[to]++;
        
        // Clear approvals
        delete tokenApprovals[tokenId];
        
        emit Transfer(msg.sender, to, tokenId);
        
        // Track NFT trading
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            msg.sender,
            "nft",
            15,
            "NFT Transfer"
        );
    }
    
    function approve(address approved, uint256 tokenId) external {
        require(owners[tokenId] == msg.sender, "Not owner");
        
        tokenApprovals[tokenId] = approved;
        emit Approval(msg.sender, approved, tokenId);
        
        // Track NFT marketplace activity
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            msg.sender,
            "nft",
            8,
            "NFT Approval"
        );
    }
    
    function setApprovalForAll(address operator, bool approved) external {
        operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
        
        // Track advanced NFT activity
        IActivityTracker(ACTIVITY_TRACKER).trackActivity(
            msg.sender,
            "nft",
            10,
            "NFT Operator Approval"
        );
    }
    
    // View functions
    function ownerOf(uint256 tokenId) external view returns (address) {
        address owner = owners[tokenId];
        require(owner != address(0), "Token does not exist");
        return owner;
    }
    
    function getApproved(uint256 tokenId) external view returns (address) {
        require(owners[tokenId] != address(0), "Token does not exist");
        return tokenApprovals[tokenId];
    }
    
    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return operatorApprovals[owner][operator];
    }
    
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(owners[tokenId] != address(0), "Token does not exist");
        return string(abi.encodePacked(
            'data:application/json;base64,eyJuYW1lIjoiRGVtbyBORlQgIw==',
            tokenId,
            '","description":"Demo NFT for MetaScore testing"}'
        ));
    }
}
