export const APP_CONFIG = {
  name: 'MetaScore',
  description: 'Living Achievement NFT that evolves based on on-chain activity',
  version: '1.0.0',
  author: 'Somnia Developer',
  url: 'https://metascore.somnia.network',
} as const;

export const UI_CONFIG = {
  animations: {
    enabled: true,
    duration: 300,
    easing: 'ease-in-out',
  },
  toast: {
    duration: 4000,
    position: 'top-right' as const,
  },
  pagination: {
    itemsPerPage: 20,
  },
} as const;

export const DEMO_CONFIG = {
  activities: [
    {
      category: 'nft',
      action: 'NFT Minting',
      points: 20,
      description: 'Mint a demo NFT to earn points',
    },
    {
      category: 'nft',
      action: 'NFT Transfer',
      points: 15,
      description: 'Transfer NFT to another address',
    },
    {
      category: 'defi',
      action: 'Token Minting',
      points: 15,
      description: 'Mint demo tokens',
    },
    {
      category: 'defi',
      action: 'Token Transfer',
      points: 10,
      description: 'Transfer tokens to earn points',
    },
    {
      category: 'social',
      action: 'Donation',
      points: 25,
      description: 'Make a donation through the payment contract',
    },
    {
      category: 'social',
      action: 'P2P Payment',
      points: 15,
      description: 'Send payment to another user',
    },
  ],
} as const;

export const QUERY_KEYS = {
  userMetaScore: 'userMetaScore',
  userActivities: 'userActivities',
  leaderboard: 'leaderboard',
  dashboardStats: 'dashboardStats',
  contractInfo: 'contractInfo',
} as const;

export const LOCAL_STORAGE_KEYS = {
  theme: 'metascore-theme',
  welcomeShown: 'metascore-welcome-shown',
  notifications: 'metascore-notifications',
} as const;

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;
