'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { User, Trophy, Activity, Calendar, ExternalLink, Copy } from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ScoreCard from '@/components/metascore/ScoreCard';
import CategoryBreakdown from '@/components/metascore/CategoryBreakdown';
import TierDisplay from '@/components/metascore/TierDisplay';
import NFTDisplay from '@/components/metascore/NFTDisplay';
import RadarChart from '@/components/charts/RadarChart';
import ProgressChart from '@/components/charts/ProgressChart';
import { useMetaScore } from '@/hooks/useMetaScore';
import { shortenAddress, getExplorerUrl, timeAgo } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { PageLoader } from '@/components/ui/Loader';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { userMetaScore, isLoading, refreshData } = useMetaScore();
  const [activeTab, setActiveTab] = useState('overview');
  const toast = useToast();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Card glass className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-white/40" />
            <h2 className="text-xl font-semibold text-white mb-2">Connect Wallet</h2>
            <p className="text-white/60 mb-4">
              Please connect your wallet to view your MetaScore profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'nft', label: 'NFT', icon: Trophy },
    { id: 'tiers', label: 'Tiers', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
              <div className="flex items-center space-x-2 text-white/60">
                <span>{shortenAddress(address || '')}</span>
                <button
                  onClick={copyAddress}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={getExplorerUrl(address || '', 'address')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <Button
              variant="secondary"
              onClick={refreshData}
              loading={isLoading}
            >
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-somnia-primary text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ScoreCard userMetaScore={userMetaScore} className="mb-8" />
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
              <div className="space-y-8">
                <NFTDisplay userMetaScore={userMetaScore} />
                {userMetaScore && (
                  <Card glass>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-white/60">Current Streak</span>
                        <span className="text-white font-medium">
                          {userMetaScore.scoreData.streakDays.toString()} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Last Activity</span>
                        <span className="text-white font-medium">
                          {userMetaScore.scoreData.lastActivityTimestamp > BigInt(0)
                            ? timeAgo(userMetaScore.scoreData.lastActivityTimestamp)
                            : 'Never'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Token ID</span>
                        <span className="text-white font-medium">
                          #{userMetaScore.tokenId.toString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <RadarChart
                categoryScores={userMetaScore?.categoryScores || {
                  defi: BigInt(0),
                  nft: BigInt(0),
                  social: BigInt(0),
                  developer: BigInt(0),
                }}
              />
              <ProgressChart
                categoryScores={userMetaScore?.categoryScores || {
                  defi: BigInt(0),
                  nft: BigInt(0),
                  social: BigInt(0),
                  developer: BigInt(0),
                }}
                totalScore={userMetaScore?.scoreData.totalScore || BigInt(0)}
              />
            </div>
          )}

          {activeTab === 'nft' && (
            <div className="max-w-2xl mx-auto">
              <NFTDisplay userMetaScore={userMetaScore} className="mb-8" />
              {userMetaScore?.nftMetadata && (
                <Card glass>
                  <CardHeader>
                    <CardTitle>NFT Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-1">Name</h4>
                      <p className="text-white/60">{userMetaScore.nftMetadata.name}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">Description</h4>
                      <p className="text-white/60">{userMetaScore.nftMetadata.description}</p>
                    </div>
                    {userMetaScore.nftMetadata.attributes && (
                      <div>
                        <h4 className="font-medium text-white mb-2">Attributes</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {userMetaScore.nftMetadata.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg bg-white/5 border border-white/10"
                            >
                              <div className="text-xs text-white/60 mb-1">
                                {attr.trait_type}
                              </div>
                              <div className="text-sm font-medium text-white">
                                {attr.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'tiers' && (
            <div className="max-w-2xl mx-auto">
              <TierDisplay
                currentTier={userMetaScore?.scoreData.currentTier || 0}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
