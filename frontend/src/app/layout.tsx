import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import WalletProvider from '@/components/wallet/WalletProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MetaScore - Living Achievement NFT',
  description: 'Living Achievement NFT that evolves based on your on-chain activity on Somnia Network',
  keywords: 'NFT, blockchain, Somnia, achievements, DeFi, Web3',
  authors: [{ name: 'Somnia Developer' }],
  openGraph: {
    title: 'MetaScore - Living Achievement NFT',
    description: 'Living Achievement NFT that evolves based on your on-chain activity',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MetaScore - Living Achievement NFT',
    description: 'Living Achievement NFT that evolves based on your on-chain activity',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-bg text-white min-h-screen`}>
        <WalletProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(26, 26, 26, 0.95)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              },
              success: {
                style: {
                  background: 'rgba(16, 185, 129, 0.9)',
                },
              },
              error: {
                style: {
                  background: 'rgba(239, 68, 68, 0.9)',
                },
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}
