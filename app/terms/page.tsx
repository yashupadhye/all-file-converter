import type { Metadata } from 'next';
import { site } from '@/lib/site';
export const metadata: Metadata = { title: 'Terms of Service', description: `Terms of service for using ${site.name}.`, alternates: { canonical: '/terms/' } };
export default function Terms() {
  return (<main className="section"><div className="container article">
    <h1>Terms of Service</h1>
    <p>By using {site.name} you agree to these terms.</p>
    <h2>Use of the service</h2>
    <p>{site.name} is provided free of charge and “as is”, without warranties. You are responsible for the files you process and for having the right to use them.</p>
    <h2>Limitation of liability</h2>
    <p>We are not liable for any loss or damage resulting from the use of the tools. Always keep a backup of important files.</p>
    <h2>Changes</h2>
    <p>We may update these terms and the tools at any time.</p>
  </div></main>);
}
