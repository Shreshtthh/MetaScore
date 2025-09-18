const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add aliases
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    }
    
    return config
  },
}

module.exports = nextConfig
