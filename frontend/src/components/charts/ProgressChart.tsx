'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CategoryScores } from '@/types/contracts';
import { CATEGORY_INFO } from '@/types/contracts';
import { formatScore } from '@/lib/utils';

interface ProgressChartProps {
  categoryScores: CategoryScores;
  totalScore: bigint;
  className?: string;
}

export default function ProgressChart({ 
  categoryScores, 
  totalScore, 
  className 
}: ProgressChartProps) {
  const maxScore = Math.max(100, Number(totalScore));
  
  const categories = Object.entries(categoryScores).map(([key, score]) => {
    const categoryInfo = CATEGORY_INFO[key as keyof typeof CATEGORY_INFO];
    const percentage = totalScore > 0 ? (Number(score) / Number(totalScore)) * 100 : 0;
    
    return {
      key,
      name: categoryInfo.name,
      score: Number(score),
      percentage,
      color: categoryInfo.color,
      icon: categoryInfo.icon,
    };
  });

  // Sort by score descending
  const sortedCategories = categories.sort((a, b) => b.score - a.score);

  return (
    <Card className={className} glass animated>
      <CardHeader>
        <CardTitle>Category Progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {sortedCategories.map((category, index) => (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium text-white">
                  {category.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">
                  {formatScore(BigInt(category.score))}
                </div>
                <div className="text-xs text-white/60">
                  {category.percentage.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: category.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${category.percentage}%` }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.2 + index * 0.1,
                    ease: "easeOut" 
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}

        {Number(totalScore) === 0 && (
          <div className="text-center py-8 text-white/40">
            <p className="text-sm">No progress yet</p>
            <p className="text-xs mt-1">Start earning points to see your progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
