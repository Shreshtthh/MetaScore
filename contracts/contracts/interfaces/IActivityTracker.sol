// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface IActivityTracker {
    // Only function signatures - NO EVENTS OR STRUCTS
    
    function trackActivity(
        address user, 
        string memory category, 
        uint256 points, 
        string memory action
    ) external;
    
    function verifyContract(
        address contractAddress, 
        string memory category, 
        uint256 basePoints
    ) external;
    
    function isVerifiedContract(address contractAddress) external view returns (bool);
}
