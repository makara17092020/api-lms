import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// next.config.ts
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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
        hostname: "your-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);