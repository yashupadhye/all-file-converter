import type { Metadata, Viewport } from 'next';
import './globals.css';
import Link from 'next/link';
import { FileStack, ArrowRight, Menu } from 'lucide-react';
import { site } from '@/lib/site';

const title = `${site.name} – ${site.tagline}`;

export const viewport: Viewport = { themeColor: '#6d5dfc', width: 'device-width', initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(site.url + '/'),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: site.keywords,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: 'utilities',
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }], apple: '/apple-touch-icon.png' },
  manifest: '/manifest.webmanifest',
  openGraph: { type: 'website', siteName: site.name, locale: 'en_US', title, description: site.description, url: '/', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }] },
  twitter: { card: 'summary_large_image', title, description: site.description, images: ['/og-image.png'] },
  verification: {
    ...(site.googleVerification ? { google: site.googleVerification } : {}),
    ...(site.bingVerification ? { other: { 'msvalidate.01': site.bingVerification } } : {}),
  },
};

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': `${site.url}/#website`, url: `${site.url}/`, name: site.name, description: site.description, inLanguage: 'en' },
    { '@type': 'Organization', '@id': `${site.url}/#org`, name: site.name, url: `${site.url}/`, logo: `${site.url}/icon-512.png`, email: site.email },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <header className="nav">
          <div className="container navin">
            <Link href="/" className="logo"><span className="logoMark"><FileStack size={19} /></span>{site.name}</Link>
            <nav className="navlinks" aria-label="Main">
              <Link href="/tools/">All Tools</Link>
              <Link href="/tools/pdf-to-jpg/">PDF to JPG</Link>
              <Link href="/tools/merge-pdf/">Merge PDF</Link>
              <Link href="/about/">About</Link>
              <Link href="/contact/">Contact</Link>
            </nav>
            <Link href="/tools/" className="btn primary navCta">Start converting <ArrowRight size={15} style={{ verticalAlign: '-2px' }} /></Link>
            <details className="mobileMenu">
              <summary aria-label="Menu"><Menu size={22} /></summary>
              <div className="mobilePanel">
                <Link href="/tools/">All Tools</Link><Link href="/tools/pdf-to-jpg/">PDF to JPG</Link><Link href="/tools/merge-pdf/">Merge PDF</Link>
                <Link href="/tools/compress-pdf/">Compress PDF</Link><Link href="/about/">About</Link><Link href="/contact/">Contact</Link>
              </div>
            </details>
          </div>
        </header>
        <div id="main">{children}</div>
        <footer className="footer">
          <div className="container footerGrid">
            <div>
              <div className="logo" style={{ color: '#fff' }}><span className="logoMark"><FileStack size={19} /></span>{site.name}</div>
              <p>Simple, fast and privacy-first file tools. Your files never leave your device.</p>
            </div>
            <div><h4>Popular tools</h4><Link href="/tools/pdf-to-jpg/">PDF to JPG</Link><Link href="/tools/merge-pdf/">Merge PDF</Link><Link href="/tools/compress-pdf/">Compress PDF</Link><Link href="/tools/jpg-to-pdf/">JPG to PDF</Link></div>
            <div><h4>Company</h4><Link href="/about/">About</Link><Link href="/contact/">Contact</Link><Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link></div>
            <div><h4>Resources</h4><Link href="/tools/">All tools</Link><Link href="/sitemap.xml">Sitemap</Link></div>
          </div>
          <div className="container" style={{ borderTop: '1px solid #292c3d', marginTop: 35, paddingTop: 22, fontSize: 13 }}>© {new Date().getFullYear()} {site.name}. All rights reserved.</div>
        </footer>
      </body>
    </html>
  );
}
