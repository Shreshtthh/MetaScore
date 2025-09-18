'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Award, Trophy, Gem } from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TIER_INFO } from '@/types/contracts';

interface TierDisplayProps {
  currentTier: number;
  className?: string;
}

const tierIcons = [Trophy, Award, Star, Crown, Gem];

export default function TierDisplay({ currentTier, className }: TierDisplayProps) {
  return (
    <Card className={className} glass animated>
      <CardHeader>
        <CardTitle>All Tiers</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {TIER_INFO.map((tier, index) => {
          const isUnlocked = currentTier >= index;
          const isCurrent = currentTier === index;
          const Icon = tierIcons[index];

          return (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                isCurrent
                  ? 'bg-white/10 border-white/30'
                  : isUnlocked
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  isUnlocked ? 'opacity-100' : 'opacity-30'
                }`}
                style={{
                  backgroundColor: isUnlocked ? `${tier.color}20` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isUnlocked ? tier.color : 'rgba(255,255,255,0.1)'}40`,
                }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: isUnlocked ? tier.color : '#666' }}
                />
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 
                    className={`font-semibold ${
                      isUnlocked ? 'text-white' : 'text-white/40'
                    }`}
                    style={{ color: isCurrent ? tier.color : undefined }}
                  >
                    {tier.name}
                    {isCurrent && (
                      <span className="ml-2 text-xs bg-somnia-primary px-2 py-0.5 rounded-full text-white">
                        Current
                      </span>
                    )}
                  </h4>
                  <span className={`text-sm ${
                    isUnlocked ? 'text-white/60' : 'text-white/30'
                  }`}>
                    {tier.threshold}+ points
                  </span>
                </div>

                <div className="mt-1 space-y-1">
                  {tier.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                    <div 
                      key={benefitIndex}
                      className={`text-xs flex items-center space-x-1 ${
                        isUnlocked ? 'text-white/50' : 'text-white/25'
                      }`}
                    >
                      <div 
                        className="w-1 h-1 rounded-full"
                        style={{ 
                          backgroundColor: isUnlocked ? tier.color : '#444'
                        }}
                      />
                      <span>{benefit}</span>
                    </div>
                  ))}
                  {tier.benefits.length > 2 && (
                    <div className={`text-xs ${
                      isUnlocked ? 'text-white/40' : 'text-white/20'
                    }`}>
                      +{tier.benefits.length - 2} more benefits
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
