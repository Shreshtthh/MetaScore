'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Plus, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useDemoContracts } from '@/hooks/useDemoContracts';
import { useAccount } from 'wagmi';
import { isValidAddress, validatePositiveNumber } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface TokenActionsProps {
  className?: string;
}

export default function TokenActions({ className }: TokenActionsProps) {
  const { address } = useAccount();
  const { mintTokens, transferTokens, isLoading, tokenBalance } = useDemoContracts();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const toast = useToast();

  const handleTransfer = async () => {
    if (!isValidAddress(transferTo)) {
      toast.error('Please enter a valid address');
      return;
    }
    
    if (!validatePositiveNumber(transferAmount)) {
      toast.error('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(transferAmount);
    const balance = parseFloat(tokenBalance);
    
    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    await transferTokens(transferTo, transferAmount);
    setIsTransferModalOpen(false);
    setTransferTo('');
    setTransferAmount('');
  };

  return (
    <>
      <Card className={className} glass animated>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-defi" />
            <span>Demo Tokens</span>
          </CardTitle>
          <p className="text-sm text-white/60">
            Mint and transfer demo tokens for DeFi points
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Balance Display */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="text-white/70">Your Token Balance</span>
            <span className="text-lg font-semibold text-white">
              {parseFloat(tokenBalance).toFixed(4)} DT
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={mintTokens}
              loading={isLoading}
              disabled={!address}
              icon={<Plus className="w-4 h-4" />}
              className="w-full bg-defi hover:bg-defi/90"
            >
              Mint Tokens (+15 points)
            </Button>

            <Button
              variant="secondary"
              onClick={() => setIsTransferModalOpen(true)}
              disabled={!address || parseFloat(tokenBalance) === 0}
              icon={<Send className="w-4 h-4" />}
              className="w-full"
            >
              Transfer Tokens (+10 points)
            </Button>
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-defi/10 border border-defi/20">
            <div className="flex items-start space-x-2">
              <Coins className="w-4 h-4 text-defi mt-0.5" />
              <div className="text-sm">
                <p className="text-white/80 font-medium">DeFi Category</p>
                <p className="text-white/60 mt-1">
                  Earn points through token operations and DeFi interactions
                </p>
              </div>
            </div>
          </div>

          {!address && (
            <div className="text-center py-4 text-white/60">
              <p className="text-sm">Connect wallet to interact with tokens</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Transfer Tokens"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-somnia-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Amount
            </label>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Amount to transfer"
              step="0.0001"
              min="0"
              max={tokenBalance}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-somnia-primary"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-white/50">
                Balance: {parseFloat(tokenBalance).toFixed(4)} DT
              </p>
              <button
                type="button"
                onClick={() => setTransferAmount(tokenBalance)}
                className="text-xs text-somnia-primary hover:text-somnia-secondary"
              >
                Max
              </button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsTransferModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleTransfer}
              loading={isLoading}
              className="flex-1"
            >
              Transfer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
