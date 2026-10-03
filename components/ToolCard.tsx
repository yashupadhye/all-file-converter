import Link from 'next/link';
import { ArrowUpRight, FileText, FileImage, Files, Scissors, Minimize2, RotateCw, Table2, Presentation, Image as ImageIcon } from 'lucide-react';
import type { Tool } from '@/lib/tools';
const icons: Record<string, any> = { FileText, FileImage, Files, Scissors, Minimize2, RotateCw, Table2, Presentation, Image: ImageIcon };
export default function ToolCard({ tool }: { tool: Tool }) {
  const Icon = icons[tool.icon] || FileText;
  return (
    <Link className="tool" href={`/tools/${tool.slug}/`}>
      <div className="icon"><Icon size={21} /></div>
      {tool.popular && <span className="badge">Popular</span>}
      {tool.soon && <span className="badge">Soon</span>}
      <h3>{tool.name} <ArrowUpRight size={14} style={{ verticalAlign: '-2px' }} /></h3>
      <p>{tool.description}</p>
    </Link>
  );
}
