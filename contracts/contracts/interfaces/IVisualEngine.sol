// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface IVisualEngine {
    function generateSVG(
        uint256 totalScore,
        uint256 defiScore,
        uint256 nftScore,
        uint256 socialScore,
        uint256 developerScore,
        uint8 tier,
        uint256 streak
    ) external view returns (string memory);  // Changed from pure to view
    
    function generateMetadata(
        uint256 tokenId,
        uint256 totalScore,
        uint256 defiScore,
        uint256 nftScore,
        uint256 socialScore,
        uint256 developerScore,
        uint8 tier,
        uint256 streak
    ) external view returns (string memory);  // Changed from pure to view
}
