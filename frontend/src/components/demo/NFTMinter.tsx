'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Plus, Send, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useDemoContracts } from '@/hooks/useDemoContracts';
import { useAccount } from 'wagmi';
import { isValidAddress, getExplorerUrl } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface NFTMinterProps {
  className?: string;
}

export default function NFTMinter({ className }: NFTMinterProps) {
  const { address } = useAccount();
  const { mintNFT, transferNFT, isLoading, nftBalance } = useDemoContracts();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferTo, setTransferTo] = useState('');
  const [tokenId, setTokenId] = useState('');
  const toast = useToast();

  const handleTransfer = async () => {
    if (!isValidAddress(transferTo)) {
      toast.error('Please enter a valid address');
      return;
    }
    
    if (!tokenId || isNaN(Number(tokenId))) {
      toast.error('Please enter a valid token ID');
      return;
    }

    await transferNFT(transferTo, Number(tokenId));
    setIsTransferModalOpen(false);
    setTransferTo('');
    setTokenId('');
  };

  return (
    <>
      <Card className={className} glass animated>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-nft" />
            <span>Demo NFT</span>
          </CardTitle>
          <p className="text-sm text-white/60">
            Mint and transfer demo NFTs to earn points
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Balance Display */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="text-white/70">Your NFT Balance</span>
            <span className="text-lg font-semibold text-white">{nftBalance}</span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={mintNFT}
              loading={isLoading}
              disabled={!address}
              icon={<Plus className="w-4 h-4" />}
              className="w-full bg-nft hover:bg-nft/90"
            >
              Mint NFT (+20 points)
            </Button>

            <Button
              variant="secondary"
              onClick={() => setIsTransferModalOpen(true)}
              disabled={!address || nftBalance === 0}
              icon={<Send className="w-4 h-4" />}
              className="w-full"
            >
              Transfer NFT (+15 points)
            </Button>
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-nft/10 border border-nft/20">
            <div className="flex items-start space-x-2">
              <Palette className="w-4 h-4 text-nft mt-0.5" />
              <div className="text-sm">
                <p className="text-white/80 font-medium">NFT Category</p>
                <p className="text-white/60 mt-1">
                  Earn points by minting, transferring, and trading NFTs
                </p>
              </div>
            </div>
          </div>

          {!address && (
            <div className="text-center py-4 text-white/60">
              <p className="text-sm">Connect wallet to interact with NFTs</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Transfer NFT"
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
              Token ID
            </label>
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Token ID to transfer"
              min="0"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-somnia-primary"
            />
            <p className="text-xs text-white/50 mt-1">
              You own {nftBalance} NFTs. Token IDs start from 0.
            </p>
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
