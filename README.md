# KampfiskApps

**Online store and marketplace for all my apps.**

A beautiful, simple web storefront showcasing the collection of apps built by Kampfisk.

## Live Site (GitHub Pages)

Once deployed:
- https://wkampfisk.github.io/KampfiskApps

## Local Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

### GitHub Pages Deployment

1. Push the `dist/` folder or configure GitHub Pages to deploy from the `gh-pages` branch / `dist` folder.
2. Or use the included simple workflow (add `.github/workflows/deploy.yml` if desired).
3. For project pages, Vite is configured with `base: '/KampfiskApps/'`.

## What's Included

- Vite + React + Tailwind CSS
- Responsive app grid with search + category filters
- Detailed modal for each app
- Seeded with real apps from the Kampfisk ecosystem + links to GitHub repos and descriptions
- Ready for you to add real screenshots and live demo links

## Adding / Updating Apps

Edit `src/data/apps.js`. Add screenshots to `public/screenshots/`.

## Apps in the Catalog

See the live site or `src/data/apps.js` for the current seeded list (ShroomFinder, Spot-Finder, LesePoeng, Pasientreiser, Ocean Floor AR, SeaCam, BitMiner, Treprodukter, and more).

ShroomFinder is the flagship collector game: full WildDex "Collect 'Em All" (caught status, progress, badges) + AR + maps. Web (PWA) + APK available via the product page (download links in modal).

---

Built with ❤️ by WKampfisk / Kampfisk
