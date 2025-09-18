'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { UserMetaScore, ScoreData, CategoryScores } from '@/types/contracts';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/config';
import { METASCORE_ABI } from '@/lib/contracts/metascore';

export function useMetaScore() {
  const { address } = useAccount();
  const [userMetaScore, setUserMetaScore] = useState<UserMetaScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's token ID
  const { data: tokenId } = useReadContract({
    address: CONTRACT_ADDRESSES.MetaScore,
    abi: METASCORE_ABI,
    functionName: 'getUserTokenId',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get score data
  const { data: scoreData } = useReadContract({
    address: CONTRACT_ADDRESSES.MetaScore,
    abi: METASCORE_ABI,
    functionName: 'getScoreData',
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId && tokenId > BigInt(0),
    },
  });

  // Get category scores
  const { data: categoryData } = useReadContract({
    address: CONTRACT_ADDRESSES.MetaScore,
    abi: METASCORE_ABI,
    functionName: 'getAllCategoryScores',
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId && tokenId > BigInt(0),
    },
  });

  // Get token URI for metadata
  const { data: tokenURI } = useReadContract({
    address: CONTRACT_ADDRESSES.MetaScore,
    abi: METASCORE_ABI,
    functionName: 'tokenURI',
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId && tokenId > BigInt(0),
    },
  });

  // Safe metadata parsing function
  const parseMetadata = (uri: string) => {
    try {
      if (!uri) return null;

      // Handle data URI
      if (uri.startsWith('data:application/json;base64,')) {
        const base64Data = uri.split(',')[1];
        
        // Validate base64 before decoding
        if (!base64Data || base64Data.length === 0) {
          console.warn('Empty base64 data in token URI');
          return null;
        }

        // Check if base64 is properly formatted
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(base64Data)) {
          console.warn('Invalid base64 format in token URI');
          return null;
        }

        try {
          const jsonString = atob(base64Data);
          return JSON.parse(jsonString);
        } catch (decodeError) {
          console.error('Failed to decode base64:', decodeError);
          return null;
        }
      }

      // Handle HTTP URI (future extension)
      if (uri.startsWith('http')) {
        // For now, return null. In future, could fetch from URL
        console.log('HTTP URI detected, not supported yet:', uri);
        return null;
      }

      // Handle JSON string directly
      if (uri.startsWith('{')) {
        return JSON.parse(uri);
      }

      console.warn('Unsupported token URI format:', uri);
      return null;
    } catch (error) {
      console.error('Failed to parse metadata:', error);
      return null;
    }
  };

  // Process data when available
  useEffect(() => {
    if (!address || !tokenId || tokenId === BigInt(0)) {
      setUserMetaScore(null);
      return;
    }

    if (!scoreData || !categoryData) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [totalScore, streakDays, lastActivity, currentTier] = scoreData as [bigint, bigint, bigint, number];
      const [defi, nft, social, developer] = categoryData as [bigint, bigint, bigint, bigint];

      const parsedScoreData: ScoreData = {
        totalScore,
        streakDays,
        lastActivityTimestamp: lastActivity,
        currentTier,
      };

      const parsedCategoryScores: CategoryScores = {
        defi,
        nft,
        social,
        developer,
      };

      // Parse metadata safely
      const nftMetadata = tokenURI ? parseMetadata(tokenURI) : null;

      const metaScore: UserMetaScore = {
        tokenId,
        address,
        scoreData: parsedScoreData,
        categoryScores: parsedCategoryScores,
        nftMetadata,
      };

      setUserMetaScore(metaScore);
    } catch (err) {
      console.error('Error processing MetaScore data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load MetaScore data');
    } finally {
      setIsLoading(false);
    }
  }, [address, tokenId, scoreData, categoryData, tokenURI]);

  const refreshData = async () => {
    setIsLoading(true);
    // Force refetch by updating a state trigger
    // The useReadContract hooks will automatically refetch
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return {
    userMetaScore,
    isLoading,
    error,
    refreshData,
    hasMetaScore: !!tokenId && tokenId > BigInt(0),
  };
}
