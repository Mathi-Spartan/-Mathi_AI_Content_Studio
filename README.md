# Mathi AI Content Studio

The content library behind partner SSL / automation / VMC sites.

## Why the content lives in git

`content/` is the product. It is version-controlled JSON, not database rows, because
content needs to be diffable, reviewable and revertible. Supabase holds partners and
their saved choices — mutable operational data. That split is deliberate.

## Structure

    content/facts.json          Canonical facts. Every number traces here.
    content/packs/ssl-full.json         Full SSL site, automation-first (11 sections)
    content/packs/automation-lp.json    Automation upsell landing page (6 sections)
    content/packs/vmc-cmc-dmarc.json    VMC / CMC / DMARC (8 sections)

### The one rule

No number is written twice. If a fact appears in a pack, it is a reference to
`facts.json`, not a copy. When the CA/B schedule or a product name changes, it
changes in one file and propagates to every partner page ever generated.

`facts.json` carries `last_verified` and a 90-day re-verify cadence. Check it.

### Deliberately blank

Two values are empty on purpose and must never be guessed:

- DigiCert warranty figures — revised periodically, must come from the partner portal
- PositiveSSL ACME CaaS product ID — not supplied

Pre-flight flags both rather than shipping a wrong number to a partner.

## Environment

Set in Vercel, never in the repo:

    SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY

The service role key is read only inside `api/partners.js`. It must never appear
in the client bundle — `grep` the `dist/` output before any release.

`partners` has RLS enabled with no permissive policy, so the publishable key can
read nothing. All access goes through the serverless function.

## Local

    npm install && npm run dev
