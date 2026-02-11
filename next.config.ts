import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Similarly, ignore type errors during builds if necessary, 
    // though we try to fix them.
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
