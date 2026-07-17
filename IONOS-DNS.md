# IONOS DNS — kampfiskapps.com → GitHub Pages

**Goal:** Point existing domain to the live marketplace without breaking e-mail.

**Do not change:** MX, SPF (TXT with `v=spf1`), DKIM, DMARC.

## Log in yourself

1. Open https://my.ionos.com (or https://www.ionos.no / .de) and sign in with **your** Google/Gmail account.
2. Go to **Domains & SSL** → **kampfiskapps.com** → **DNS**.

> Agents cannot use your Gmail password. Complete only this DNS step in your browser.

## DNS records to set

| Type | Host / Name | Value | TTL |
|------|-------------|--------|-----|
| **CNAME** | `www` | `wkampfisk.github.io` | 3600 (or default) |
| **A** | `@` (or blank / apex) | `185.199.108.153` | default |
| **A** | `@` | `185.199.109.153` | default |
| **A** | `@` | `185.199.110.153` | default |
| **A** | `@` | `185.199.111.153` | default |
| **AAAA** (optional) | `@` | `2606:50c0:8000::153` | default |
| **AAAA** (optional) | `@` | `2606:50c0:8001::153` | default |
| **AAAA** (optional) | `@` | `2606:50c0:8002::153` | default |
| **AAAA** (optional) | `@` | `2606:50c0:8003::153` | default |

### Also remove / replace if present

- Old **A/CNAME** for `www` that points to parking/IONOS hosting (not GitHub)
- Old **A** for `@` that is only IONOS parking (replace with the four GitHub IPs above)
- Do **not** delete mail-related records

### Mail (leave as-is)

Examples of records to **keep**:

- MX → your mail host
- TXT `v=spf1 ...`
- TXT/CNAME for DKIM (`*._domainkey`)
- TXT `_dmarc`

## After saving DNS

1. Wait 5–60 minutes (sometimes up to 24h).
2. GitHub Pages custom domain is set to **www.kampfiskapps.com**.
3. In repo Settings → Pages, enable **Enforce HTTPS** when the certificate is ready (or tell the agent after DNS is set).
4. Verify:
   - https://www.kampfiskapps.com
   - https://kampfiskapps.com (should redirect or resolve via A records)

## Check from your PC

```powershell
nslookup www.kampfiskapps.com
nslookup kampfiskapps.com
# www should show CNAME → wkampfisk.github.io
# apex should show GitHub A records
```

## Production URLs

| URL | Role |
|-----|------|
| https://www.kampfiskapps.com | Canonical marketplace |
| https://wkampfisk.github.io/KampfiskApps2.0/ | Backup / interim |
| https://shroomfinder.kampfiskapps.com | FungaDex (later CNAME) |
