'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
  animated?: boolean;
  delay?: number;
}

export function Card({ 
  className, 
  children, 
  hover = false, 
  glass = true,
  animated = true,
  delay = 0
}: CardProps) {
  const baseClasses = 'rounded-xl border transition-all duration-300';
  
  const glassClasses = glass 
    ? 'bg-white/5 backdrop-blur-md border-white/10 shadow-xl'
    : 'bg-dark-card border-dark-border';

  const hoverClasses = hover 
    ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-2xl cursor-pointer' 
    : '';

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay,
        ease: "easeOut"
      }
    }
  };

  if (animated) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
        className={cn(baseClasses, glassClasses, hoverClasses, className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(baseClasses, glassClasses, hoverClasses, className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('px-6 pb-6', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('text-lg font-semibold text-white', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn('text-sm text-white/60 mt-1', className)}>
      {children}
    </p>
  );
}
