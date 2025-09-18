'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { toast } from 'react-hot-toast';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/config';
import { getErrorMessage } from '@/lib/utils';

// Demo contracts ABIs
const DEMO_NFT_ABI = [
  {
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'to', type: 'address' }, { name: 'tokenId', type: 'uint256' }],
    name: 'transfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const DEMO_TOKEN_ABI = [
  {
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const PAYMENT_CONTRACT_ABI = [
  {
    inputs: [{ name: 'message', type: 'string' }],
    name: 'donate',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'recipient', type: 'address' }, { name: 'memo', type: 'string' }],
    name: 'sendPayment',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export function useDemoContracts() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Get balances
  const { data: nftBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.DemoNFT,
    abi: DEMO_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: tokenBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.DemoToken,
    abi: DEMO_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // NFT operations
  const mintNFT = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.DemoNFT,
        abi: DEMO_NFT_ABI,
        functionName: 'mint',
      });
      toast.success('NFT minting initiated!');
    } catch (error) {
      toast.error(`Failed to mint NFT: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const transferNFT = async (to: string, tokenId: number) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.DemoNFT,
        abi: DEMO_NFT_ABI,
        functionName: 'transfer',
        args: [to as `0x${string}`, BigInt(tokenId)],
      });
      toast.success('NFT transfer initiated!');
    } catch (error) {
      toast.error(`Failed to transfer NFT: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Token operations
  const mintTokens = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.DemoToken,
        abi: DEMO_TOKEN_ABI,
        functionName: 'mint',
      });
      toast.success('Tokens minting initiated!');
    } catch (error) {
      toast.error(`Failed to mint tokens: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const transferTokens = async (to: string, amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      const amountWei = parseEther(amount);
      await writeContract({
        address: CONTRACT_ADDRESSES.DemoToken,
        abi: DEMO_TOKEN_ABI,
        functionName: 'transfer',
        args: [to as `0x${string}`, amountWei],
      });
      toast.success('Token transfer initiated!');
    } catch (error) {
      toast.error(`Failed to transfer tokens: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Payment operations
  const makeDonation = async (amount: string, message: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      const value = parseEther(amount);
      await writeContract({
        address: CONTRACT_ADDRESSES.PaymentContract,
        abi: PAYMENT_CONTRACT_ABI,
        functionName: 'donate',
        args: [message],
        value,
      });
      toast.success('Donation initiated!');
    } catch (error) {
      toast.error(`Failed to make donation: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPayment = async (to: string, amount: string, memo: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      const value = parseEther(amount);
      await writeContract({
        address: CONTRACT_ADDRESSES.PaymentContract,
        abi: PAYMENT_CONTRACT_ABI,
        functionName: 'sendPayment',
        args: [to as `0x${string}`, memo],
        value,
      });
      toast.success('Payment initiated!');
    } catch (error) {
      toast.error(`Failed to send payment: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    isLoading: isLoading || isConfirming,
    nftBalance: nftBalance ? Number(nftBalance) : 0,
    tokenBalance: tokenBalance ? formatEther(tokenBalance) : '0',
    
    // NFT functions
    mintNFT,
    transferNFT,
    
    // Token functions
    mintTokens,
    transferTokens,
    
    // Payment functions
    makeDonation,
    sendPayment,
  };
}
