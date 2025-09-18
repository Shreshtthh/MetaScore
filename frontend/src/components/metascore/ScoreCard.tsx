'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Calendar, Star } from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { UserMetaScore } from '@/types/contracts';
import { TIER_INFO } from '@/types/contracts';
import { formatScore, calculateProgressToNextTier, timeAgo } from '@/lib/utils';

interface ScoreCardProps {
  userMetaScore: UserMetaScore | null;
  className?: string;
}

export default function ScoreCard({ userMetaScore, className }: ScoreCardProps) {
  if (!userMetaScore) {
    return (
      <Card className={className} glass>
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Star className="w-12 h-12 mx-auto text-white/40" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No MetaScore NFT</h3>
          <p className="text-white/60 text-sm">
            Start performing on-chain activities to mint your MetaScore NFT
          </p>
        </CardContent>
      </Card>
    );
  }

  const { scoreData, tokenId } = userMetaScore;
  const tierInfo = TIER_INFO[scoreData.currentTier];
  const progressToNext = calculateProgressToNextTier(scoreData.totalScore, scoreData.currentTier);
  const isMaxTier = scoreData.currentTier >= TIER_INFO.length - 1;

  return (
    <Card className={className} glass hover animated>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" style={{ color: tierInfo.color }} />
            <span>MetaScore #{formatScore(tokenId)}</span>
          </CardTitle>
          <div 
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${tierInfo.color}20`,
              color: tierInfo.color,
              border: `1px solid ${tierInfo.color}40`
            }}
          >
            {tierInfo.name}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Total Score Display */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-baseline space-x-2"
          >
            <span className="text-4xl font-bold gradient-text">
              {formatScore(scoreData.totalScore)}
            </span>
            <span className="text-white/60 text-lg">points</span>
          </motion.div>
          
          <div className="flex items-center justify-center space-x-4 mt-3 text-sm text-white/60">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{formatScore(scoreData.streakDays)} day streak</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {scoreData.lastActivityTimestamp > BigInt(0)
                  ? timeAgo(scoreData.lastActivityTimestamp)
                  : 'No activity'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {!isMaxTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Progress to {TIER_INFO[scoreData.currentTier + 1].name}</span>
              <span className="text-white/80">{Math.round(progressToNext)}%</span>
            </div>
            
            <div className="progress-bar h-2">
              <motion.div
                className="progress-fill h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-white/40">
              <span>{formatScore(scoreData.totalScore)} points</span>
              <span>{TIER_INFO[scoreData.currentTier + 1].threshold} points</span>
            </div>
          </div>
        )}

        {/* Tier Benefits */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Current Benefits</h4>
          <div className="space-y-1">
            {tierInfo.benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-2 text-sm text-white/60"
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tierInfo.color }}
                />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
