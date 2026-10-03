'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import type { Tool } from '@/lib/tools';
export default function ToolSearch({ tools, showBox = true }: { tools: Tool[]; showBox?: boolean }) {
  const [q, setQ] = useState('');
  const s = q.trim().toLowerCase();
  const list = !s ? tools : tools.filter((t) => `${t.name} ${t.input} ${t.output} ${t.keywords.join(' ')}`.toLowerCase().includes(s));
  return (
    <>
      {showBox && (
        <div className="search" role="search"><Search size={20} style={{ margin: '12px 0 0 10px' }} />
          <input className="searchInput" aria-label="Search tools" placeholder="Search PDF, JPG, PNG, merge, compress…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      )}
      <div className="grid" style={{ marginTop: showBox ? 32 : 0, textAlign: 'left' }}>{list.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      {!list.length && <p className="noResult">No tools match “{q}”.</p>}
    </>
  );
}
