// API type definitions
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface LeaderboardEntry {
  rank: number
  address: string
  metaScore: number
  tier: string
  activities: number
}

export interface StatsResponse {
  totalUsers: number
  totalActivities: number
  averageScore: number
  topTier: string
}