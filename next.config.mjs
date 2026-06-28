/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "scontent-prg1-1.cdninstagram.com",
      "zlaty-eshop-project-production.up.railway.app",
      "golde-shop-production.up.railway.app",
      "localhost"
    ],
  },
  productionBrowserSourceMaps: false,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  }
};

export default nextConfig;