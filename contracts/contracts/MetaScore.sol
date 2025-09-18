// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IMetaScore.sol";
import "./interfaces/IVisualEngine.sol";

contract MetaScore is ERC721, Ownable, ReentrancyGuard, IMetaScore {
    using Strings for uint256;

    // Fixed struct - no mappings inside
    struct ScoreData {
        uint256 totalScore;
        uint256 streakDays;
        uint256 lastActivityTimestamp;
        uint8 currentTier;
        bool hasSpecialBadge;
    }

    // State variables
    uint256 private _tokenIdCounter = 1;
    IVisualEngine public visualEngine;
    
    // Mappings
    mapping(uint256 => ScoreData) private _scoreData;
    mapping(uint256 => mapping(string => uint256)) private _categoryScores; // Moved outside struct
    mapping(address => uint256) public userToTokenId;
    mapping(address => bool) public authorizedTrackers;
    
    // Rate limiting
    mapping(address => uint256) public lastActivityBlock;
    uint256 public constant MIN_BLOCK_INTERVAL = 5; // 5 blocks between activities
    
    // Category validation
    mapping(string => bool) public validCategories;
    
    // Tier thresholds
    uint256[5] public tierThresholds = [0, 50, 150, 300, 500]; // Bronze, Silver, Gold, Platinum, Diamond

        event ScoreUpdated(uint256 indexed tokenId, string category, uint256 points, uint256 newTotal);
    event TierUpgraded(uint256 indexed tokenId, uint8 newTier, address user);
    event StreakUpdated(uint256 indexed tokenId, uint256 newStreak, address user);
    
    constructor(address _visualEngine) ERC721("MetaScore", "META") {
        _transferOwnership(msg.sender);
        visualEngine = IVisualEngine(_visualEngine);
        
        // Initialize valid categories
        validCategories["defi"] = true;
        validCategories["nft"] = true;
        validCategories["social"] = true;
        validCategories["developer"] = true;
    }

    // Modifiers
    modifier onlyAuthorized() {
        require(authorizedTrackers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    modifier validCategory(string memory category) {
        require(validCategories[category], "Invalid category");
        _;
    }

    modifier rateLimited() {
        require(
            block.number >= lastActivityBlock[msg.sender] + MIN_BLOCK_INTERVAL, 
            "Too frequent activity"
        );
        lastActivityBlock[msg.sender] = block.number;
        _;
    }

    // Admin functions
    function setVisualEngine(address _visualEngine) external onlyOwner {
        visualEngine = IVisualEngine(_visualEngine);
    }
    
    function authorizeTracker(address tracker, bool authorized) external onlyOwner {
        authorizedTrackers[tracker] = authorized;
    }

    function addValidCategory(string memory category) external onlyOwner {
        validCategories[category] = true;
    }

    // Core functions
    function mintForUser(address user) external onlyAuthorized returns (uint256) {
        require(userToTokenId[user] == 0, "User already has MetaScore NFT");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(user, tokenId);
        
        userToTokenId[user] = tokenId;
        
        // Initialize score data
        ScoreData storage data = _scoreData[tokenId];
        data.totalScore = 0;
        data.streakDays = 1;
        data.lastActivityTimestamp = block.timestamp;
        data.currentTier = 0; // Bronze
        data.hasSpecialBadge = false;
        
        return tokenId;
    }
    
    function updateScore(
        uint256 tokenId, 
        string memory category, 
        uint256 points
    ) external onlyAuthorized validCategory(category) nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        ScoreData storage data = _scoreData[tokenId];
        
        // Update category score using separate mapping
        _categoryScores[tokenId][category] += points;
        data.totalScore += points;
        
        // Update streak
        _updateStreak(tokenId);
        
        // Check for tier upgrade
        uint8 newTier = _calculateTier(data.totalScore);
        if (newTier > data.currentTier) {
            data.currentTier = newTier;
            emit TierUpgraded(tokenId, newTier, ownerOf(tokenId));
        }
        
        emit ScoreUpdated(tokenId, category, points, data.totalScore);
    }
    
    function _updateStreak(uint256 tokenId) private {
        ScoreData storage data = _scoreData[tokenId];
        
        uint256 daysSinceLastActivity = (block.timestamp - data.lastActivityTimestamp) / 86400;
        
        if (daysSinceLastActivity == 0) {
            // Same day, no change to streak
            return;
        } else if (daysSinceLastActivity == 1) {
            // Next day, increment streak
            data.streakDays++;
        } else {
            // Streak broken, reset to 1
            data.streakDays = 1;
        }
        
        data.lastActivityTimestamp = block.timestamp;
        emit StreakUpdated(tokenId, data.streakDays, ownerOf(tokenId));
    }
    
    function _calculateTier(uint256 totalScore) private view returns (uint8) {
        for (uint8 i = 4; i > 0; i--) {
            if (totalScore >= tierThresholds[i]) {
                return i;
            }
        }
        return 0;
    }

    // View functions
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        ScoreData storage data = _scoreData[tokenId];
        
        return visualEngine.generateMetadata(
            tokenId,
            data.totalScore,
            _categoryScores[tokenId]["defi"],
            _categoryScores[tokenId]["nft"],
            _categoryScores[tokenId]["social"],
            _categoryScores[tokenId]["developer"],
            data.currentTier,
            data.streakDays
        );
    }
    
    function getUserTokenId(address user) external view override returns (uint256) {
        return userToTokenId[user];
    }
    
    function getScoreData(uint256 tokenId) external view override returns (
        uint256 totalScore,
        uint256 streakDays, 
        uint256 lastActivity,
        uint8 currentTier
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        ScoreData storage data = _scoreData[tokenId];
        return (
            data.totalScore,
            data.streakDays,
            data.lastActivityTimestamp,
            data.currentTier
        );
    }
    
    function getCategoryScore(uint256 tokenId, string memory category) external view override returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _categoryScores[tokenId][category];
    }

    function getAllCategoryScores(uint256 tokenId) external view returns (
        uint256 defi,
        uint256 nft,
        uint256 social,
        uint256 developer
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (
            _categoryScores[tokenId]["defi"],
            _categoryScores[tokenId]["nft"],
            _categoryScores[tokenId]["social"],
            _categoryScores[tokenId]["developer"]
        );
    }
    
    // Prevent transfers (soulbound)
    function transferFrom(address from, address to, uint256 tokenId) public override {
        require(from == address(0), "MetaScore NFTs are soulbound - transfers disabled");
        super.transferFrom(from, to, tokenId);
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        require(from == address(0), "MetaScore NFTs are soulbound - transfers disabled");
        super.safeTransferFrom(from, to, tokenId, data);
    }
}
