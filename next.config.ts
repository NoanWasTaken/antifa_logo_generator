import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Logo submissions are validated up to 2MB
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  turbopack: {
    root: "./",
  },
};

export default nextConfig;
