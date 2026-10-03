const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.pages.dev';
export const site = {
  name: 'Convertly',
  url: raw.replace(/\/+$/, ''),
  // Only needed for GitHub Pages project sites, e.g. NEXT_PUBLIC_BASE_PATH=/all-file-converter
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  tagline: 'Free Online File Converter & PDF Tools',
  description:
    'Free online file converter and PDF tools. Convert PDF to JPG, merge, split, compress and rotate PDFs, and convert images — fast, private, directly in your browser.',
  keywords: [
    'file converter', 'pdf to jpg', 'jpg to pdf', 'merge pdf', 'split pdf', 'compress pdf',
    'rotate pdf', 'png to jpg', 'webp to jpg', 'image compressor', 'free online pdf tools',
  ],
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'yashupadhye8390@gmail.com',
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  bingVerification: process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
};
export const withBase = (p: string) => `${site.basePath}${p}`;
