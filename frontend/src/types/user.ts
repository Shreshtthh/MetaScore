import { CategoryScores, ScoreData } from './contracts';

export interface User {
  address: string;
  tokenId?: bigint;
  ensName?: string;
  avatar?: string;
  isConnected: boolean;
}

export interface UserStats extends User {
  scoreData: ScoreData;
  categoryScores: CategoryScores;
  rank?: number;
  percentile?: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  category: string;
  action: string;
  points: number;
  timestamp: number;
  transactionHash: string;
  blockNumber: number;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  ensName?: string;
  totalScore: bigint;
  tier: number;
  avatar?: string;
  categoryScores: CategoryScores;
}

export interface DashboardStats {
  totalUsers: number;
  totalScore: bigint;
  totalActivities: number;
  averageScore: number;
  topCategory: string;
}
