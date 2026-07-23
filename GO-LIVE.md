# GO-LIVE — www.kampfiskapps.com (Base44 apps marketplace)

Goal: customers open **https://www.kampfiskapps.com**, browse apps, and open/buy/download each Base44 product.

Agents cannot log into IONOS, Base44, or Gmail for you. Do these clicks yourself.

---

## Current status (automated checks)

| Item | Status |
|------|--------|
| Marketplace repo | `WKampfisk/KampfiskApps2.0` |
| HTTP site | Works on GitHub Pages (`http://www.kampfiskapps.com`) |
| HTTPS | **Broken cert** (wrong name) until GitHub “Enforce HTTPS” + correct DNS |
| DNS apex | GitHub Pages A records (OK) |
| Live Base44 apps linked in catalog | FungaDex, FitFam, Spot-Finder, BitMiner, Treprodukter |

---

## 1) IONOS DNS (keep e-mail working)

Login: https://my.ionos.com → **Domains & SSL** → **kampfiskapps.com** → **DNS**

**Website records (set / fix):**

| Type | Host | Value |
|------|------|--------|
| **CNAME** | `www` | `wkampfisk.github.io` |
| **A** | `@` | `185.199.108.153` |
| **A** | `@` | `185.199.109.153` |
| **A** | `@` | `185.199.110.153` |
| **A** | `@` | `185.199.111.153` |

**Do not change:** MX, SPF (`v=spf1`), DKIM, DMARC (for `post@kampfiskapps.com`).

**Remove if present:** parking A/CNAME for `www` that is not GitHub; extra IONOS website builders on `www`.

Preferred: `www` as **CNAME → wkampfisk.github.io** (not four A records). Apex keeps the four A records.

---

## 2) GitHub Pages HTTPS (required)

1. Open https://github.com/WKampfisk/KampfiskApps2.0/settings/pages  
2. **Custom domain:** `www.kampfiskapps.com` (repo already has `public/CNAME`)  
3. Wait until DNS check is green  
4. Enable **Enforce HTTPS**  
5. If cert stays wrong: remove custom domain → save → re-add `www.kampfiskapps.com` → wait 15–60 min → Enforce HTTPS again  

Verify:

```text
https://www.kampfiskapps.com
```

Browser padlock must be valid (no name mismatch).

---

## 3) Base44 — publish each app for sale / access

For every product you sell:

1. https://app.base44.com → open the app  
2. **Publish** (so the public `.base44.app` URL works)  
3. Turn on **Stripe / payments** inside that app if price > free  
4. Optional: **Domains** → connect e.g. `fungadex.kampfiskapps.com` (CNAME → Base44 target from dashboard)  
5. Copy the live URL into `src/data/apps.js` (`webUrl` / `purchaseUrl`) and push  

Already live (HTTP 200) and listed on the storefront:

| App | Live URL |
|-----|----------|
| FungaDex | https://rare-wild-fungi-find.base44.app |
| FitFam Connect | https://fitfam.base44.app |
| Spot-Finder | https://spot-finder.base44.app |
| BitMiner | https://bitminer.base44.app |
| Treprodukter | https://crouching-wood-craft-blueprint.base44.app |

Still need public publish (or URL) for: LesePoeng, Pasientreiser/RePayMe, Ocean Floor AR, SeaCam.

---

## 4) Marketplace catalog (this repo)

Edit `src/data/apps.js`:

- `webUrl` — open app  
- `purchaseUrl` — buy / checkout entry (often same as webUrl if Stripe is in-app)  
- `apkUrl` — optional Android download  
- `ctaLabel` — button text  
- `status` — `Live` or `Coming soon`  

Push to `main` → GitHub Actions deploys Pages automatically.

```bash
cd KampfiskApps2.0
npm run build
git add -A && git commit -m "Update catalog" && git push origin main
```

---

## 5) How customers buy / download

1. Visit **www.kampfiskapps.com**  
2. Open an app card  
3. Click **Åpne / kjøp** → Base44 app  
4. Complete signup + Stripe **inside** that app  
5. Optional APK if `apkUrl` is set  

The storefront is the catalog + deep links; payment lives in each Base44 app (or a future Stripe Payment Link in `purchaseUrl`).

---

## 6) Optional later

- Subdomain per app: `fungadex.kampfiskapps.com` → Base44 CNAME  
- IONOS Deploy Now instead of GitHub Pages (same `dist/` build)  
- Capacitor APKs uploaded to GitHub Releases → put release URL in `apkUrl`  

---

## Quick verify after you finish

```powershell
nslookup www.kampfiskapps.com
# expect CNAME wkampfisk.github.io OR GitHub A records

curl.exe -sI https://www.kampfiskapps.com
# expect HTTP/2 200 and no cert error
```
