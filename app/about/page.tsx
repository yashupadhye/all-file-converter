import type { Metadata } from 'next';
import { site } from '@/lib/site';
export const metadata: Metadata = { title: 'About', description: `About ${site.name}: free, privacy-first PDF and image tools that run in your browser.`, alternates: { canonical: '/about/' } };
export default function About() {
  return (<main className="section"><div className="container article">
    <h1>About {site.name}</h1>
    <p>{site.name} is a free toolkit for everyday PDF and image tasks: convert PDF to JPG or PNG, create PDFs from images, merge, split, rotate and compress PDFs, and convert or compress images.</p>
    <h2>Privacy by design</h2>
    <p>Every tool runs inside your browser. Your files are not uploaded, not stored and not shared, which makes {site.name} suitable for sensitive documents.</p>
    <h2>Free and simple</h2>
    <p>No account, no watermark and no daily limits. Pick a tool, add your file and download the result.</p>
  </div></main>);
}
