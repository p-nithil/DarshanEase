import type { NextConfig } from "next";

// In Vercel, set NEXT_PUBLIC_BACKEND_URL to your Render backend URL in the environment variables.
// e.g. https://your-actual-render-service.onrender.com
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
