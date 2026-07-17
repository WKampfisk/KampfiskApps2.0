# Deploy guide — KampfiskApps Marketplace

## Production targets

| Site | Domain | Repo / path |
|------|--------|-------------|
| Marketplace | https://www.kampfiskapps.com | `WKampfisk/KampfiskApps2.0` |
| FungaDex | https://shroomfinder.kampfiskapps.com | (separate project / later) |

## Build settings (IONOS Deploy Now)

| Setting | Value |
|---------|--------|
| Language | Node.js |
| Node version | 20.x |
| Install | `npm ci` |
| Build | `npm run build` |
| Publish directory | `dist` |
| SPA | Apache `.htaccess` included in `dist` |

## IONOS Deploy Now (required for kampfiskapps.com)

Deploy Now is configured via the IONOS UI + GitHub App (cannot be fully automated from this agent without your IONOS login).

1. Open **https://ionos.space** (or IONOS Control Panel → Deploy Now).
2. Sign in with the account that owns **kampfiskapps.com**.
3. **New project** → **From existing repository**.
4. Install/authorize **IONOS Deploy Now** GitHub App for `WKampfisk/KampfiskApps2.0`.
5. Confirm detection as **React / SPA**:
   - Build: `npm ci && npm run build`
   - Publish: `dist`
6. Deploy. Copy the staging URL and verify Light & Bright UI + betta logo.
7. **Custom domain** → add `www.kampfiskapps.com` (and apex if offered).
8. In IONOS DNS, set **only** the CNAME/A records Deploy Now shows for the website.
9. **Do not change** MX, SPF, DKIM, DMARC for `post@kampfiskapps.com`.
10. Wait for SSL, then verify HTTPS and canonical URL.

### DNS safety

- Website: CNAME `www` → Deploy Now target  
- Mail: leave existing MX/SPF/DKIM/DMARC untouched  
- Rollback: remove only the new website CNAME if needed  

## GitHub Pages (interim)

Workflow: `.github/workflows/deploy-pages.yml`

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Push to `main` (or run workflow manually).
3. Optional custom domain later under Pages settings (same DNS caution as above).

## Local verify

```bash
npm ci
npm run build
npm run preview
```

## After go-live checklist

- [ ] HTTPS valid on www
- [ ] Mobile layout OK
- [ ] FungaDex card opens / links to subdomain (when ready)
- [ ] No secrets in client bundle
- [ ] Mail still works at post@kampfiskapps.com
