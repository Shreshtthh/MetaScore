'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, ExternalLink, Copy } from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { UserMetaScore } from '@/types/contracts';
import { shortenAddress, getExplorerUrl } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface NFTDisplayProps {
  userMetaScore: UserMetaScore | null;
  className?: string;
}

export default function NFTDisplay({ userMetaScore, className }: NFTDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const toast = useToast();

  if (!userMetaScore || !userMetaScore.nftMetadata) {
    return (
      <Card className={className} glass>
        <CardContent className="p-6 text-center">
          <div className="w-full aspect-square bg-white/5 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white/40 text-4xl">🎨</span>
          </div>
          <p className="text-white/60 text-sm">NFT metadata loading...</p>
        </CardContent>
      </Card>
    );
  }

  const { nftMetadata, tokenId } = userMetaScore;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadImage = () => {
    if (nftMetadata.image) {
      const link = document.createElement('a');
      link.href = nftMetadata.image;
      link.download = `MetaScore-${tokenId}.png`;
      link.click();
    }
  };

  return (
    <>
      <Card className={className} glass hover animated>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your MetaScore NFT</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              icon={<Eye className="w-4 h-4" />}
            >
              View
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* NFT Image */}
          <div className="relative overflow-hidden rounded-lg bg-white/5">
            <div className="aspect-square relative">
              {nftMetadata.image ? (
                <motion.img
                  src={nftMetadata.image}
                  alt={nftMetadata.name}
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoaded(true)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: imageLoaded ? 1 : 0,
                    scale: imageLoaded ? 1 : 0.95
                  }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl opacity-30">🏆</span>
                </div>
              )}
            </div>
          </div>

          {/* NFT Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-white">{nftMetadata.name}</h3>
            <p className="text-sm text-white/60 line-clamp-2">
              {nftMetadata.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(tokenId.toString())}
              icon={<Copy className="w-3 h-3" />}
            >
              Copy ID
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadImage}
              icon={<Download className="w-3 h-3" />}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={nftMetadata.name}
        size="lg"
      >
        <div className="space-y-6">
          {/* Large Image */}
          <div className="relative overflow-hidden rounded-lg bg-white/5">
            <div className="aspect-square relative">
              {nftMetadata.image ? (
                <img
                  src={nftMetadata.image}
                  alt={nftMetadata.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl opacity-30">🏆</span>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">Description</h4>
              <p className="text-white/60 text-sm">{nftMetadata.description}</p>
            </div>

            {/* Attributes */}
            {nftMetadata.attributes && nftMetadata.attributes.length > 0 && (
              <div>
                <h4 className="font-medium text-white mb-2">Attributes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {nftMetadata.attributes.map((attr, index) => (
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

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="primary"
                onClick={() => {
                  window.open(getExplorerUrl(tokenId.toString(), 'address'), '_blank');
                }}
                icon={<ExternalLink className="w-4 h-4" />}
              >
                View on Explorer
              </Button>
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(tokenId.toString())}
                icon={<Copy className="w-4 h-4" />}
              >
                Copy Token ID
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
