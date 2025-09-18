// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./interfaces/IVisualEngine.sol";
import "./libraries/Base64.sol";
import "./utils/Strings.sol";

contract VisualEngine is IVisualEngine {
    using Strings for uint256;

    // Tier definitions
    string[5] private tierNames = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
    string[5] private tierColors = ["#CD7F32", "#C0C0C0", "#FFD700", "#E5E4E2", "#B9F2FF"];
    
    function generateSVG(
        uint256 totalScore,
        uint256 defiScore,
        uint256 nftScore,
        uint256 socialScore, 
        uint256 developerScore,
        uint8 tier,
        uint256 streak
    ) external view override returns (string memory) {  // Changed from pure to view
        
        string memory tierColor = _getTierColor(tier);
        string memory backgroundColor = _getBackgroundColor(tier);
        
        return string(abi.encodePacked(
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
            '<defs>',
            _generateGradients(tierColor),  // Removed unused tier parameter
            '</defs>',
            
            // Background
            '<rect width="400" height="400" fill="', backgroundColor, '"/>',
            
            // Base shape based on tier
            _generateBaseShape(tier, tierColor),
            
            // Category indicators
            _generateCategoryElements(defiScore, nftScore, socialScore, developerScore),
            
            // Aura effect for high tiers
            tier >= 2 ? _generateAura(tier) : '',
            
            // Score display
            '<text x="200" y="350" text-anchor="middle" fill="white" font-size="24" font-weight="bold">',
            'Score: ', totalScore.toString(),
            '</text>',
            
            // Tier badge
            '<text x="200" y="380" text-anchor="middle" fill="', tierColor, '" font-size="16">',
            tierNames[tier],  // This now works because function is view
            '</text>',
            
            // Streak indicator
            streak > 7 ? _generateStreakIndicator(streak) : '',
            
            '</svg>'
        ));
    }
    
    function _getTierColor(uint8 tier) private pure returns (string memory) {
        if (tier == 0) return "#CD7F32"; // Bronze
        if (tier == 1) return "#C0C0C0"; // Silver  
        if (tier == 2) return "#FFD700"; // Gold
        if (tier == 3) return "#E5E4E2"; // Platinum
        return "#B9F2FF"; // Diamond
    }
    
    function _getBackgroundColor(uint8 tier) private pure returns (string memory) {
        if (tier == 0) return "#2C1810"; // Dark bronze
        if (tier == 1) return "#1C1C1C"; // Dark silver
        if (tier == 2) return "#332800"; // Dark gold  
        if (tier == 3) return "#2A2A2A"; // Dark platinum
        return "#001A33"; // Dark diamond
    }
    
    function _generateGradients(string memory tierColor) private pure returns (string memory) {  // Removed unused tier parameter
        return string(abi.encodePacked(
            '<radialGradient id="tierGradient" cx="50%" cy="50%" r="50%">',
            '<stop offset="0%" stop-color="', tierColor, '" stop-opacity="0.8"/>',
            '<stop offset="100%" stop-color="', tierColor, '" stop-opacity="0.3"/>',
            '</radialGradient>',
            '<linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="', tierColor, '" stop-opacity="0.6"/>',
            '<stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.2"/>',
            '<stop offset="100%" stop-color="', tierColor, '" stop-opacity="0.6"/>',
            '</linearGradient>'
        ));
    }
    
    function _generateBaseShape(uint8 tier, string memory tierColor) private pure returns (string memory) {
        if (tier == 0) {
            // Bronze: Simple circle
            return string(abi.encodePacked(
                '<circle cx="200" cy="200" r="120" fill="url(#tierGradient)" stroke="', tierColor, '" stroke-width="3"/>'
            ));
        } else if (tier == 1) {
            // Silver: Hexagon  
            return string(abi.encodePacked(
                '<polygon points="200,80 290,140 290,260 200,320 110,260 110,140" ',
                'fill="url(#tierGradient)" stroke="', tierColor, '" stroke-width="3"/>'
            ));
        } else if (tier == 2) {
            // Gold: Star
            return string(abi.encodePacked(
                '<polygon points="200,90 220,150 280,150 235,195 255,255 200,220 145,255 165,195 120,150 180,150" ',
                'fill="url(#tierGradient)" stroke="', tierColor, '" stroke-width="3"/>'
            ));
        } else if (tier == 3) {
            // Platinum: Complex geometric
            return string(abi.encodePacked(
                '<polygon points="200,80 260,120 280,180 240,240 200,220 160,240 120,180 140,120" ',
                'fill="url(#tierGradient)" stroke="', tierColor, '" stroke-width="3"/>',
                '<circle cx="200" cy="180" r="60" fill="none" stroke="', tierColor, '" stroke-width="2"/>'
            ));
        } else {
            // Diamond: Multi-layered
            return string(abi.encodePacked(
                '<polygon points="200,70 270,130 270,230 200,290 130,230 130,130" ',
                'fill="url(#tierGradient)" stroke="', tierColor, '" stroke-width="4"/>',
                '<polygon points="200,100 240,140 240,220 200,260 160,220 160,140" ',
                'fill="none" stroke="#FFFFFF" stroke-width="2"/>',
                '<circle cx="200" cy="180" r="30" fill="', tierColor, '" opacity="0.7"/>'
            ));
        }
    }
    
    function _generateCategoryElements(
        uint256 defiScore,
        uint256 nftScore, 
        uint256 socialScore,
        uint256 developerScore
    ) private pure returns (string memory) {
        string memory elements = "";
        
        // DeFi indicator (blue) - top right
        if (defiScore > 10) {
            uint256 size = defiScore / 10 + 8;
            elements = string(abi.encodePacked(elements,
                '<circle cx="320" cy="80" r="', size.toString(), 
                '" fill="#0066FF" opacity="0.7"/>',
                '<text x="320" y="85" text-anchor="middle" fill="white" font-size="12">DeFi</text>'
            ));
        }
        
        // NFT indicator (purple) - top left  
        if (nftScore > 15) {
            uint256 rectSize = nftScore / 5 + 15;
            uint256 x = 80 - rectSize / 2;
            uint256 y = 80 - rectSize / 2;
            elements = string(abi.encodePacked(elements,
                '<rect x="', x.toString(), '" y="', y.toString(), 
                '" width="', rectSize.toString(), '" height="', rectSize.toString(),
                '" fill="#9900CC" opacity="0.7" rx="3"/>',
                '<text x="80" y="85" text-anchor="middle" fill="white" font-size="12">NFT</text>'
            ));
        }
        
        // Social indicator (green) - bottom left
        if (socialScore > 10) {
            uint256 triangleSize = socialScore / 5 + 15;
            elements = string(abi.encodePacked(elements,
                '<polygon points="80,320 ', (60 + triangleSize).toString(), ',300 100,340" ',
                'fill="#00CC66" opacity="0.7"/>',
                '<text x="80" y="325" text-anchor="middle" fill="white" font-size="12">Social</text>'
            ));
        }
        
        // Developer indicator (orange) - bottom right
        if (developerScore > 20) {
            elements = string(abi.encodePacked(elements,
                '<polygon points="320,300 340,320 320,340 300,320" fill="#FF6600" opacity="0.8"/>',
                '<text x="320" y="325" text-anchor="middle" fill="white" font-size="12">Dev</text>'
            ));
        }
        
        return elements;
    }
    
    function _generateAura(uint8 tier) private pure returns (string memory) {
        if (tier < 2) return "";
        
        uint256 auraSize = 140 + (tier - 2) * 20;
        
        return string(abi.encodePacked(
            '<circle cx="200" cy="200" r="', auraSize.toString(),
            '" fill="none" stroke="url(#auraGradient)" stroke-width="6" opacity="0.6">',
            '<animate attributeName="r" values="', auraSize.toString(), ';', (auraSize + 10).toString(), ';', auraSize.toString(),
            '" dur="3s" repeatCount="indefinite"/>',
            '</circle>'
        ));
    }
    
    function _generateStreakIndicator(uint256 streak) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<rect x="10" y="10" width="80" height="30" fill="#FF4444" rx="5"/>',
            '<text x="50" y="30" text-anchor="middle" fill="white" font-size="14" font-weight="bold">',
            streak.toString(), ' days',
            '</text>'
        ));
    }
    
    function generateMetadata(
        uint256 tokenId,
        uint256 totalScore,
        uint256 defiScore,
        uint256 nftScore,
        uint256 socialScore,
        uint256 developerScore,
        uint8 tier,
        uint256 streak
    ) external view override returns (string memory) {  // Changed from pure to view
        string memory svg = this.generateSVG(totalScore, defiScore, nftScore, socialScore, developerScore, tier, streak);
        string memory svgBase64 = Base64.encode(bytes(svg));
        
        return string(abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(bytes(abi.encodePacked(
                '{"name":"MetaScore #', tokenId.toString(), '",',
                '"description":"Living Achievement NFT that evolves based on onchain activity on Somnia blockchain",',
                '"image":"data:image/svg+xml;base64,', svgBase64, '",',
                '"attributes":[',
                '{"trait_type":"Total Score","value":', totalScore.toString(), '},',
                '{"trait_type":"Tier","value":"', tierNames[tier], '"},',  // This now works because function is view
                '{"trait_type":"DeFi Score","value":', defiScore.toString(), '},',
                '{"trait_type":"NFT Score","value":', nftScore.toString(), '},',
                '{"trait_type":"Social Score","value":', socialScore.toString(), '},',
                '{"trait_type":"Developer Score","value":', developerScore.toString(), '},',
                '{"trait_type":"Streak Days","value":', streak.toString(), '}',
                ']}'
            )))
        ));
    }
}
