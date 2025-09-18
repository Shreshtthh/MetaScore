import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatUnits, parseUnits } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format blockchain values
export function formatScore(score: bigint): string {
  return score.toString();
}

export function formatTokenAmount(amount: bigint, decimals = 18): string {
  return parseFloat(formatUnits(amount, decimals)).toFixed(4);
}

export function parseTokenAmount(amount: string, decimals = 18): bigint {
  try {
    return parseUnits(amount, decimals);
  } catch {
    return BigInt(0);
  }
}

// Address utilities
export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Time utilities
export function formatTimestamp(timestamp: bigint | number): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
}

export function timeAgo(timestamp: bigint | number): string {
  const now = Date.now();
  const time = Number(timestamp) * 1000;
  const diff = now - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

// Score utilities
export function calculateTier(totalScore: bigint): number {
  const score = Number(totalScore);
  if (score >= 500) return 4; // Diamond
  if (score >= 300) return 3; // Platinum
  if (score >= 150) return 2; // Gold
  if (score >= 50) return 1;  // Silver
  return 0; // Bronze
}

export function getNextTierThreshold(currentTier: number): number {
  const thresholds = [50, 150, 300, 500];
  return thresholds[currentTier] || 0;
}

export function calculateProgressToNextTier(score: bigint, currentTier: number): number {
  const currentScore = Number(score);
  const thresholds = [0, 50, 150, 300, 500];
  
  if (currentTier >= 4) return 100; // Max tier
  
  const currentThreshold = thresholds[currentTier];
  const nextThreshold = thresholds[currentTier + 1];
  
  return ((currentScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
}

// Category utilities
export function getCategoryPercentage(categoryScore: bigint, totalScore: bigint): number {
  if (totalScore === BigInt(0)) return 0;
  return (Number(categoryScore) / Number(totalScore)) * 100;
}

// Animation utilities
export function getRandomDelay(): number {
  return Math.random() * 0.5;
}

export function getStaggerDelay(index: number, baseDelay = 0.1): number {
  return index * baseDelay;
}

// Error handling
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

// Local storage utilities
export function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to store value for key ${key}:`, error);
  }
}

// Color utilities
export function getTierColor(tier: number): string {
  const colors = ['#CD7F32', '#C0C0C0', '#FFD700', '#E5E4E2', '#B9F2FF'];
  return colors[tier] || colors[0];
}

export function getCategoryColor(category: string): string {
  const colors = {
    defi: '#0066FF',
    nft: '#9900CC',
    social: '#00CC66',
    developer: '#FF6600',
  };
  return colors[category as keyof typeof colors] || '#888888';
}

// Validation utilities
export function validatePositiveNumber(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

export function validateInteger(value: string): boolean {
  return /^\d+$/.test(value);
}

// URL utilities - FIXED EXPLORER FUNCTIONS
export function getExplorerUrl(hash: string, type: 'tx' | 'address' = 'tx'): string {
  const baseUrl = 'https://shannon-explorer.somnia.network';
  return `${baseUrl}/${type}/${hash}`;
}

// MetaScore-specific explorer functions
export function getMetaScoreContractUrl(): string {
  return getExplorerUrl('0x1ba97a3e916422574053aed16a5d1b8e14b160b4', 'address');
}

export function getTokenExplorerUrl(contractAddress: string, tokenId: string): string {
  return `https://shannon-explorer.somnia.network/token/${contractAddress}?a=${tokenId}`;
}

export function getNFTExplorerUrl(contractAddress: string, tokenId: string): string {
  // For NFT-specific view - try different formats based on explorer capabilities
  return `https://shannon-explorer.somnia.network/token/${contractAddress}/instance/${tokenId}`;
}

export function getContractTokenUrl(contractAddress: string): string {
  return `https://shannon-explorer.somnia.network/token/${contractAddress}`;
}

// Transaction explorer
export function getTxExplorerUrl(txHash: string): string {
  return getExplorerUrl(txHash, 'tx');
}

// Address explorer
export function getAddressExplorerUrl(address: string): string {
  return getExplorerUrl(address, 'address');
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
