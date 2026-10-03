import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Static export => works on Cloudflare Pages, GitHub Pages, Netlify, Vercel (all free tiers).
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  compress: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};
export default nextConfig;
