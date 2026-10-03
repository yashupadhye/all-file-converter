import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
export const dynamic = 'force-static';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} – ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f8fc',
    theme_color: '#6d5dfc',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
