import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone", 
  // This helps Next.js find the Prisma files in the standalone folder
  experimental: {
    outputFileTracingIncludes: {
      '/**': ['./prisma/**/*'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "your-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);