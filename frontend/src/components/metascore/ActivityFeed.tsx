'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ActivityEvent } from '@/types/contracts';
import { CATEGORY_INFO } from '@/types/contracts';
import { shortenAddress, timeAgo, getExplorerUrl } from '@/lib/utils';

interface ActivityFeedProps {
  activities: ActivityEvent[];
  className?: string;
}

// Mock activity data for demonstration
const mockActivities: ActivityEvent[] = [
  {
    user: '0x1234567890123456789012345678901234567890',
    category: 'nft',
    points: BigInt(20),
    action: 'NFT Minting',
    contractAddress: '0xabc123...',
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 3600),
    transactionHash: '0x123abc...',
    blockNumber: BigInt(12345),
  },
  {
    user: '0x2345678901234567890123456789012345678901',
    category: 'defi',
    points: BigInt(15),
    action: 'Token Transfer',
    contractAddress: '0xdef456...',
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 7200),
    transactionHash: '0x456def...',
    blockNumber: BigInt(12344),
  },
  {
    user: '0x3456789012345678901234567890123456789012',
    category: 'social',
    points: BigInt(25),
    action: 'Donation',
    contractAddress: '0x789ghi...',
    timestamp: BigInt(Math.floor(Date.now() / 1000) - 10800),
    transactionHash: '0x789ghi...',
    blockNumber: BigInt(12343),
  },
];

export default function ActivityFeed({ 
  activities = mockActivities, 
  className 
}: ActivityFeedProps) {
  return (
    <Card className={className} glass animated>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-somnia-primary" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const categoryInfo = CATEGORY_INFO[activity.category as keyof typeof CATEGORY_INFO];
            
            return (
              <motion.div
                key={`${activity.transactionHash}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${categoryInfo.color}20`,
                      border: `1px solid ${categoryInfo.color}40`,
                    }}
                  >
                    <span className="text-sm">{categoryInfo.icon}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white font-medium text-sm">
                        {activity.action}
                      </h4>
                      <div
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${categoryInfo.color}20`,
                          color: categoryInfo.color,
                        }}
                      >
                        +{activity.points.toString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-white/60">
                      <span>{shortenAddress(activity.user)}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{timeAgo(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={getExplorerUrl(activity.transactionHash, 'tx')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-white/60 hover:text-white" />
                </a>
              </motion.div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
