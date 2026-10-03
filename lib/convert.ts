'use client';
import { PDFDocument, degrees } from 'pdf-lib';
import { withBase } from '@/lib/site';

export type Out = { name: string; blob: Blob };
export type Progress = (msg: string) => void;

const baseName = (n: string) => n.replace(/\.[^.]+$/, '') || 'file';
const toBuf = (f: File) => f.arrayBuffer();

/* ---------- helpers ---------- */
export function parseRange(input: string, total: number): number[] {
  const text = input.trim();
  if (!text) return Array.from({ length: total }, (_, i) => i);
  const out = new Set<number>();
  for (const part of text.split(',')) {
    const m = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error(`Invalid page range "${part.trim()}". Use a format like 1-3, 5, 8-10.`);
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    if (a < 1 || b < a || b > total) throw new Error(`Page range "${part.trim()}" is outside this PDF (it has ${total} pages).`);
    for (let i = a; i <= b; i++) out.add(i - 1);
  }
  return [...out].sort((x, y) => x - y);
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('This image could not be read. Is the file damaged or an unsupported format?')); };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Your browser could not encode the image.'))), mime, quality),
  );
}

async function loadPdfLib(file: File) {
  try {
    return await PDFDocument.load(await toBuf(file));
  } catch {
    throw new Error(`"${file.name}" could not be opened. It may be damaged or password-protected.`);
  }
}

async function openPdfJs(file: File) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = withBase('/pdf.worker.min.mjs');
  try {
    const task = pdfjs.getDocument({ data: new Uint8Array(await toBuf(file)) });
    return await task.promise;
  } catch (e: any) {
    if (e?.name === 'PasswordException') throw new Error('This PDF is password-protected. Remove the password first, then try again.');
    throw new Error('This PDF could not be opened. It may be damaged.');
  }
}

async function closePdf(pdf: any) {
  try { await (pdf.loadingTask?.destroy?.() ?? pdf.cleanup?.()); } catch { /* ignore */ }
}

async function renderPage(pdf: any, pageNo: number, scale: number, mime: string, quality: number): Promise<Blob> {
  const page = await pdf.getPage(pageNo);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, canvas, viewport }).promise;
  page.cleanup?.();
  const blob = await canvasToBlob(canvas, mime, quality);
  canvas.width = canvas.height = 0;
  return blob;
}

/* ---------- PDF -> image / text ---------- */
export async function pdfToImages(file: File, o: { format: 'jpg' | 'png'; scale: number; pages: string }, say: Progress): Promise<Out[]> {
  const pdf = await openPdfJs(file);
  const idx = parseRange(o.pages, pdf.numPages);
  const mime = o.format === 'jpg' ? 'image/jpeg' : 'image/png';
  const outs: Out[] = [];
  for (let i = 0; i < idx.length; i++) {
    say(`Rendering page ${idx[i] + 1} (${i + 1} of ${idx.length})…`);
    const blob = await renderPage(pdf, idx[i] + 1, o.scale, mime, 0.92);
    outs.push({ name: `${baseName(file.name)}-page-${idx[i] + 1}.${o.format}`, blob });
  }
  await closePdf(pdf);
  return outs;
}

export async function pdfToText(file: File, say: Progress): Promise<Out[]> {
  const pdf = await openPdfJs(file);
  let text = '';
  for (let p = 1; p <= pdf.numPages; p++) {
    say(`Reading page ${p} of ${pdf.numPages}…`);
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    let line = '';
    for (const it of content.items as any[]) {
      line += it.str;
      line += it.hasEOL ? '\n' : ' ';
    }
    text += `--- Page ${p} ---\n${line.trim()}\n\n`;
  }
  await closePdf(pdf);
  if (!text.replace(/--- Page \d+ ---/g, '').trim())
    throw new Error('No selectable text found. This looks like a scanned PDF (images only), which needs OCR.');
  return [{ name: `${baseName(file.name)}.txt`, blob: new Blob([text], { type: 'text/plain;charset=utf-8' }) }];
}

/* ---------- images -> PDF ---------- */
export async function imagesToPdf(files: File[], o: { pageSize: 'fit' | 'a4' }, say: Progress): Promise<Out[]> {
  const pdf = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    say(`Adding image ${i + 1} of ${files.length}…`);
    let bytes: ArrayBuffer | Uint8Array = await toBuf(f);
    let img;
    if (f.type === 'image/jpeg') img = await pdf.embedJpg(bytes);
    else if (f.type === 'image/png') img = await pdf.embedPng(bytes);
    else {
      // WEBP / GIF / BMP etc: re-encode through canvas
      const el = await loadImage(f);
      const c = document.createElement('canvas');
      c.width = el.naturalWidth; c.height = el.naturalHeight;
      c.getContext('2d')!.drawImage(el, 0, 0);
      bytes = new Uint8Array(await (await canvasToBlob(c, 'image/png')).arrayBuffer());
      img = await pdf.embedPng(bytes);
    }
    if (o.pageSize === 'a4') {
      const [W, H] = [595.28, 841.89];
      const m = 24;
      const s = Math.min((W - 2 * m) / img.width, (H - 2 * m) / img.height, 1e6);
      const w = img.width * s, h = img.height * s;
      const page = pdf.addPage([W, H]);
      page.drawImage(img, { x: (W - w) / 2, y: (H - h) / 2, width: w, height: h });
    } else {
      const page = pdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
  }
  const out = await pdf.save();
  return [{ name: files.length === 1 ? `${baseName(files[0].name)}.pdf` : 'images.pdf', blob: new Blob([out as BlobPart], { type: 'application/pdf' }) }];
}

