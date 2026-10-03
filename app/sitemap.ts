import type { MetadataRoute } from 'next';
import { liveTools } from '@/lib/tools';
import { site } from '@/lib/site';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, priority: 1, changeFrequency: 'weekly' },
    { url: `${site.url}/tools/`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    ...liveTools.map((t) => ({ url: `${site.url}/tools/${t.slug}/`, lastModified: now, priority: t.popular ? 0.8 : 0.6, changeFrequency: 'monthly' as const })),
    ...['about', 'contact', 'privacy', 'terms'].map((x) => ({ url: `${site.url}/${x}/`, lastModified: now, priority: 0.3, changeFrequency: 'yearly' as const })),
  ];
}
