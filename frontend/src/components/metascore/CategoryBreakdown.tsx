'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CategoryScores } from '@/types/contracts';
import { CATEGORY_INFO, CategoryType } from '@/types/contracts';
import { getCategoryPercentage, formatScore } from '@/lib/utils';

interface CategoryBreakdownProps {
  categoryScores: CategoryScores;
  totalScore: bigint;
  className?: string;
}

export default function CategoryBreakdown({ 
  categoryScores, 
  totalScore, 
  className 
}: CategoryBreakdownProps) {
  const categories = Object.entries(categoryScores) as [CategoryType, bigint][];
  
  // Sort categories by score (descending)
  const sortedCategories = categories.sort(([, a], [, b]) => 
    Number(b) - Number(a)
  );

  return (
    <Card className={className} glass animated>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {sortedCategories.map(([category, score], index) => {
          const categoryInfo = CATEGORY_INFO[category];
          const percentage = getCategoryPercentage(score, totalScore);
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{categoryInfo.icon}</span>
                  <span className="text-sm font-medium text-white">
                    {categoryInfo.name}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {formatScore(score)}
                  </div>
                  <div className="text-xs text-white/60">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="progress-bar h-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: categoryInfo.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.2 + index * 0.1,
                    ease: "easeOut" 
                  }}
                />
              </div>

              <p className="text-xs text-white/50">
                {categoryInfo.description}
              </p>
            </motion.div>
          );
        })}

        {totalScore === BigInt(0) && (
          <div className="text-center py-8 text-white/60">
            <p className="text-sm">No activity recorded yet</p>
            <p className="text-xs mt-1">Start using dApps to earn category points</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
