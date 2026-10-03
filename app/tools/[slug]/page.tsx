import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { tools, getTool } from '@/lib/tools';
import { getContent } from '@/lib/content';
import ToolClient from '@/components/ToolClient';
import ToolCard from '@/components/ToolCard';
import { site } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((t) => ({ slug: t.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) return {};
  const c = getContent(t);
  const desc = `${t.description} Free, private and no sign-up – files stay in your browser.`.slice(0, 160);
  return {
    title: { absolute: `${c.title} | ${site.name}` },
    description: desc,
    keywords: [...t.keywords, 'free', 'online', 'no upload'],
    alternates: { canonical: `/tools/${t.slug}/` },
    robots: t.soon ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { type: 'website', title: `${c.title} | ${site.name}`, description: desc, url: `/tools/${t.slug}/`, siteName: site.name, images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: c.title, description: desc, images: ['/og-image.png'] },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) notFound();
  const c = getContent(t);
  const url = `${site.url}/tools/${t.slug}/`;
  const related = tools.filter((x) => !x.soon && x.slug !== t.slug && (x.category === t.category || x.input === t.input)).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebApplication', name: `${t.name} – ${site.name}`, url, description: t.description, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any (web browser)', browserRequirements: 'Requires JavaScript', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, inLanguage: 'en' },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: `${site.url}/tools/` },
        { '@type': 'ListItem', position: 3, name: t.name, item: url } ] },
      { '@type': 'HowTo', name: `How to use ${t.name}`, step: c.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s, text: s })) },
      { '@type': 'FAQPage', mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  return (
    <main className="toolPage"><div className="container">
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <ChevronRight size={13} style={{ verticalAlign: '-2px' }} /> <Link href="/tools/">Tools</Link> <ChevronRight size={13} style={{ verticalAlign: '-2px' }} /> {t.name}</nav>
      <section className="toolHero"><span className="eyebrow">{t.category.toUpperCase()} TOOL</span><h1>{t.name}</h1><p>{c.intro}</p></section>

      {t.soon ? (
        <div className="notice"><h2>{t.name} is coming soon</h2><p>This conversion needs heavier processing than a browser can do reliably, so we are not offering it yet. In the meantime, try one of our working tools.</p><Link className="btn primary" href="/tools/">Browse available tools</Link></div>
      ) : <ToolClient tool={t} />}

      <article className="article">
        <h2>How to use {t.name}</h2>
        <ol>{c.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        {c.tips.length > 0 && (<><h2>Tips</h2><ul>{c.tips.map((s) => <li key={s}>{s}</li>)}</ul></>)}
        <h2>Why use {site.name}?</h2>
        <p>{t.name} runs entirely in your browser. There is no upload, no waiting in a queue, no watermark and no sign-up, so it is fast and your files stay private.</p>
        <h2>Frequently asked questions</h2>
        {c.faq.map((f) => <details className="faq" key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </article>

      {related.length > 0 && (<div className="section" style={{ paddingTop: 10 }}><h2>Related tools</h2><div className="grid">{related.map((x) => <ToolCard key={x.slug} tool={x} />)}</div></div>)}
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
