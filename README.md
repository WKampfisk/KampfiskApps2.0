# KampfiskApps Marketplace

**Oppdag. Kjøp. Bruk. Kampfisk.**

Light & Bright webstore for KampfiskApps products. Production target: **https://www.kampfiskapps.com**

## Design

- **Theme:** Light & Bright (reference: `public/brand/layout-webstore.png`)
- **Logo:** Betta fish (`logo1BEST.png` / `logo2BEST.png`)
- **Stack:** Vite + React 18 + Tailwind CSS

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Output: `dist/` — ready for IONOS Deploy Now or any static host.

- Default `base` is `/` (custom domain root).
- For GitHub Pages project site: `VITE_BASE=/KampfiskApps/ npm run build`

## Deploy (IONOS Deploy Now)

1. Connect this repo in [IONOS Deploy Now](https://deploy-now.ionos.com/).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Attach custom domain `www.kampfiskapps.com` (CNAME as instructed by Deploy Now).
5. **Do not overwrite** existing MX / SPF / DKIM / DMARC for e-mail (`post@kampfiskapps.com`).

SPA rewrite: `public/.htaccess` and `public/_redirects` are copied into `dist` on build.

## Catalog

Edit `src/data/apps.js`. Flagship product: **FungaDex** → `shroomfinder.kampfiskapps.com`.

## Brand assets

| File | Use |
|------|-----|
| `logo2BEST.png` | Primary betta (hero, logo mark) |
| `logo1BEST.png` | Alternate betta (about) |
| `layout-webstore.png` | Design reference |
| `favicon-betta.png` | Favicon |

---

© KampfiskApps · Built by WKampfisk
