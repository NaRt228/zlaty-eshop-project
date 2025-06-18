/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "scontent-prg1-1.cdninstagram.com",
      "apigolde-shop-production-5431.up.railway.app"
    ],
    
  },
  eslint:{
    ignoreDuringBuilds: true
  },
};

export default nextConfig;