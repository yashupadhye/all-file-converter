import type { Metadata } from 'next';
import ToolSearch from '@/components/ToolSearch';
import ToolCard from '@/components/ToolCard';
import { tools, liveTools } from '@/lib/tools';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'All Free PDF & Image Converter Tools',
  description: 'Browse free online PDF and image tools: PDF to JPG, JPG to PDF, merge, split, compress, rotate PDF and image converters. No upload, no sign-up.',
  alternates: { canonical: '/tools/' },
  openGraph: { url: '/tools/', title: `All Tools | ${site.name}`, description: 'Free online PDF and image tools that run in your browser.' },
};

export default function Tools() {
  const soon = tools.filter((t) => t.soon);
  return (
    <main className="section"><div className="container">
      <div className="toolHero"><span className="eyebrow">ALL TOOLS</span><h1>Free PDF & image tools</h1><p>Choose a tool to convert, organize or optimize your files.</p></div>
      <div style={{ marginTop: 30 }}><ToolSearch tools={liveTools} /></div>
      <h2 style={{ fontFamily: 'Space Grotesk', marginTop: 50 }}>Coming soon</h2>
      <p className="sub">Office conversions need heavier processing and are on the roadmap.</p>
      <div className="grid">{soon.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
    </div></main>
  );
}
