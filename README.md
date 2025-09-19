# MetaScore 🏆

**Living NFTs that evolve with your on-chain journey**

MetaScore is a revolutionary reputation system that transforms your on-chain activity into dynamic, evolving NFTs. Built specifically for the Somnia ecosystem, it creates soulbound tokens that visually represent your Web3 identity through completely on-chain generated art.

<img width="1024" height="1024" alt="MetaScore_logo" src="https://github.com/user-attachments/assets/38eaa4a4-47c5-4112-9ef3-2855bc3281bb" />


## 🌟 What Makes MetaScore Special

- **🎨 Living NFTs**: Your NFT evolves in real-time based on your on-chain actions
- **⛓️ Fully On-Chain**: Both logic and visuals are generated and stored entirely on-chain
- **🛡️ Soulbound**: Non-transferable tokens that represent your authentic Web3 identity
- **📊 Multi-Dimensional Scoring**: Track DeFi, NFT, Social, and Developer activities separately
- **🚀 Anti-Spam Protection**: Sophisticated mechanisms ensure genuine activity rewards
- **⚡ Somnia-Optimized**: Leverages Somnia's 1M+ TPS for real-time updates

## 🏗️ Architecture

### Smart Contract System

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MetaScore.sol │    │ ActivityTracker  │    │ VisualEngine.sol│
│                 │    │      .sol        │    │                 │
│ • ERC721 NFTs   │◄───┤                  │◄───┤ • SVG Generation│
│ • Soulbound     │    │ • Score Logic    │    │ • Dynamic Art   │
│ • Tier System   │    │ • Anti-Spam      │    │ • Metadata      │
│ • User Data     │    │ • Verification   │    │ • Tier Visuals  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Partner dApps   │
                    │                  │
                    │ • DEX Protocols  │
                    │ • NFT Markets    │
                    │ • Gaming dApps   │
                    │ • Social Platforms│
                    └──────────────────┘
```

## 📊 Tier System & Scoring

### Tier Progression
| Tier | Points Required | Visual Evolution |
|------|----------------|------------------|
| 🥉 Bronze | 0 - 49 | Simple circle, basic colors |
| 🥈 Silver | 50 - 149 | Hexagon shape, silver tones |
| 🥇 Gold | 150 - 299 | Star shape, gold colors + aura |
| 💎 Platinum | 300 - 499 | Complex geometry + enhanced aura |
| 💠 Diamond | 500+ | Multi-layered design + premium effects |

### Scoring Categories
- **🏦 DeFi**: Trading, lending, staking activities
- **🖼️ NFT**: Minting, trading, creating digital assets
- **👥 Social**: Governance, community participation
- **👨‍💻 Developer**: Contract deployment, contributions

### Anti-Spam Mechanics
```solidity
// Daily activity limits with diminishing returns
1-5 Activities:   100% points
6-10 Activities:  75% points  
11-20 Activities: 50% points
21+ Activities:   25% points
```

## 🚀 Deployed Contracts (Somnia Testnet)

| Contract | Address |
|----------|---------|
| **MetaScore** | `0x1ba97a3e916422574053aed16a5d1b8e14b160b4` |
| **ActivityTracker** | `0xe290ea8e5d6b6d42fc7e61b1f96ff764b4983486` |
| **VisualEngine** | `0x7420aa5e5bf9d1f4ea543bc0c60ada179e9cd6ee` |

### Demo Contracts
| Contract | Address |
|----------|---------|
| **DemoToken** | `0x94499a367b48f8f0b857eebe6a0b7e480ce9abf1` |
| **DemoNFT** | `0xfcf8195b4abc2006a1f6b1c59e29c9e2c06407e0` |
| **PaymentContract** | `0x2f7c52f978c1ae91fcdc708d071d144ff9d394a6` |

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity
- **Development**: Hardhat
- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Ethers.js/Viem
- **Network**: Somnia Testnet

## ⚡ How It Works

### 1. Automatic NFT Creation
```solidity
// First interaction automatically mints your MetaScore NFT
function trackActivity(address user, string memory category, uint256 points, string memory action) 
    external onlyVerified {
    
    if (!metaScore.exists(user)) {
        metaScore.mintToUser(user); // Auto-mint on first activity
    }
    
    _updateScore(user, category, points);
}
```

### 2. Dynamic Visual Generation
```solidity
// SVG generated entirely on-chain based on user data
function generateSVG(address user) public view returns (string memory) {
    UserData memory userData = metaScore.getUserData(user);
    
    string memory baseShape = _getTierShape(userData.tier);
    string memory categoryIndicators = _getCategoryVisuals(userData.scores);
    string memory auraEffect = _getAuraEffect(userData.tier);
    
    return string(abi.encodePacked(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">',
        baseShape,
        categoryIndicators,
        auraEffect,
        '</svg>'
    ));
}
```

### 3. Real-Time Metadata Updates
```solidity
function tokenURI(uint256 tokenId) public view override returns (string memory) {
    // Generates fresh metadata every time it's called
    return visualEngine.generateMetadata(ownerOf(tokenId));
}
```

## 🎮 Getting Started

### For Users

1. **Connect Wallet** to the MetaScore dApp
2. **Interact** with verified Somnia dApps
3. **Watch** your NFT evolve in real-time
4. **Climb** the leaderboard and unlock higher tiers

### For Developers

```javascript
// Integration example
import { ActivityTracker } from '@metascore/sdk';

