// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface IMetaScore {
    // Remove structs and events from interface - they should only be in the main contract
    
    function mintForUser(address user) external returns (uint256);
    function updateScore(uint256 tokenId, string memory category, uint256 points) external;
    function getUserTokenId(address user) external view returns (uint256);
    function getScoreData(uint256 tokenId) external view returns (uint256, uint256, uint256, uint8);
    function getCategoryScore(uint256 tokenId, string memory category) external view returns (uint256);
    function getAllCategoryScores(uint256 tokenId) external view returns (uint256, uint256, uint256, uint256);
}
