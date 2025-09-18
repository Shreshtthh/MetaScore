'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Users, Code, Coins, Palette } from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useDemoContracts } from '@/hooks/useDemoContracts';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useAccount } from 'wagmi';
import { DEMO_CONFIG } from '@/lib/constants';
import { useToast } from '@/hooks/useToast';

interface DemoActionsProps {
  className?: string;
}

export default function DemoActions({ className }: DemoActionsProps) {
  const { address } = useAccount();
  const { 
    mintNFT, 
    mintTokens, 
    makeDonation, 
    sendPayment, 
    isLoading,
    nftBalance,
    tokenBalance 
  } = useDemoContracts();
  const { trackActivity } = useActivityTracker();
  const toast = useToast();
  const [donationAmount, setDonationAmount] = useState('0.001');
  const [paymentAmount, setPaymentAmount] = useState('0.001');
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration by waiting for component to mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const executeAction = async (
    action: () => Promise<void>,
    category: string,
    actionName: string,
    points: number
  ) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await action();
      // Track activity after successful transaction
      // setTimeout(() => {
      //   trackActivity(address, category, points, actionName);
      // }, 2000); // Wait for transaction to be mined
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const demoActions = [
    {
      icon: Palette,
      title: 'Mint NFT',
      description: 'Mint a demo NFT to earn NFT category points',
      category: 'nft',
      points: 20,
      color: '#9900CC',
      action: () => executeAction(mintNFT, 'nft', 'NFT Minting', 20),
      status: `Balance: ${nftBalance} NFTs`,
    },
    {
      icon: Coins,
      title: 'Mint Tokens',
      description: 'Mint demo tokens to earn DeFi category points',
      category: 'defi',
      points: 15,
      color: '#0066FF',
      action: () => executeAction(mintTokens, 'defi', 'Token Minting', 15),
      status: `Balance: ${parseFloat(tokenBalance).toFixed(2)} tokens`,
    },
    {
      icon: Users,
      title: 'Make Donation',
      description: 'Donate to earn social category points',
      category: 'social',
      points: 25,
      color: '#00CC66',
      action: () => executeAction(
        () => makeDonation(donationAmount, 'Demo donation for MetaScore'),
        'social',
        'Donation',
        25
      ),
      customInput: (
        <input
          type="number"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          placeholder="Amount in ETH"
          step="0.001"
          min="0.001"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-somnia-primary"
        />
      ),
    },
    {
      icon: Zap,
      title: 'Send Payment',
      description: 'Send P2P payment for social points',
      category: 'social',
      points: 15,
      color: '#00CC66',
      action: () => executeAction(
        () => sendPayment(address!, paymentAmount, 'Demo payment'),
        'social',
        'P2P Payment',
        15
      ),
      customInput: (
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          placeholder="Amount in ETH"
          step="0.001"
          min="0.001"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-somnia-primary"
        />
      ),
    },
  ];

  // Show loading state until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <Card className={className} glass animated>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="w-5 h-5 text-somnia-primary" />
            <span>Demo Actions</span>
          </CardTitle>
          <p className="text-sm text-white/60">
            Loading demo activities...
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-20 bg-white/5 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className} glass animated>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="w-5 h-5 text-somnia-primary" />
          <span>Demo Actions</span>
        </CardTitle>
        <p className="text-sm text-white/60">
          Perform these actions to earn MetaScore points and test the system
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {!address ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white/60 mb-2">Connect your wallet to start</p>
            <p className="text-sm text-white/40">
              Connect your wallet to perform demo actions and earn MetaScore points
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {demoActions.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: `${item.color}20`,
                        border: `1px solid ${item.color}40`
                      }}
                    >
                      <item.icon 
                        className="w-5 h-5" 
                        style={{ color: item.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-white/60">{item.description}</p>
                      {item.status && (
                        <p className="text-xs text-white/40 mt-1">{item.status}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${item.color}20`,
                        color: item.color 
                      }}
                    >
                      +{item.points} pts
                    </div>
                  </div>
                </div>

                {item.customInput && (
                  <div className="mb-3">
                    {item.customInput}
                  </div>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  onClick={item.action}
                  loading={isLoading}
                  className="w-full"
                  style={{ backgroundColor: item.color }}
                >
                  Execute Action
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 rounded-lg bg-somnia-primary/10 border border-somnia-primary/20">
          <div className="flex items-start space-x-3">
            <Code className="w-5 h-5 text-somnia-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-white mb-1">Developer Category</h4>
              <p className="text-sm text-white/60 mb-2">
                Deploy contracts, contribute to repos, or build dApps to earn developer points
              </p>
              <div className="text-xs text-somnia-primary">
                Connect with verified development activities for automatic tracking
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
