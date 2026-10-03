import type { Tool } from '@/lib/tools';
import { site } from '@/lib/site';

export type Faq = { q: string; a: string };
type Extra = { intro: string; steps: string[]; tips: string[]; faq: Faq[]; title: string };

const privacyFaq: Faq = {
  q: 'Are my files uploaded to a server?',
  a: `No. ${site.name} runs the conversion inside your own browser, so your files never leave your device and nothing is stored on our servers.`,
};
const freeFaq = (t: Tool): Faq => ({
  q: `Is ${t.name} really free?`,
  a: `Yes. ${t.name} is free to use with no sign-up, no watermark and no daily limit.`,
});

const specific: Record<string, Partial<Extra>> = {
  'pdf-to-jpg': {
    title: 'PDF to JPG Converter – Free Online, No Upload',
    intro: 'Turn every page of a PDF into a sharp JPG image. Choose the resolution, pick specific pages if you only need a few, and download the images as a ZIP. Everything happens in your browser, so private documents stay private.',
    steps: ['Choose or drop your PDF file.', 'Select the image quality (DPI) and, optionally, the pages you want.', 'Click Convert and download your JPG images (a ZIP if there are several pages).'],
    tips: ['Use High (144 DPI) for sharing and Very high (216 DPI) for printing.', 'Enter a range like 1-3, 5 to convert only some pages.'],
    faq: [
      { q: 'How do I convert a PDF to JPG?', a: 'Upload your PDF, choose the quality, press Convert and download the JPG images. Multi-page PDFs are delivered as a ZIP file with one image per page.' },
      { q: 'Can I convert only some pages of a PDF to JPG?', a: 'Yes. Type a page range such as 1-3, 5 in the Pages field to export just those pages.' },
      { q: 'What resolution are the JPG images?', a: 'You can choose 72, 144 or 216 DPI. Higher values give sharper images and larger files.' },
    ],
  },
  'pdf-to-png': {
    title: 'PDF to PNG Converter – Free Online, No Upload',
    intro: 'Export PDF pages as lossless PNG images with a white background. Ideal for slides, diagrams and graphics where crisp edges matter.',
    steps: ['Choose or drop your PDF file.', 'Pick the image quality and optional page range.', 'Click Convert and download your PNG images.'],
    tips: ['PNG files are larger than JPG but keep text and lines perfectly sharp.'],
    faq: [{ q: 'When should I use PNG instead of JPG?', a: 'Use PNG for text, logos, charts and screenshots where sharp edges matter. Use JPG for photos when you need a smaller file.' }],
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF Converter – Free Online, No Upload',
    intro: 'Combine one or many JPG images into a single PDF. Reorder the images, choose A4 or original size, and download a clean document in seconds.',
    steps: ['Choose or drop one or more JPG images.', 'Reorder them with the arrows and choose the page size.', 'Click Convert and download your PDF.'],
    tips: ['Choose "A4 page" for printing and "Same size as image" to keep the original dimensions.'],
    faq: [{ q: 'Can I convert multiple JPG images into one PDF?', a: 'Yes. Add as many images as you like, arrange their order and they will be combined into a single PDF, one image per page.' }],
  },
  'png-to-pdf': {
    title: 'PNG to PDF Converter – Free Online, No Upload',
    intro: 'Convert PNG images to a PDF document and keep transparency-free, crisp quality. Combine several PNG files into one PDF in the order you choose.',
    steps: ['Choose or drop your PNG files.', 'Reorder and choose the page size.', 'Click Convert and download the PDF.'],
    tips: [],
    faq: [{ q: 'Does PNG to PDF keep image quality?', a: 'Yes. PNG images are embedded without extra compression, so quality is preserved.' }],
  },
  'merge-pdf': {
    title: 'Merge PDF – Combine PDF Files Online for Free',
    intro: 'Join two or more PDF files into one document. Arrange the files in the order you want and merge them without uploading anything.',
    steps: ['Add two or more PDF files.', 'Use the arrows to set the order.', 'Click Convert and download merged.pdf.'],
    tips: ['Password-protected PDFs must be unlocked before merging.'],
    faq: [{ q: 'How many PDFs can I merge?', a: 'There is no fixed limit. The practical limit is your device memory, since processing happens in your browser.' }],
  },
  'split-pdf': {
    title: 'Split PDF – Extract Pages from PDF Online for Free',
    intro: 'Extract the pages you need from a PDF, or split every page into its own file. Enter page numbers or ranges and download the result.',
    steps: ['Choose your PDF.', 'Pick a mode and enter pages like 1-3, 5, 8-10.', 'Click Convert and download the new PDF (or ZIP).'],
    tips: ['Leave the page field empty to use all pages.'],
    faq: [{ q: 'How do I extract specific pages from a PDF?', a: 'Choose "Extract pages", type the page numbers or ranges you want, then convert. You will get a new PDF with only those pages.' }],
  },
  'compress-pdf': {
    title: 'Compress PDF – Reduce PDF Size Online for Free',
    intro: 'Make large PDFs smaller for email and uploads. Choose Strong compression for the biggest reduction or Light to keep text selectable.',
    steps: ['Choose your PDF.', 'Select Strong or Light compression.', 'Click Convert and download the smaller PDF.'],
    tips: ['Strong compression turns pages into images, so text can no longer be selected.', 'If the PDF is already optimized, the original is returned unchanged.'],
    faq: [{ q: 'How much can a PDF be compressed?', a: 'Scanned or image-heavy PDFs often shrink a lot. Text-only PDFs are usually already small, so savings are smaller.' }],
  },
  'rotate-pdf': {
    title: 'Rotate PDF – Rotate PDF Pages Online for Free',
    intro: 'Fix sideways or upside-down pages. Rotate all pages or only selected ones by 90°, 180° or 270°.',
    steps: ['Choose your PDF.', 'Select the rotation and optional pages.', 'Click Convert and download the rotated PDF.'],
    tips: [],
    faq: [{ q: 'Can I rotate only one page?', a: 'Yes. Enter that page number in the Pages field, for example 3, and only that page will be rotated.' }],
  },
  'pdf-to-text': {
    title: 'PDF to Text Converter – Extract Text from PDF Online',
    intro: 'Extract the selectable text from a PDF and save it as a plain TXT file.',
    steps: ['Choose your PDF.', 'Click Convert.', 'Download the TXT file.'],
    tips: ['Scanned PDFs contain only images and need OCR, which this tool does not perform.'],
    faq: [{ q: 'Why is no text found in my PDF?', a: 'Scanned PDFs store pages as pictures, so there is no text to extract. Text-based PDFs work perfectly.' }],
  },
  'webp-to-jpg': {
    title: 'WEBP to JPG Converter – Free Online, No Upload',
    intro: 'Convert WEBP images to widely compatible JPG files. Transparent areas become white.',
    steps: ['Choose one or more WEBP images.', 'Set the quality.', 'Click Convert and download.'],
    tips: [],
    faq: [{ q: 'Why convert WEBP to JPG?', a: 'JPG is supported by virtually every app, website and device, while WEBP is not always accepted.' }],
  },
  'jpg-to-png': {
    title: 'JPG to PNG Converter – Free Online, No Upload',
    intro: 'Convert JPG images to PNG format instantly, with multiple files supported.',
    steps: ['Choose one or more JPG images.', 'Click Convert.', 'Download your PNG files.'],
    tips: ['Converting JPG to PNG does not restore lost detail, but it avoids further quality loss when editing.'],
    faq: [{ q: 'Will the PNG be bigger than the JPG?', a: 'Usually yes, because PNG is lossless.' }],
  },
  'png-to-jpg': {
    title: 'PNG to JPG Converter – Free Online, No Upload',
    intro: 'Convert PNG images to smaller JPG files. Transparent areas are filled with white.',
    steps: ['Choose one or more PNG images.', 'Set the quality.', 'Click Convert and download.'],
    tips: [],
    faq: [{ q: 'What happens to transparency?', a: 'JPG does not support transparency, so transparent areas are filled with white.' }],
  },
  'image-compressor': {
    title: 'Image Compressor – Compress JPG, PNG & WEBP Online',
    intro: 'Reduce image file size while keeping them looking good. Adjust the quality slider and compress many images at once.',
    steps: ['Choose your images.', 'Adjust the quality slider.', 'Click Convert and download the smaller images.'],
    tips: ['PNG images are converted to WEBP for better compression. If a result would be larger, your original is kept.'],
    faq: [{ q: 'What quality should I choose?', a: 'Around 70–80% gives a large size reduction with little visible change.' }],
  },
};

export function getContent(t: Tool): Extra {
  const s = specific[t.slug] || {};
  return {
    title: s.title || `${t.name} Converter – Free Online`,
    intro: s.intro || t.description,
    steps: s.steps || ['Choose a file from your device.', 'Adjust the options if shown.', 'Click Convert and download the result.'],
    tips: s.tips || [],
    faq: [...(s.faq || []), privacyFaq, freeFaq(t)],
  };
}
