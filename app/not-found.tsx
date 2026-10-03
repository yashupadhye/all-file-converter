import Link from 'next/link';
export const metadata = { title: 'Page not found', robots: { index: false } };
export default function NotFound() {
  return (<main className="section"><div className="container article"><h1>Page not found</h1><p>The page you are looking for does not exist.</p><p><Link href="/tools/">Browse all tools →</Link></p></div></main>);
}
