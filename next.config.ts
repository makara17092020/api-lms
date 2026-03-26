// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "your-storage.com", // This stops it from crashing on dummy links!
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
