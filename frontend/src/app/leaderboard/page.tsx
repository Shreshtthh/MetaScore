'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Users, Filter } from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TIER_INFO, CATEGORY_INFO } from '@/types/contracts';
import { shortenAddress, getTierColor, getCategoryColor } from '@/lib/utils';

// Mock leaderboard data - replace with real data from your backend/subgraph
const mockLeaderboardData = [
  {
    rank: 1,
    address: '0x1234567890123456789012345678901234567890',
    ensName: 'alice.eth',
    totalScore: BigInt(750),
    tier: 4,
    categoryScores: { defi: BigInt(200), nft: BigInt(300), social: BigInt(150), developer: BigInt(100) },
  },
  {
    rank: 2,
    address: '0x2345678901234567890123456789012345678901',
    ensName: 'bob.eth',
    totalScore: BigInt(520),
    tier: 4,
    categoryScores: { defi: BigInt(150), nft: BigInt(200), social: BigInt(100), developer: BigInt(70) },
  },
  {
    rank: 3,
    address: '0x3456789012345678901234567890123456789012',
    totalScore: BigInt(480),
    tier: 3,
    categoryScores: { defi: BigInt(180), nft: BigInt(150), social: BigInt(90), developer: BigInt(60) },
  },
  {
    rank: 4,
    address: '0x4567890123456789012345678901234567890123',
    totalScore: BigInt(420),
    tier: 3,
    categoryScores: { defi: BigInt(120), nft: BigInt(180), social: BigInt(80), developer: BigInt(40) },
  },
  {
    rank: 5,
    address: '0x5678901234567890123456789012345678901234',
    totalScore: BigInt(380),
    tier: 3,
    categoryScores: { defi: BigInt(100), nft: BigInt(160), social: BigInt(70), developer: BigInt(50) },
  },
];

interface LeaderboardEntry {
  rank: number;
  address: string;
  ensName?: string;
  totalScore: bigint;
  tier: number;
  categoryScores: {
    defi: bigint;
    nft: bigint;
    social: bigint;
    developer: bigint;
  };
}

export default function LeaderboardPage() {
  const [filterTier, setFilterTier] = useState<number | null>(null);
  const [sortCategory, setSortCategory] = useState<string>('total');

  const filteredAndSortedData = useMemo(() => {
    let data = [...mockLeaderboardData];

    // Filter by tier
    if (filterTier !== null) {
      data = data.filter(entry => entry.tier === filterTier);
    }

    // Sort by category
    if (sortCategory !== 'total') {
      data.sort((a, b) => {
        const aScore = Number(a.categoryScores[sortCategory as keyof typeof a.categoryScores]);
        const bScore = Number(b.categoryScores[sortCategory as keyof typeof b.categoryScores]);
        return bScore - aScore;
      });
      // Re-rank after sorting
      data.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    }

    return data;
  }, [filterTier, sortCategory]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-gold" />;
      case 2:
        return <Medal className="w-6 h-6 text-silver" />;
      case 3:
        return <Award className="w-6 h-6 text-bronze" />;
      default:
        return <span className="text-white/60 font-bold text-lg">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            See how you stack up against other MetaScore holders across all categories
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card glass>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-somnia-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {mockLeaderboardData.length}
              </div>
              <div className="text-white/60 text-sm">Total Users</div>
            </CardContent>
          </Card>

          <Card glass>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Number(mockLeaderboardData[0]?.totalScore || BigInt(0))}
              </div>
              <div className="text-white/60 text-sm">Highest Score</div>
            </CardContent>
          </Card>

          <Card glass>
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 text-diamond mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {mockLeaderboardData.filter(u => u.tier === 4).length}
              </div>
              <div className="text-white/60 text-sm">Diamond Tier</div>
            </CardContent>
          </Card>

          <Card glass>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-somnia-primary to-somnia-secondary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {Math.round(mockLeaderboardData.reduce((acc, user) => acc + Number(user.totalScore), 0) / mockLeaderboardData.length)}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.round(mockLeaderboardData.reduce((acc, user) => acc + Number(user.totalScore), 0) / mockLeaderboardData.length)}
              </div>
              <div className="text-white/60 text-sm">Average Score</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card glass>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5 text-white/60" />
                  <span className="text-white font-medium">Filters:</span>
                  
                  {/* Tier Filter */}
                  <select
                    value={filterTier ?? ''}
                    onChange={(e) => setFilterTier(e.target.value ? Number(e.target.value) : null)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-somnia-primary"
                  >
                    <option value="">All Tiers</option>
                    {TIER_INFO.map((tier) => (
                      <option key={tier.tier} value={tier.tier}>
                        {tier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-white font-medium">Sort by:</span>
                  <select
                    value={sortCategory}
                    onChange={(e) => setSortCategory(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-somnia-primary"
                  >
                    <option value="total">Total Score</option>
                    {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glass>
            <CardHeader>
              <CardTitle>Rankings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredAndSortedData.map((entry, index) => (
                  <motion.div
                    key={`${entry.address}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${
                      entry.rank <= 3 ? 'bg-white/5' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 flex justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">
                            {entry.ensName || shortenAddress(entry.address)}
                          </span>
                          <div
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${getTierColor(entry.tier)}20`,
                              color: getTierColor(entry.tier),
                              border: `1px solid ${getTierColor(entry.tier)}40`,
                            }}
                          >
                            {TIER_INFO[entry.tier].name}
                          </div>
                        </div>
                        <div className="text-sm text-white/60">
                          {shortenAddress(entry.address)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Category Scores */}
                      <div className="hidden md:flex items-center space-x-3">
                        {Object.entries(entry.categoryScores).map(([category, score]) => (
                          <div key={category} className="text-center">
                            <div
                              className="text-sm font-medium"
                              style={{ color: getCategoryColor(category) }}
                            >
                              {Number(score)}
                            </div>
                            <div className="text-xs text-white/40 uppercase">
                              {category}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total Score */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {Number(entry.totalScore)}
                        </div>
                        <div className="text-xs text-white/60">Total</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
