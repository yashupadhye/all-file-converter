import type { Metadata } from 'next';
import { site } from '@/lib/site';
export const metadata: Metadata = { title: 'Privacy Policy', description: `Privacy policy for ${site.name}. Your files are processed in your browser and are never uploaded.`, alternates: { canonical: '/privacy/' } };
export default function Privacy() {
  return (<main className="section"><div className="container article">
    <h1>Privacy Policy</h1>
    <p>Last updated: {new Date().getFullYear()}</p>
    <h2>Your files</h2>
    <p>All conversions run locally in your web browser. Your files are not uploaded to our servers, are not stored, and are not shared with anyone.</p>
    <h2>Information we collect</h2>
    <p>We do not require an account and do not collect personal information through the tools. Our hosting provider may keep standard server logs (such as IP address and page requests) for security and performance.</p>
    <h2>Cookies and advertising</h2>
    <p>If we add analytics or advertising (for example Google AdSense), those providers may use cookies. This page will be updated before that happens.</p>
    <h2>Contact</h2>
    <p>Questions about privacy? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
  </div></main>);
}
