'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Sparkles, Trophy, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ScoreCard from '@/components/metascore/ScoreCard';
import CategoryBreakdown from '@/components/metascore/CategoryBreakdown';
import { useMetaScore } from '@/hooks/useMetaScore';
import { TIER_INFO, CATEGORY_INFO } from '@/types/contracts';

export default function HomePage() {
  const { isConnected } = useAccount();
  const { userMetaScore, isLoading } = useMetaScore();
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration by waiting for component to mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/10 border-t-somnia-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading MetaScore...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Trophy,
      title: 'Dynamic NFT Achievement',
      description: 'Your NFT evolves based on your on-chain activity and achievements',
      color: '#FFD700',
    },
    {
      icon: TrendingUp,
      title: 'Multi-Category Scoring',
      description: 'Earn points across DeFi, NFT, Social, and Developer activities',
      color: '#00CC66',
    },
    {
      icon: Users,
      title: 'Tier-Based Benefits',
      description: 'Unlock exclusive benefits and features as you advance through tiers',
      color: '#6366f1',
    },
  ];

  const stats = [
    { label: 'Total Tiers', value: TIER_INFO.length.toString() },
    { label: 'Categories', value: Object.keys(CATEGORY_INFO).length.toString() },
    { label: 'On Somnia', value: 'Network' },
  ];

  // Render disconnected state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-bg">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-somnia-primary/20 via-transparent to-somnia-secondary/20" />
          
          <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-gradient-to-br from-somnia-primary to-somnia-secondary rounded-full"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                <span className="gradient-text">MetaScore</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                Living Achievement NFT that evolves based on your on-chain activity
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-12"
              >
                <ConnectButton />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-white/60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How MetaScore Works
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Your MetaScore NFT tracks and rewards your blockchain activity across multiple categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card glass hover className="h-full">
                  <CardContent className="p-6 text-center">
                    <div 
                      className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                      style={{ 
                        backgroundColor: `${feature.color}20`,
                        border: `1px solid ${feature.color}40`
                      }}
                    >
                      <feature.icon 
                        className="w-6 h-6" 
                        style={{ color: feature.color }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Connect your wallet and start earning points across DeFi, NFT, Social, and Developer categories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button 
                  variant="primary" 
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Try Demo
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="secondary" size="lg">
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render connected user dashboard
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
            Your <span className="gradient-text">MetaScore</span> Dashboard
          </h1>
          <p className="text-white/60">
            Track your on-chain achievements and earn rewards
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <div className="lg:col-span-2">
            <ScoreCard userMetaScore={userMetaScore} className="h-full" />
          </div>

          {/* Category Breakdown */}
          <div>
            <CategoryBreakdown 
              categoryScores={userMetaScore?.categoryScores || {
                defi: BigInt(0),
                nft: BigInt(0),
                social: BigInt(0),
                developer: BigInt(0),
              }}
              totalScore={userMetaScore?.scoreData.totalScore || BigInt(0)}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Link href="/demo">
            <Card glass hover className="h-full cursor-pointer">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 text-somnia-primary mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Try Demo</h3>
                <p className="text-white/60 text-sm">Earn points with demo activities</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile">
            <Card glass hover className="h-full cursor-pointer">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-gold mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Full Profile</h3>
                <p className="text-white/60 text-sm">View detailed statistics</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/leaderboard">
            <Card glass hover className="h-full cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-somnia-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Leaderboard</h3>
                <p className="text-white/60 text-sm">Compare with others</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
