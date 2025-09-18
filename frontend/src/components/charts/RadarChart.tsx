'use client';

import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CategoryScores } from '@/types/contracts';
import { CATEGORY_INFO } from '@/types/contracts';

interface RadarChartProps {
  categoryScores: CategoryScores;
  className?: string;
}

export default function RadarChart({ categoryScores, className }: RadarChartProps) {
  const data = Object.entries(categoryScores).map(([category, score]) => ({
    category: CATEGORY_INFO[category as keyof typeof CATEGORY_INFO].name,
    score: Number(score),
    fullMark: Math.max(100, Number(score) * 1.5),
  }));

  return (
    <Card className={className} glass animated>
      <CardHeader>
        <CardTitle>Activity Radar</CardTitle>
      </CardHeader>

      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadar data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid 
                stroke="rgba(255, 255, 255, 0.2)" 
                radialLines={false}
              />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ 
                  fill: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: 12,
                  fontFamily: 'Inter'
                }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#6366f1"
                fill="rgba(99, 102, 241, 0.2)"
                strokeWidth={2}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              />
            </RechartsRadar>
          </ResponsiveContainer>
        </motion.div>

        {/* Legend */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-somnia-primary"></div>
            <span className="text-sm text-white/60">Your Activity Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
