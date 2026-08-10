# KampfiskApps marketplace — agent context

## Role

Storefront at **https://www.kampfiskapps.com** (GitHub Pages + custom domain). Catalog lives in `src/data/apps.js`. **Payments are not processed on this site** — each product opens its own Base44 app (Stripe Checkout there).

## Stripe CLI

Load skill **`stripe-cli`**. Use project profile **`kampfiskapps`** for marketplace-scoped CLI work; for product payments use the product profile.

```powershell
. "$env:USERPROFILE\base44-apps\stripe.ps1"
Use-StripeApp kampfiskapps    # marketplace profile
Use-StripeApp fitfam          # FitFam payments
Use-StripeApp shroomfinder    # FungaDex / Shroomfinder payments
```

| Item | Value |
|------|--------|
| CLI project | `kampfiskapps` (`-p kampfiskapps`) |
| Workspace | `~/KampfiskApps2.0` |
| Site | https://www.kampfiskapps.com |
| Webhook on marketplace | **None** |

### Product payment deep links (from catalog)

| Product | Live / purchase |
|---------|-----------------|
| FungaDex (Shroomfinder) | https://rare-wild-fungi-find.base44.app |
| FitFam Connect | https://fitfam-trial.base44.app/pricing |
| WoodCraft Pro | https://woodcraft-pro.base44.app |
| Lesetid | https://lesetid.base44.app |
| Spot-Finder | https://spot-finder.base44.app |
| BitMiner | https://bitminer.base44.app |
| TaskFlow Pro | https://taskflow-pro.base44.app |

### Agent rules

1. Do **not** put Stripe secret keys in this repo.
2. When enabling or debugging payments, switch to the product app workspace + matching `-p` profile.
3. Update `src/data/apps.js` `webUrl` / `purchaseUrl` when product Stripe URLs change.
4. Test mode by default for any Stripe CLI use.
5. Deploy/DNS notes: `GO-LIVE.md`, `IONOS-DNS.md`, `DEPLOY.md`.
