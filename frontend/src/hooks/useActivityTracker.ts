'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/config';
import { getErrorMessage } from '@/lib/utils';

const ACTIVITY_TRACKER_ABI = [
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'category', type: 'string' },
      { name: 'points', type: 'uint256' },
      { name: 'action', type: 'string' },
    ],
    name: 'trackActivity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'contractAddress', type: 'address' }],
    name: 'isVerifiedContract',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function useActivityTracker() {
  const [isTracking, setIsTracking] = useState(false);

  const { writeContract, data: hash, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const trackActivity = async (
    userAddress: string,
    category: string,
    points: number,
    action: string
  ) => {
    setIsTracking(true);
    
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.ActivityTracker,
        abi: ACTIVITY_TRACKER_ABI,
        functionName: 'trackActivity',
        args: [userAddress as `0x${string}`, category, BigInt(points), action],
      });
      
      toast.success(`Activity tracked: ${action}`);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(`Failed to track activity: ${errorMessage}`);
      console.error('Track activity error:', error);
    } finally {
      setIsTracking(false);
    }
  };

  return {
    trackActivity,
    isTracking: isTracking || isConfirming,
    isConfirmed,
    error: writeError,
    hash,
  };
}
