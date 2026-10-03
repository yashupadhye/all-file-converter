import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Zap, LockKeyhole, Gift } from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import ToolSearch from '@/components/ToolSearch';
import { liveTools, categories } from '@/lib/tools';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: `${site.name} – Free Online PDF to JPG Converter, Merge, Split & Compress PDF` },
  description: site.description,
  alternates: { canonical: '/' },
};

export default function Home() {
  const popular = liveTools.filter((t) => t.popular);
  return (
    <main>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">FAST • PRIVATE • 100% FREE</span>
          <h1>Every file tool you need, <span>in one place.</span></h1>
          <p>Convert PDF to JPG, merge, split and compress PDFs, and convert images — all inside your browser. No uploads, no sign-up.</p>
          <ToolSearch tools={liveTools} />
        </div>
      </section>
      <section className="section" id="popular"><div className="container">
        <h2>Popular tools</h2><p className="sub">Start with the tools people use most.</p>
        <div className="grid">{popular.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></div></section>
      <section className="section" id="categories"><div className="container">
        <h2>All file tools</h2><p className="sub">Free converters for PDF and image files.</p>
        <div className="categories">{categories.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
        <div className="grid">{liveTools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></div></section>
      <section className="section"><div className="container"><div className="grid">
        <div className="tool"><div className="icon"><ShieldCheck /></div><h3>Privacy-first</h3><p>Files are processed on your device and never uploaded to a server.</p></div>
        <div className="tool"><div className="icon"><Zap /></div><h3>Fast by design</h3><p>No waiting for uploads or queues. Conversion starts instantly.</p></div>
        <div className="tool"><div className="icon"><LockKeyhole /></div><h3>Secure</h3><p>Nothing is stored, so there is nothing to leak or delete later.</p></div>
        <div className="tool"><div className="icon"><Gift /></div><h3>Free forever</h3><p>No account, no watermark and no daily limits.</p></div></div></div></section>
      <section className="section"><div className="container article">
        <h2>Free online PDF and image converter</h2>
        <p>{site.name} is a collection of free online tools to convert PDF to JPG or PNG, turn images into PDF, merge and split PDF files, rotate pages, compress PDF and reduce image size. Because everything runs in your browser, conversions are fast and your documents stay private.</p></div></section>
      <section className="section"><div className="container"><div className="cta"><h2>Simple tools. Better workflow.</h2><p>Pick a tool and convert your first file in seconds.</p><Link className="btn primary" href="/tools/">Explore all tools</Link></div></div></section>
    </main>
  );
}
