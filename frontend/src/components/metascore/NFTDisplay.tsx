'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, ExternalLink, Copy, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { UserMetaScore } from '@/types/contracts';
import { shortenAddress, getExplorerUrl } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/config';
import { METASCORE_ABI } from '@/lib/contracts/metascore';
import { getMetaScoreContractUrl, getContractTokenUrl } from '@/lib/utils';


interface NFTDisplayProps {
  userMetaScore: UserMetaScore | null;
  className?: string;
}

export default function NFTDisplay({ userMetaScore, className }: NFTDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [customNFT, setCustomNFT] = useState<string | null>(null);
  const toast = useToast();

  // Generate custom NFT when userMetaScore changes
  useEffect(() => {
    if (userMetaScore) {
      const svg = generateCustomNFT(userMetaScore);
      setCustomNFT(svg);
    }
  }, [userMetaScore]);

  const generateCustomNFT = (score: UserMetaScore) => {
    const tier = score.scoreData.currentTier;
    const totalScore = score.scoreData.totalScore.toString();
    const defiScore = score.categoryScores.defi.toString();
    const nftScore = score.categoryScores.nft.toString();
    const socialScore = score.categoryScores.social.toString();
    const devScore = score.categoryScores.developer.toString();
    
    const tierColors = ['#CD7F32', '#C0C0C0', '#FFD700', '#E5E4E2', '#B9F2FF'];
    const tierNames = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
    
    const color = tierColors[tier] || '#C0C0C0';
    const tierName = tierNames[tier] || 'Bronze';
    
    // Create animated aura for higher tiers
    const auraAnimation = tier >= 2 ? `
      <defs>
        <radialGradient id="aura" cx="50%" cy="50%" r="60%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.3">
            <animate attributeName="stop-opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" style="stop-color:${color};stop-opacity:0"/>
        </radialGradient>
        <circle cx="200" cy="200" r="120" fill="url(#aura)"/>
      </defs>
    ` : '';
    
    // Different shapes for different tiers
    const mainShape = 
      tier === 0 ? `<circle cx="200" cy="200" r="70" fill="url(#shapeGradient)" stroke="${color}" stroke-width="4"/>` :
      tier === 1 ? `<polygon points="200,130 250,170 250,230 200,270 150,230 150,170" fill="url(#shapeGradient)" stroke="${color}" stroke-width="4"/>` :
      tier === 2 ? `<polygon points="200,130 220,170 250,170 230,200 240,230 200,215 160,230 170,200 150,170 180,170" fill="url(#shapeGradient)" stroke="${color}" stroke-width="4"/>` :
      tier === 3 ? `<polygon points="200,120 235,155 270,155 245,185 255,220 200,200 145,220 155,185 130,155 165,155" fill="url(#shapeGradient)" stroke="${color}" stroke-width="4"/>` :
      `<polygon points="200,110 225,145 260,145 240,175 250,210 200,190 150,210 160,175 140,145 175,145" fill="url(#shapeGradient)" stroke="${color}" stroke-width="4"/>`;

    const svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" style="stop-color:${color}15;stop-opacity:1"/>
            <stop offset="50%" style="stop-color:#1a1a1a;stop-opacity:1"/>
            <stop offset="100%" style="stop-color:#000000;stop-opacity:1"/>
          </radialGradient>
          <linearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.8"/>
            <stop offset="50%" style="stop-color:${color};stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:${color};stop-opacity:1"/>
          </linearGradient>
          ${auraAnimation}
        </defs>
        
        <!-- Background -->
        <rect width="400" height="400" fill="url(#bgGradient)"/>
        
        <!-- Aura for high tiers -->
        ${tier >= 2 ? `<circle cx="200" cy="200" r="120" fill="url(#aura)"/>` : ''}
        
        <!-- Main Shape -->
        ${mainShape}
        
        <!-- Category Indicators -->
        <g opacity="0.9">
          <!-- DeFi (top-left) -->
          <circle cx="80" cy="80" r="15" fill="#0066FF" stroke="white" stroke-width="2"/>
          <text x="80" y="85" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${defiScore}</text>
          <text x="80" y="60" text-anchor="middle" fill="#0066FF" font-size="10">DeFi</text>
          
          <!-- NFT (top-right) -->
          <rect x="305" y="65" width="30" height="30" fill="#9900CC" stroke="white" stroke-width="2" rx="4"/>
          <text x="320" y="85" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${nftScore}</text>
          <text x="320" y="60" text-anchor="middle" fill="#9900CC" font-size="10">NFT</text>
          
          <!-- Social (bottom-left) -->
          <polygon points="80,305 65,325 95,325" fill="#00CC66" stroke="white" stroke-width="2"/>
          <text x="80" y="320" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${socialScore}</text>
          <text x="80" y="345" text-anchor="middle" fill="#00CC66" font-size="10">Social</text>
          
          <!-- Developer (bottom-right) -->
          <polygon points="320,305 335,320 320,335 305,320" fill="#FF6600" stroke="white" stroke-width="2"/>
          <text x="320" y="325" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${devScore}</text>
          <text x="320" y="345" text-anchor="middle" fill="#FF6600" font-size="10">Dev</text>
        </g>
        
        <!-- Score Display -->
        <rect x="50" y="300" width="300" height="70" fill="rgba(0,0,0,0.85)" stroke="${color}" stroke-width="2" rx="15"/>
        <text x="200" y="325" text-anchor="middle" fill="${color}" font-size="20" font-weight="bold">Score: ${totalScore}</text>
        <text x="200" y="345" text-anchor="middle" fill="white" font-size="16">${tierName} Tier</text>
        <text x="200" y="360" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="12">MetaScore #${score.tokenId.toString()}</text>
        
        <!-- Tier indicator -->
        <circle cx="350" cy="50" r="20" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="350" y="57" text-anchor="middle" fill="white" font-size="14" font-weight="bold">${tier}</text>
        
        <!-- Animated elements for high tiers -->
        ${tier >= 3 ? `
          <circle cx="200" cy="200" r="90" fill="none" stroke="${color}" stroke-width="1" opacity="0.5">
            <animate attributeName="r" values="90;95;90" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite"/>
          </circle>
        ` : ''}
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadImage = () => {
    if (customNFT) {
      try {
        const link = document.createElement('a');
        link.href = customNFT;
        link.download = `MetaScore-${userMetaScore?.tokenId?.toString() || 'unknown'}.svg`;
        link.click();
      } catch (error) {
        toast.error('Failed to download image');
      }
    }
  };

  // No MetaScore NFT yet
  if (!userMetaScore || userMetaScore.tokenId === BigInt(0)) {
    return (
      <Card className={className} glass>
        <CardContent className="p-6 text-center">
          <div className="w-full aspect-square bg-white/5 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white/40 text-4xl">🎯</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No MetaScore Yet</h3>
          <p className="text-white/60 text-sm mb-4">
            Perform activities in the demo section to earn your first MetaScore NFT!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Create metadata
  const tierNames = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const nftMetadata = {
    name: `MetaScore #${userMetaScore.tokenId.toString()}`,
    description: "Living Achievement NFT that evolves based on your on-chain activity on Somnia blockchain",
    image: customNFT,
    attributes: [
      { trait_type: "Total Score", value: userMetaScore.scoreData.totalScore.toString() },
      { trait_type: "Tier", value: tierNames[userMetaScore.scoreData.currentTier] || 'Bronze' },
      { trait_type: "DeFi Score", value: userMetaScore.categoryScores.defi.toString() },
      { trait_type: "NFT Score", value: userMetaScore.categoryScores.nft.toString() },
      { trait_type: "Social Score", value: userMetaScore.categoryScores.social.toString() },
      { trait_type: "Developer Score", value: userMetaScore.categoryScores.developer.toString() },
      { trait_type: "Streak Days", value: userMetaScore.scoreData.streakDays.toString() }
    ]
  };

  return (
    <>
      <Card className={className} glass hover animated>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your MetaScore NFT</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-green-400 text-sm">✨ Generated</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                icon={<Eye className="w-4 h-4" />}
              >
                View
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* NFT Image */}
          <div className="relative overflow-hidden rounded-lg bg-gray-900">
            <div className="aspect-square relative">
              {customNFT ? (
                <motion.img
                  src={customNFT}
                  alt={nftMetadata.name}
                  className="w-full h-full object-contain"
                  onLoad={() => setImageLoaded(true)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: imageLoaded ? 1 : 0,
                    scale: imageLoaded ? 1 : 0.95
                  }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-white/10 border-t-somnia-primary rounded-full"></div>
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
          <div className="flex flex-wrap gap-2"></div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              window.open(getMetaScoreContractUrl(), '_blank');
            }}
            icon={<ExternalLink className="w-3 h-3" />}
          >
            Contract
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const nftUrl = getContractTokenUrl('0x1ba97a3e916422574053aed16a5d1b8e14b160b4');
              window.open(nftUrl, '_blank');
            }}
            icon={<Eye className="w-3 h-3" />}
          >
            NFT #{userMetaScore.tokenId.toString()}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(userMetaScore.tokenId.toString())}
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
          <div className="relative overflow-hidden rounded-lg bg-gray-900">
            <div className="aspect-square relative">
              {customNFT ? (
                <img
                  src={customNFT}
                  alt={nftMetadata.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin w-12 h-12 border-4 border-white/10 border-t-somnia-primary rounded-full"></div>
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

            {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4">
            <Button
              variant="primary"
              onClick={() => {
                window.open(getMetaScoreContractUrl(), '_blank');
              }}
              icon={<ExternalLink className="w-4 h-4" />}
              size="sm"
            >
              MetaScore Contract
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => {
                const nftUrl = getContractTokenUrl('0x1ba97a3e916422574053aed16a5d1b8e14b160b4');
                window.open(nftUrl, '_blank');
              }}
              icon={<Eye className="w-4 h-4" />}
              size="sm"
            >
              View All NFTs
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => copyToClipboard(userMetaScore.tokenId.toString())}
              icon={<Copy className="w-4 h-4" />}
              size="sm"
            >
              Copy Token ID
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => copyToClipboard('0x1ba97a3e916422574053aed16a5d1b8e14b160b4')}
              icon={<Copy className="w-4 h-4" />}
              size="sm"
            >
              Copy Contract
            </Button>
            
            <Button
              variant="ghost"
              onClick={downloadImage}
              icon={<Download className="w-4 h-4" />}
              size="sm"
            >
              Download SVG
            </Button>
          </div>

          </div>
        </div>
      </Modal>
    </>
  );
}
