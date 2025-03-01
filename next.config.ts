import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: (process.env.NEXT_PUBLIC_FRONTEND_BASE_URL == undefined) ? '':
    (process.env.NEXT_PUBLIC_FRONTEND_BASE_URL == '__NEXT_PUBLIC_FRONTEND_BASE_URL__') ? '':
    process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
};

export default nextConfig;
