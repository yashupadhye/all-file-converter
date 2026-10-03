'use client';
import { useEffect, useRef, useState } from 'react';
import { UploadCloud, Download, CheckCircle, AlertCircle, Loader2, X, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import type { Tool } from '@/lib/tools';
import * as C from '@/lib/convert';
import type { Out } from '@/lib/convert';

const MULTI = ['merge-pdf', 'jpg-to-pdf', 'png-to-pdf', 'jpg-to-png', 'png-to-jpg', 'webp-to-jpg', 'image-compressor'];
const ORDERED = ['merge-pdf', 'jpg-to-pdf', 'png-to-pdf'];

function acceptFor(slug: string, input: string) {
  if (input === 'PDF') return 'application/pdf,.pdf';
  if (slug === 'jpg-to-pdf' || slug === 'jpg-to-png') return 'image/jpeg,.jpg,.jpeg';
  if (slug === 'png-to-pdf' || slug === 'png-to-jpg') return 'image/png,.png';
  if (slug === 'webp-to-jpg') return 'image/webp,.webp';
  return 'image/*';
}

export default function ToolClient({ tool }: { tool: Tool }) {
  const slug = tool.slug;
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [result, setResult] = useState<{ name: string; url: string; size: number; count: number } | null>(null);
  const [drag, setDrag] = useState(false);
  // options
  const [format, setFormat] = useState<'jpg' | 'png'>(slug === 'pdf-to-png' ? 'png' : 'jpg');
  const [scale, setScale] = useState(2);
  const [pages, setPages] = useState('');
  const [pageSize, setPageSize] = useState<'fit' | 'a4'>('a4');
  const [mode, setMode] = useState<'extract' | 'each'>('extract');
  const [angle, setAngle] = useState(90);
  const [level, setLevel] = useState<'light' | 'strong'>('strong');
  const [quality, setQuality] = useState(0.72);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  const multi = MULTI.includes(slug);
  const accept = acceptFor(slug, tool.input);

  function reset() { setResult(null); setErr(''); setNote(''); setMsg(''); }

  function addFiles(list: FileList | File[] | null) {
    if (!list || !list.length) return;
    reset();
    const incoming = [...list];
    const okExt = accept.split(',').filter((a) => a.startsWith('.'));
    const okMime = accept.split(',').filter((a) => !a.startsWith('.'));
    const valid = incoming.filter((f) => okMime.some((m) => (m.endsWith('/*') ? f.type.startsWith(m.slice(0, -1)) : f.type === m)) || okExt.some((e) => f.name.toLowerCase().endsWith(e)));
    if (valid.length !== incoming.length) setErr(`Some files were skipped. This tool accepts ${tool.input === 'IMAGE' ? 'image' : tool.input} files only.`);
    if (!valid.length) return;
    setFiles((prev) => (multi ? [...prev, ...valid] : [valid[0]]));
  }

  function move(i: number, d: number) {
    setFiles((p) => { const a = [...p]; const j = i + d; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; });
  }

  async function run() {
    if (!files.length) { inputRef.current?.click(); return; }
    reset(); setBusy(true); setMsg('Starting…');
    try {
      let outs: Out[] = [];
      const say = (m: string) => setMsg(m);
      if (slug === 'pdf-to-jpg' || slug === 'pdf-to-png') outs = await C.pdfToImages(files[0], { format, scale, pages }, say);
      else if (slug === 'pdf-to-text') outs = await C.pdfToText(files[0], say);
      else if (slug === 'jpg-to-pdf' || slug === 'png-to-pdf') outs = await C.imagesToPdf(files, { pageSize }, say);
      else if (slug === 'merge-pdf') outs = await C.mergePdfs(files, say);
      else if (slug === 'split-pdf') outs = await C.splitPdf(files[0], { mode, pages }, say);
      else if (slug === 'rotate-pdf') outs = await C.rotatePdf(files[0], { angle, pages }, say);
      else if (slug === 'compress-pdf') { const r = await C.compressPdf(files[0], { level }, say); outs = r.outs; setNote(r.note); }
      else if (slug === 'jpg-to-png') { const r = await C.convertImages(files, { target: 'png', quality: 1 }, say); outs = r.outs; }
      else if (slug === 'png-to-jpg' || slug === 'webp-to-jpg') { const r = await C.convertImages(files, { target: 'jpg', quality }, say); outs = r.outs; }
      else if (slug === 'image-compressor') { const r = await C.convertImages(files, { target: 'compress', quality }, say); outs = r.outs; setNote(r.note); }
      else throw new Error('This tool is not available yet.');

      if (!outs.length) throw new Error('Nothing to export.');
      let final: Out;
      if (outs.length === 1) final = outs[0];
      else {
        setMsg('Creating ZIP…');
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        const used = new Set<string>();
        outs.forEach((o) => { let n = o.name; let k = 1; while (used.has(n)) n = `${k++}-${o.name}`; used.add(n); zip.file(n, o.blob); });
        final = { name: `${slug}-files.zip`, blob: await zip.generateAsync({ type: 'blob' }) };
      }
      const url = URL.createObjectURL(final.blob);
      setResult({ name: final.name, url, size: final.blob.size, count: outs.length });
      setMsg('');
    } catch (e: any) {
      setErr(e?.message || 'Could not process this file. Check the format and try again.');
      setMsg('');
    } finally { setBusy(false); }
  }

  const pageField = (label: string, hint: string) => (
    <label className="opt"><span>{label}</span><input type="text" value={pages} onChange={(e) => setPages(e.target.value)} placeholder={hint} /></label>
  );

  return (
    <div className="uploader"
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
      style={drag ? { borderColor: '#6d5dfc', background: '#faf9ff' } : undefined}>
      <input ref={inputRef} className="fileInput" type="file" multiple={multi} accept={accept}
        onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
      <div className="uploadIcon">{busy ? <Loader2 className="spin" /> : <UploadCloud size={29} />}</div>
      <h2>{busy ? 'Processing…' : files.length ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'Drop your file here'}</h2>
      <p>{files.length ? 'Adjust the options below, then convert.' : 'Files are processed in your browser and never uploaded.'}</p>

      {files.length > 0 && (
        <ul className="fileList">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <FileText size={16} /><span className="fname">{f.name}</span><small>{C.fmt(f.size)}</small>
              {ORDERED.includes(slug) && files.length > 1 && <>
                <button aria-label="Move up" onClick={() => move(i, -1)} disabled={busy}><ArrowUp size={14} /></button>
                <button aria-label="Move down" onClick={() => move(i, 1)} disabled={busy}><ArrowDown size={14} /></button></>}
              <button aria-label={`Remove ${f.name}`} onClick={() => { reset(); setFiles(files.filter((_, j) => j !== i)); }} disabled={busy}><X size={14} /></button>
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <div className="opts">
          {(slug === 'pdf-to-jpg' || slug === 'pdf-to-png') && <>
            <label className="opt"><span>Quality</span>
              <select value={scale} onChange={(e) => setScale(+e.target.value)}>
                <option value={1}>Standard (72 DPI)</option><option value={2}>High (144 DPI)</option><option value={3}>Very high (216 DPI)</option></select></label>
            {pageField('Pages (optional)', 'All pages, or e.g. 1-3, 5')}</>}
          {(jpgPdf(slug)) && <label className="opt"><span>Page size</span>
            <select value={pageSize} onChange={(e) => setPageSize(e.target.value as any)}>
              <option value="a4">A4 page (image centered)</option><option value="fit">Same size as image</option></select></label>}
          {slug === 'split-pdf' && <>
            <label className="opt"><span>Mode</span>
              <select value={mode} onChange={(e) => setMode(e.target.value as any)}>
                <option value="extract">Extract pages into one PDF</option><option value="each">Split into separate PDFs (ZIP)</option></select></label>
            {pageField('Pages', 'All pages, or e.g. 1-3, 5')}</>}
          {slug === 'rotate-pdf' && <>
            <label className="opt"><span>Rotate</span>
              <select value={angle} onChange={(e) => setAngle(+e.target.value)}>
                <option value={90}>90° clockwise</option><option value={180}>180°</option><option value={270}>90° counter-clockwise</option></select></label>
            {pageField('Pages (optional)', 'All pages, or e.g. 1-3, 5')}</>}
          {slug === 'compress-pdf' && <label className="opt"><span>Compression</span>
            <select value={level} onChange={(e) => setLevel(e.target.value as any)}>
              <option value="strong">Strong (smaller, text becomes image)</option><option value="light">Light (keeps text selectable)</option></select></label>}
          {(slug === 'png-to-jpg' || slug === 'webp-to-jpg' || slug === 'image-compressor') &&
            <label className="opt"><span>Quality: {Math.round(quality * 100)}%</span>
              <input type="range" min={0.3} max={1} step={0.01} value={quality} onChange={(e) => setQuality(+e.target.value)} /></label>}
        </div>
      )}

      <div className="actions">
        <button className="btn ghost" onClick={() => inputRef.current?.click()} disabled={busy}>{files.length ? (multi ? 'Add more files' : 'Change file') : 'Choose file'}</button>
        {files.length > 0 && <button className="btn primary" onClick={run} disabled={busy}>{busy ? 'Please wait…' : `Convert ${tool.name.replace(/ to /i, ' → ')}`}</button>}
      </div>

      <div aria-live="polite">
        {msg && <div className="status"><Loader2 size={15} className="spin" style={{ verticalAlign: '-3px', marginRight: 6 }} />{msg}</div>}
        {err && <div className="status error"><AlertCircle size={15} style={{ verticalAlign: '-3px', marginRight: 6 }} />{err}</div>}
        {result && (
          <div className="status ok">
            <CheckCircle size={15} style={{ verticalAlign: '-3px', marginRight: 6 }} />
            Done — {result.count > 1 ? `${result.count} files packed in a ZIP` : 'your file is ready'} ({C.fmt(result.size)}). {note}
            <div style={{ marginTop: 12 }}>
              <a className="btn primary" href={result.url} download={result.name}><Download size={15} style={{ verticalAlign: '-3px', marginRight: 6 }} />Download {result.name}</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function jpgPdf(s: string) { return s === 'jpg-to-pdf' || s === 'png-to-pdf'; }
