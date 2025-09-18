'use client';

import React, { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { somniaTestnet } from '@/lib/contracts/config';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'MetaScore',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [somniaTestnet],
  transports: {
    [somniaTestnet.id]: http(),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

interface WalletProviderProps {
  children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            blurs: {
              modalOverlay: 'small',
            },
            colors: {
              accentColor: '#6366f1',
              accentColorForeground: 'white',
              actionButtonBorder: 'rgba(255, 255, 255, 0.04)',
              actionButtonBorderMobile: 'rgba(255, 255, 255, 0.06)',
              actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.08)',
              closeButton: 'rgba(224, 232, 255, 0.6)',
              closeButtonBackground: 'rgba(255, 255, 255, 0.08)',
              connectButtonBackground: '#1a1a1a',
              connectButtonBackgroundError: '#ff4444',
              connectButtonInnerBackground: 'linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))',
              connectButtonText: '#ffffff',
              connectButtonTextError: '#ffffff',
              connectionIndicator: '#30e000',
              downloadBottomCardBackground: 'linear-gradient(126deg, rgba(255, 255, 255, 0.09) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #1a1a1a',
              downloadTopCardBackground: 'linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0.09) 71.04%), #1a1a1a',
              error: '#ff4444',
              generalBorder: 'rgba(255, 255, 255, 0.08)',
              generalBorderDim: 'rgba(255, 255, 255, 0.04)',
              menuItemBackground: 'rgba(224, 232, 255, 0.1)',
              modalBackdrop: 'rgba(0, 0, 0, 0.5)',
              modalBackground: '#1a1a1a',
              modalBorder: 'rgba(255, 255, 255, 0.08)',
              modalText: '#ffffff',
              modalTextDim: 'rgba(224, 232, 255, 0.6)',
              modalTextSecondary: 'rgba(255, 255, 255, 0.6)',
              profileAction: 'rgba(224, 232, 255, 0.1)',
              profileActionHover: 'rgba(224, 232, 255, 0.2)',
              profileForeground: '#1a1a1a',
              selectedOptionBorder: 'rgba(224, 232, 255, 0.1)',
              standby: '#ff4444',
            },
            fonts: {
              body: 'SFRounded, ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            radii: {
              actionButton: '12px',
              connectButton: '12px',
              menuButton: '12px',
              modal: '16px',
              modalMobile: '16px',
            },
            shadows: {
              connectButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              dialog: '0px 8px 32px rgba(0, 0, 0, 0.32)',
              profileDetailsAction: '0px 2px 6px rgba(0, 0, 0, 0.15)',
              selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.24)',
              selectedWallet: '0px 4px 12px rgba(0, 0, 0, 0.12)',
              walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.16)',
            },
          }}
          modalSize="compact"
          initialChain={somniaTestnet}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