/* ---------- PDF organise ---------- */
export async function mergePdfs(files: File[], say: Progress): Promise<Out[]> {
  if (files.length < 2) throw new Error('Select at least 2 PDF files to merge.');
  const merged = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    say(`Merging file ${i + 1} of ${files.length}…`);
    const src = await loadPdfLib(files[i]);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  return [{ name: 'merged.pdf', blob: new Blob([(await merged.save()) as BlobPart], { type: 'application/pdf' }) }];
}

export async function splitPdf(file: File, o: { mode: 'extract' | 'each'; pages: string }, say: Progress): Promise<Out[]> {
  const src = await loadPdfLib(file);
  const total = src.getPageCount();
  const idx = parseRange(o.pages, total);
  if (o.mode === 'extract') {
    say('Extracting pages…');
    const out = await PDFDocument.create();
    (await out.copyPages(src, idx)).forEach((p) => out.addPage(p));
    return [{ name: `${baseName(file.name)}-extracted.pdf`, blob: new Blob([(await out.save()) as BlobPart], { type: 'application/pdf' }) }];
  }
  const outs: Out[] = [];
  for (const i of idx) {
    say(`Splitting page ${i + 1}…`);
    const out = await PDFDocument.create();
    (await out.copyPages(src, [i])).forEach((p) => out.addPage(p));
    outs.push({ name: `${baseName(file.name)}-page-${i + 1}.pdf`, blob: new Blob([(await out.save()) as BlobPart], { type: 'application/pdf' }) });
  }
  return outs;
}

export async function rotatePdf(file: File, o: { angle: number; pages: string }, say: Progress): Promise<Out[]> {
  const src = await loadPdfLib(file);
  const idx = new Set(parseRange(o.pages, src.getPageCount()));
  say('Rotating pages…');
  src.getPages().forEach((p, i) => {
    if (idx.has(i)) p.setRotation(degrees((p.getRotation().angle + o.angle) % 360));
  });
  return [{ name: `${baseName(file.name)}-rotated.pdf`, blob: new Blob([(await src.save()) as BlobPart], { type: 'application/pdf' }) }];
}

export async function compressPdf(file: File, o: { level: 'light' | 'strong' }, say: Progress): Promise<{ outs: Out[]; note: string }> {
  say('Optimizing PDF structure…');
  const src = await loadPdfLib(file);
  const light = new Blob([(await src.save({ useObjectStreams: true })) as BlobPart], { type: 'application/pdf' });
  let best = light;
  let note = '';
  if (o.level === 'strong') {
    const pdf = await openPdfJs(file);
    const out = await PDFDocument.create();
    for (let p = 1; p <= pdf.numPages; p++) {
      say(`Compressing page ${p} of ${pdf.numPages}…`);
      const page = await pdf.getPage(p);
      const vp1 = page.getViewport({ scale: 1 });
      const jpg = await renderPage(pdf, p, 1.4, 'image/jpeg', 0.6);
      const img = await out.embedJpg(await jpg.arrayBuffer());
      const pg = out.addPage([vp1.width, vp1.height]);
      pg.drawImage(img, { x: 0, y: 0, width: vp1.width, height: vp1.height });
    }
    await closePdf(pdf);
    const strong = new Blob([(await out.save()) as BlobPart], { type: 'application/pdf' });
    if (strong.size < best.size) {
      best = strong;
      note = ' Strong mode converts pages to images, so text is no longer selectable.';
    }
  }
  if (best.size >= file.size) {
    return { outs: [{ name: file.name, blob: file }], note: 'This PDF is already well optimized, so your original file is returned unchanged.' };
  }
  const saved = Math.round((1 - best.size / file.size) * 100);
  return { outs: [{ name: `${baseName(file.name)}-compressed.pdf`, blob: best }], note: `Reduced by ${saved}% (${fmt(file.size)} → ${fmt(best.size)}).${note}` };
}

/* ---------- image tools ---------- */
export async function convertImages(
  files: File[],
  o: { target: 'jpg' | 'png' | 'compress'; quality: number },
  say: Progress,
): Promise<{ outs: Out[]; note: string }> {
  const outs: Out[] = [];
  let before = 0, after = 0;
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    say(`Converting image ${i + 1} of ${files.length}…`);
    const img = await loadImage(f);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    let mime = 'image/jpeg', ext = 'jpg';
    if (o.target === 'png') { mime = 'image/png'; ext = 'png'; }
    else if (o.target === 'compress' && f.type !== 'image/jpeg') { mime = 'image/webp'; ext = 'webp'; }
    if (mime === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); } // no black background for transparent PNG/WEBP
    ctx.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, mime, o.target === 'png' ? undefined : o.quality);
    before += f.size; after += blob.size;
    if (o.target === 'compress' && blob.size >= f.size) outs.push({ name: f.name, blob: f });
    else outs.push({ name: `${baseName(f.name)}${o.target === 'compress' ? '-compressed' : ''}.${ext}`, blob });
  }
  const note = o.target === 'compress' ? `Total size: ${fmt(before)} → ${fmt(Math.min(after, before))}.` : '';
  return { outs, note };
}

export function fmt(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(2)} MB`;
}
