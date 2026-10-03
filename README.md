# Convertly – Free Online File Converter

Static Next.js 16 site. All conversions run in the browser (pdf-lib, pdf.js, canvas, JSZip) — no server needed.

## Run locally
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm run dev                  # http://localhost:3000
```

## Build (static export → `out/`)
```bash
npm run build
```

## Working tools
PDF→JPG, PDF→PNG, PDF→Text, JPG→PDF, PNG→PDF, Merge, Split, Rotate, Compress PDF, JPG↔PNG, WEBP→JPG, Image Compressor.
Word/Excel/PowerPoint conversions are marked "Coming soon" (noindex, not in sitemap).

## Deploy: GitHub + Cloudflare Pages (recommended)
1. Push to GitHub:
   `git init && git add . && git commit -m "init" && git branch -M main && git remote add origin <repo-url> && git push -u origin main`
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build command: `npm run build` · Output directory: `out` · Env vars: `NODE_VERSION=22`, `NEXT_PUBLIC_SITE_URL=https://<project>.pages.dev` (or your custom domain).
4. Deploy. Every `git push` redeploys automatically.

## Alternative: GitHub Pages
Repo Settings → Pages → Source: GitHub Actions. The included workflow `.github/workflows/deploy-github-pages.yml` builds and publishes on every push to `main`.

## After going live
- Set `NEXT_PUBLIC_SITE_URL` to the real URL and redeploy (canonicals + sitemap use it).
- Google Search Console → add property → submit `https://your-site/sitemap.xml`. Optional: `NEXT_PUBLIC_GOOGLE_VERIFICATION`.
- Replace `public/og-image.png` with your own branded 1200×630 image if you like.
