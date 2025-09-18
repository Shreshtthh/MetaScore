// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IActivityTracker.sol";
import "./interfaces/IMetaScore.sol";

contract ActivityTracker is Ownable, ReentrancyGuard, IActivityTracker {
    
    IMetaScore public metaScore;
    
    // Contract verification
    mapping(address => bool) public verifiedContracts;
    mapping(address => string) public contractCategories;
    mapping(address => uint256) public contractBasePoints;
    
    // Activity tracking
    mapping(address => uint256) public lastActivityTimestamp;
    mapping(address => uint256) public dailyActivityCount;
    
    // Rate limiting
    mapping(address => uint256) public lastTrackingBlock;
    uint256 public constant MIN_TRACKING_INTERVAL = 3; // 3 blocks between tracking calls
    
    // Events
    event ActivityTracked(
        address indexed user, 
        string category, 
        uint256 points, 
        string action,
        address contractAddress
    );
    
    event ContractVerified(address indexed contractAddress, string category, uint256 basePoints);
    
    constructor(address _metaScore) {
        _transferOwnership(msg.sender);
        metaScore = IMetaScore(_metaScore);
    }
    
    // Modifiers
    modifier rateLimited() {
        require(
            block.number >= lastTrackingBlock[msg.sender] + MIN_TRACKING_INTERVAL,
            "Too frequent tracking calls"
        );
        lastTrackingBlock[msg.sender] = block.number;
        _;
    }

    // Admin functions
    function setMetaScore(address _metaScore) external onlyOwner {
        metaScore = IMetaScore(_metaScore);
    }
    
    function verifyContract(
        address contractAddress,
        string memory category,
        uint256 basePoints
    ) external onlyOwner {
        require(contractAddress != address(0), "Invalid contract address");
        require(bytes(category).length > 0, "Category cannot be empty");
        require(basePoints > 0 && basePoints <= 100, "Invalid points range");
        
        verifiedContracts[contractAddress] = true;
        contractCategories[contractAddress] = category;
        contractBasePoints[contractAddress] = basePoints;
        
        emit ContractVerified(contractAddress, category, basePoints);
    }
    
    function verifyMultipleContracts(
        address[] memory contracts,
        string[] memory categories,
        uint256[] memory points
    ) external onlyOwner {
        require(
            contracts.length == categories.length && 
            categories.length == points.length, 
            "Array length mismatch"
        );
        
        for (uint i = 0; i < contracts.length; i++) {
            require(contracts[i] != address(0), "Invalid contract address");
            require(bytes(categories[i]).length > 0, "Category cannot be empty");
            require(points[i] > 0 && points[i] <= 100, "Invalid points range");
            
            verifiedContracts[contracts[i]] = true;
            contractCategories[contracts[i]] = categories[i];
            contractBasePoints[contracts[i]] = points[i];
            
            emit ContractVerified(contracts[i], categories[i], points[i]);
        }
    }
    
    function removeVerifiedContract(address contractAddress) external onlyOwner {
        verifiedContracts[contractAddress] = false;
        delete contractCategories[contractAddress];
        delete contractBasePoints[contractAddress];
    }
    
    // Core tracking functions
    function trackActivity(
        address user,
        string memory category,
        uint256 points,
        string memory action
    ) external nonReentrant rateLimited {
        require(verifiedContracts[msg.sender], "Contract not verified");
        require(user != address(0), "Invalid user address");
        require(bytes(category).length > 0, "Category cannot be empty");
        require(points > 0 && points <= 100, "Invalid points range");
        
        // Get or create MetaScore NFT
        uint256 tokenId = metaScore.getUserTokenId(user);
        if (tokenId == 0) {
            tokenId = metaScore.mintForUser(user);
        }
        
        // Apply daily activity bonus/penalty
        uint256 adjustedPoints = _calculateAdjustedPoints(user, points);
        
        // Update MetaScore
        metaScore.updateScore(tokenId, category, adjustedPoints);
        
        // Update activity tracking
        _updateDailyActivity(user);
        
        emit ActivityTracked(user, category, adjustedPoints, action, msg.sender);
    }
    
    // Special function for contract deployment tracking
    function trackContractDeployment(address deployer, address newContract) external onlyOwner {
        require(deployer != address(0), "Invalid deployer address");
        require(newContract != address(0), "Invalid contract address");
        
        uint256 tokenId = metaScore.getUserTokenId(deployer);
        if (tokenId == 0) {
            tokenId = metaScore.mintForUser(deployer);
        }
        
        metaScore.updateScore(tokenId, "developer", 30);
        emit ActivityTracked(deployer, "developer", 30, "Contract Deployment", newContract);
    }
    
    // Batch tracking for multiple users
    function batchTrackActivity(
        address[] memory users,
        string memory category,
        uint256 points,
        string memory action
    ) external {
        require(verifiedContracts[msg.sender], "Contract not verified");
        require(users.length > 0 && users.length <= 50, "Invalid batch size");
        
        for (uint i = 0; i < users.length; i++) {
            if (users[i] != address(0)) {
                uint256 tokenId = metaScore.getUserTokenId(users[i]);
                if (tokenId == 0) {
                    tokenId = metaScore.mintForUser(users[i]);
                }
                
                uint256 adjustedPoints = _calculateAdjustedPoints(users[i], points);
                metaScore.updateScore(tokenId, category, adjustedPoints);
                _updateDailyActivity(users[i]);
                
                emit ActivityTracked(users[i], category, adjustedPoints, action, msg.sender);
            }
        }
    }
    
    // Internal functions
    function _calculateAdjustedPoints(address user, uint256 basePoints) private view returns (uint256) {
        // Check if user is very active today (diminishing returns)
        if (_isSameDay(lastActivityTimestamp[user], block.timestamp)) {
            uint256 activityCount = dailyActivityCount[user];
            if (activityCount > 20) {
                // Significant reduction for excessive activity (anti-spam)
                return basePoints / 4;
            } else if (activityCount > 10) {
                // Reduce points for high activity (anti-spam)
                return basePoints / 2;
            } else if (activityCount > 5) {
                // Slight reduction for moderate activity
                return (basePoints * 75) / 100;
            }
        }
        
        return basePoints;
    }
    
    function _updateDailyActivity(address user) private {
        if (_isSameDay(lastActivityTimestamp[user], block.timestamp)) {
            dailyActivityCount[user]++;
        } else {
            dailyActivityCount[user] = 1;
            lastActivityTimestamp[user] = block.timestamp;
        }
    }
    
    function _isSameDay(uint256 timestamp1, uint256 timestamp2) private pure returns (bool) {
        return (timestamp1 / 86400) == (timestamp2 / 86400);
    }
    
    // View functions
    function isVerifiedContract(address contractAddress) external view override returns (bool) {
        return verifiedContracts[contractAddress];
    }
    
    function getContractInfo(address contractAddress) external view returns (
        bool verified,
        string memory category,
        uint256 basePoints
    ) {
        return (
            verifiedContracts[contractAddress],
            contractCategories[contractAddress],
            contractBasePoints[contractAddress]
        );
    }
    
    function getUserActivityToday(address user) external view returns (uint256) {
        if (_isSameDay(lastActivityTimestamp[user], block.timestamp)) {
            return dailyActivityCount[user];
        }
        return 0;
    }
    
    function getAdjustedPoints(address user, uint256 basePoints) external view returns (uint256) {
        return _calculateAdjustedPoints(user, basePoints);
    }
}
