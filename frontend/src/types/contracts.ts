export interface ScoreData {
  totalScore: bigint;
  streakDays: bigint;
  lastActivityTimestamp: bigint;
  currentTier: number;
}

export interface CategoryScores {
  defi: bigint;
  nft: bigint;
  social: bigint;
  developer: bigint;
}

export interface UserMetaScore {
  tokenId: bigint;
  address: string;
  scoreData: ScoreData;
  categoryScores: CategoryScores;
  nftMetadata?: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

export interface ActivityEvent {
  user: string;
  category: string;
  points: bigint;
  action: string;
  contractAddress: string;
  timestamp: bigint;
  transactionHash: string;
  blockNumber: bigint;
}

export interface ContractAddresses {
  MetaScore: `0x${string}`;
  VisualEngine: `0x${string}`;
  ActivityTracker: `0x${string}`;
  DemoNFT: `0x${string}`;
  DemoToken: `0x${string}`;
  PaymentContract: `0x${string}`;
}

export interface TierInfo {
  tier: number;
  name: string;
  color: string;
  threshold: number;
  benefits: string[];
}

export const TIER_INFO: TierInfo[] = [
  {
    tier: 0,
    name: 'Bronze',
    color: '#CD7F32',
    threshold: 0,
    benefits: ['Basic Profile', 'Activity Tracking']
  },
  {
    tier: 1,
    name: 'Silver',
    color: '#C0C0C0',
    threshold: 50,
    benefits: ['Enhanced Profile', 'Weekly Rewards']
  },
  {
    tier: 2,
    name: 'Gold',
    color: '#FFD700',
    threshold: 150,
    benefits: ['Premium Features', 'Monthly Bonuses', 'Exclusive Events']
  },
  {
    tier: 3,
    name: 'Platinum',
    color: '#E5E4E2',
    threshold: 300,
    benefits: ['VIP Access', 'Priority Support', 'Beta Features']
  },
  {
    tier: 4,
    name: 'Diamond',
    color: '#B9F2FF',
    threshold: 500,
    benefits: ['Elite Status', 'Max Benefits', 'Governance Rights']
  }
];

export const CATEGORY_INFO = {
  defi: {
    name: 'DeFi',
    color: '#0066FF',
    icon: '💰',
    description: 'Decentralized Finance activities'
  },
  nft: {
    name: 'NFT',
    color: '#9900CC',
    icon: '🎨',
    description: 'Non-Fungible Token interactions'
  },
  social: {
    name: 'Social',
    color: '#00CC66',
    icon: '👥',
    description: 'Social and community engagement'
  },
  developer: {
    name: 'Developer',
    color: '#FF6600',
    icon: '⚡',
    description: 'Development and technical contributions'
  }
} as const;

export type CategoryType = keyof typeof CATEGORY_INFO;
