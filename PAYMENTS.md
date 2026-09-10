# KampfiskApps — payments architecture

Marketplace (**www.kampfiskapps.com**) is a **catalog only**.  
Stripe Checkout and webhooks run **inside each product app** (Base44 functions).  
No `sk_` keys in this repo.

## Product map

| App | Live URL | Checkout entry | Webhook URL | Profile |
|-----|----------|----------------|-------------|---------|
| **FitFam Activity** | https://fitfam.site | `/pricing` → `createCheckoutSession` | `…/api/functions/stripeWebhook` | `-p fitfam` |
| **FungaDex** | https://rare-wild-fungi-find.base44.app | in-app upgrade → `createCheckoutSession` / `createCheckout` | `…/api/functions/stripeWebhook` | `-p shroomfinder` |
| **Sakshjelperen** | https://sakshjelperen-app.base44.app | `/abonnement` → `createCheckoutSession` | `we_1UE8Ls25kc0CDwRa3dE2Yttj` → `…/api/functions/stripeWebhook` | `Use-StripeApp sakshjelperen` |

## Stripe resources (TEST)

### FitFam

| Resource | ID / value |
|----------|------------|
| Webhook | `we_1TwYB725kc0CDwRaJNZCMIyK` → fitfam-trial…/stripeWebhook |
| Events | `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed` |
| Premium price | `price_1TwZsp25kc0CDwRany6Rlr2r` (**49 NOK**/mo) |
| Family Plus price | `price_1TwZsr25kc0CDwRaZw4NWmSS` (**79 NOK**/mo) |

Base44 secrets:

- `STRIPE_SECRET_KEY` (`sk_test_…`)
- `STRIPE_WEBHOOK_SECRET` (from FitFam webhook endpoint)
- `STRIPE_PRICE_PREMIUM` = `price_1TwZsp25kc0CDwRany6Rlr2r`
- `STRIPE_PRICE_FAMILY_PLUS` = `price_1TwZsr25kc0CDwRaZw4NWmSS`
- `PUBLIC_APP_URL` = `https://fitfam.site`

### FungaDex

| Resource | ID / value |
|----------|------------|
| Product | `prod_UwSo48a2yBxbsN` FungaDex Premium |
| Price | `price_1TwZsn25kc0CDwRaLt6bWhI4` (**129 NOK**/mo) |
| Webhook | `we_1TwZst25kc0CDwRadkrIpjnS` → rare-wild-fungi-find…/stripeWebhook |
| Events | same subscription set as FitFam |

Base44 secrets:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` — copy from `base44-apps/shroomfinder/.stripe-webhook-local.env` (gitignored) or Dashboard
- `STRIPE_PRICE_PREMIUM` = `price_1TwZsn25kc0CDwRaLt6bWhI4`
- `PUBLIC_APP_URL` = `https://rare-wild-fungi-find.base44.app`

### Sakshjelperen

| Resource | ID / value |
|----------|------------|
| App | https://sakshjelperen-app.base44.app |
| Checkout | `/abonnement` → `createCheckoutSession({ plan })` |
| Webhook | `https://sakshjelperen-app.base44.app/api/functions/stripeWebhook` |
| Plans | Dokumentlager 25 · Basic 49 · Pro 149 (100 credits) · Enterprise 399 (500 credits) NOK/mo |

Checkout uses server-side `price_data` until `STRIPE_PRICE_*` secrets are set. Do not enable Stripe Tax before an MVA registration decision. Full runbook: `base44-apps/sakshjelperen/docs/STRIPE_SETUP.md`.

## Marketplace UX

- Catalog plans in `src/data/apps.js` → deep links to product pricing / checkout
- Modal shows Stripe plan cards with “Gå til betaling”
- Payment completes on the product domain (login required there)

## CLI

```powershell
. "$env:USERPROFILE\base44-apps\stripe.ps1"
Use-StripeApp fitfam
Invoke-Stripe whoami

Use-StripeApp shroomfinder
stripe trigger checkout.session.completed -p shroomfinder
```

## Deploy checklist

1. Sync/push FitFam + Shroomfinder function code to Base44  
2. Set secrets above in each Base44 app  
3. Publish both apps  
4. Test card `4242 4242 4242 4242`  
5. Confirm webhook deliveries in Stripe Dashboard → Developers → Webhooks  

## Live mode (later)

- Separate live webhook endpoints + live price IDs  
- Never put live secrets in the marketplace static site  
- Claim/onboard business in Stripe Dashboard  