const tracker = new ActivityTracker('0xe290ea8e5d6b6d42fc7e61b1f96ff764b4983486');

// Track user activity in your dApp
await tracker.trackActivity(
    userAddress, 
    'defi',        // category
    25,            // points
    'Token Swap'   // action description
);
```

### Smart Contract Integration

```solidity
import "./interfaces/IActivityTracker.sol";

contract YourDApp {
    IActivityTracker public metaScoreTracker;
    
    constructor(address _tracker) {
        metaScoreTracker = IActivityTracker(_tracker);
    }
    
    function yourFunction() external {
        // Your dApp logic here
        
        // Award MetaScore points
        metaScoreTracker.trackActivity(
            msg.sender,
            "defi",
            calculatePoints(),
            "DeFi Action"
        );
    }
}
```

## 🌐 Ecosystem Integration

MetaScore is designed as infrastructure for the entire Somnia ecosystem:

### For dApps
- **Easy Integration**: Simple SDK for tracking user activity
- **User Insights**: Understand your most engaged users
- **Tier-Based Features**: Offer benefits based on MetaScore tiers

### For Users
- **Universal Identity**: One NFT represents your entire Web3 journey
- **Visual Progression**: See your growth across all platforms
- **Social Status**: Display your achievements and expertise

### Integration Benefits

```solidity
// Example: Tier-based benefits in your dApp
function getTradingFee(address user) public view returns (uint256) {
    uint8 tier = metaScore.getUserTier(user);
    
    if (tier >= 4) return 0.05%; // Diamond tier: 0.05% fee
    if (tier >= 3) return 0.1%;  // Platinum tier: 0.1% fee
    if (tier >= 2) return 0.15%; // Gold tier: 0.15% fee
    return 0.3%; // Standard: 0.3% fee
}
```

## 📈 Scaling Strategy

### Phase 1: Partner Integration
- SDK development for easy integration
- Partnership with major Somnia dApps
- Tier-based benefit programs

### Phase 2: Event-Based Tracking
- Automatic activity detection
- Transaction monitoring service
- Contract registry for known protocols

### Phase 3: AI-Powered Detection
- Pattern recognition for complex activities
- Dynamic point calculation
- Advanced anti-gaming mechanisms

## 🔒 Security Features

- **Soulbound Design**: Prevents score manipulation through trading
- **Anti-Spam Protection**: Diminishing returns prevent transaction spam
- **Verified Contracts**: Only approved contracts can award points
- **On-Chain Logic**: No centralized servers or databases

## 🎯 Future Roadmap

- [ ] **Governance Integration**: DAOs using MetaScore for voting weights
- [ ] **Cross-Chain Expansion**: Bridge scores across multiple networks
- [ ] **AI Activity Recognition**: Automatic detection of complex activities
- [ ] **Achievement System**: Special badges for milestone accomplishments
- [ ] **Reputation Marketplace**: dApps competing for high-tier users

## 📱 Demo Experience

Try the interactive demo to see how MetaScore works:

1. Visit the demo page in the dApp
2. Interact with demo contracts (DemoToken, DemoNFT, PaymentContract)
3. Watch your MetaScore NFT change in real-time
4. Experience tier progression and visual evolution

## 🏆 Why MetaScore Wins

### Innovation
- First fully on-chain, dynamic reputation system
- Novel "living NFT" concept with real utility
- Sophisticated anti-gaming mechanisms

### Technical Excellence
- Deployed and functional on Somnia Testnet
- Modular, extensible architecture
- Gas-optimized smart contracts

### User Experience
- Intuitive visual progression
- Real-time updates and feedback
- Gamified engagement system

### Ecosystem Value
- Foundation for other dApps to build upon
- Increases overall network activity
- Creates sticky user experiences

## 🤝 Contributing

We welcome contributions! Areas of focus:

- Additional visual effects and animations
- New scoring categories and mechanics
- Integration SDKs for different frameworks
- Advanced analytics and insights

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Somnia Documentation**: [docs.somnia.network](https://docs.somnia.network)
- **Contract Verification**: Check on Somnia Explorer
- **Demo Video**: [Coming Soon]

---

*Built with ❤️ for the Somnia ecosystem*
