import { createClient } from '@base44/sdk'

/**
 * Base44 client for KampfiskApps marketplace.
 *
 * Vite exposes only VITE_* vars to the browser. Anything set here is public
 * in the client bundle — do not put privileged/admin secrets in VITE_ vars.
 *
 * Local: copy .env.example → .env.local and fill values.
 */
const appId = import.meta.env.VITE_BASE44_APP_ID || '69f51c5919f02c320bbcd1ad'
const apiKey = import.meta.env.VITE_BASE44_API_KEY || ''

export const base44 = createClient({
  appId,
  headers: apiKey
    ? {
        api_key: apiKey,
      }
    : undefined,
})

export default base44
