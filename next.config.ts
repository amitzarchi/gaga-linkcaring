import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Suppress the specific fluent-ffmpeg warning about dynamic requires
    config.ignoreWarnings = [
      {
        module: /node_modules\/fluent-ffmpeg\/lib\/options\/misc\.js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];
    
    return config;
  },
};

export default nextConfig;
