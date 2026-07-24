# KampfiskApps — payments architecture

Marketplace (**www.kampfiskapps.com**) is a **catalog only**.  
Stripe Checkout and webhooks run **inside each product app** (Base44 functions).  
No `sk_` keys in this repo.

## Product map

| App | Live URL | Checkout entry | Webhook URL | Profile |
|-----|----------|----------------|-------------|---------|
| **FitFam Connect** | https://fitfam-trial.base44.app | `/pricing` → `createCheckoutSession` | `…/api/functions/stripeWebhook` | `-p fitfam` |
| **FungaDex** | https://rare-wild-fungi-find.base44.app | in-app upgrade → `createCheckoutSession` / `createCheckout` | `…/api/functions/stripeWebhook` | `-p shroomfinder` |

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
- `PUBLIC_APP_URL` = `https://fitfam-trial.base44.app`

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
