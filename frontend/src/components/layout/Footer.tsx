'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Github, Twitter, Globe } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { name: 'Website', href: 'https://somnia.network', icon: Globe },
    { name: 'GitHub', href: 'https://github.com/somnia', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com/somnia', icon: Twitter },
  ];

  return (
    <footer className="border-t border-white/10 bg-dark-bg/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo and Description */}
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-somnia-primary to-somnia-secondary"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold text-white">MetaScore</span>
            </Link>
            <p className="text-white/60 max-w-md">
              Living Achievement NFT that evolves based on your on-chain activity on Somnia Network
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <link.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>

          {/* Bottom Text */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/40 text-sm">
              Built on{' '}
              <a 
                href="https://somnia.network" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-somnia-primary hover:text-somnia-secondary transition-colors"
              >
                Somnia Network
              </a>
              {' '}• Powered by Living NFTs
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
