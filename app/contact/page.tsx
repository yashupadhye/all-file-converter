import type { Metadata } from 'next';
import { site } from '@/lib/site';
export const metadata: Metadata = { title: 'Contact', description: `Contact the ${site.name} team for support, feedback or partnerships.`, alternates: { canonical: '/contact/' } };
export default function Contact() {
  return (<main className="section"><div className="container article">
    <h1>Contact</h1>
    <p>For support, feedback, bug reports or partnerships, email us at <a href={`mailto:${site.email}`} style={{ color: '#5949e8', fontWeight: 700 }}>{site.email}</a>.</p>
    <p>Please mention the tool you used and your browser so we can help faster.</p>
  </div></main>);
}
