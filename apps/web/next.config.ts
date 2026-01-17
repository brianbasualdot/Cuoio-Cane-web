import type { NextConfig } from "next";

const isDesktop = process.env.TAURI_BUILD === 'true';

const nextConfig: NextConfig = {
  output: isDesktop ? 'export' : undefined,
  images: {
    unoptimized: isDesktop,
  },
};

export default nextConfig;
