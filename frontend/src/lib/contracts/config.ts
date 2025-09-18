import { defineChain } from 'viem'
import { ContractAddresses } from '@/types/contracts'

// Somnia Testnet Chain Definition
export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://shannon-explorer.somnia.network',
    },
  },
})

// Contract Addresses
export const CONTRACT_ADDRESSES: ContractAddresses = {
  MetaScore: process.env.NEXT_PUBLIC_METASCORE_CONTRACT as `0x${string}`,
  VisualEngine: process.env.NEXT_PUBLIC_VISUAL_ENGINE_CONTRACT as `0x${string}`,
  ActivityTracker: process.env.NEXT_PUBLIC_ACTIVITY_TRACKER_CONTRACT as `0x${string}`,
  DemoNFT: process.env.NEXT_PUBLIC_DEMO_NFT_CONTRACT as `0x${string}`,
  DemoToken: process.env.NEXT_PUBLIC_DEMO_TOKEN_CONTRACT as `0x${string}`,
  PaymentContract: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT as `0x${string}`,
}

// Validate contract addresses
export function validateContractAddresses(): boolean {
  const addresses = Object.values(CONTRACT_ADDRESSES);
  return addresses.every(addr => addr && addr.startsWith('0x') && addr.length === 42);
}

// Network configuration
export const NETWORK_CONFIG = {
  chainId: somniaTestnet.id,
  name: somniaTestnet.name,
  rpcUrl: somniaTestnet.rpcUrls.default.http[0],
  explorerUrl: somniaTestnet.blockExplorers.default.url,
  nativeCurrency: somniaTestnet.nativeCurrency,
} as const;

// Transaction settings
export const TX_CONFIG = {
  confirmations: 1,
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  gasLimitMultiplier: 1.2, // 20% buffer for gas estimation
} as const;
