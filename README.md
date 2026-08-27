# PLATE — partner site studio

Intake → Studio → Templates → Export. Reads a partner's live site, brands a page
from the content library, and exports one self-contained HTML file.

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

## Design DNA

`src/dna.js` holds every visual axis: 24 palettes, 20 type pairings, 6 surfaces,
4 densities, 5 corner radii, 4 motion modes, 10 skeletons, 54 presets.

54 presets are NOT 54 codebases. Each is a skeleton (section order) plus a style
recipe over the same content packs. Fix a sentence once and all 54 change.

### Fingerprint

Every design encodes to four hex pairs — `9F:2C:AE:04` — one per axis:
palette, type, layout, motion. Click a pair in the studio gutter to lock that
axis; SHUFFLE re-rolls only what is unlocked.

## Site reader

`api/read-site.js` fetches a partner's homepage server-side (CORS makes a browser
fetch impossible) and extracts name, legal name, contact block, declared palette,
fonts, nav and whether the site already sells SSL. It will fail on Cloudflare and
JS-rendered sites — roughly one in five — so the manual fields on Intake are a
first-class path, not a fallback.

Private and loopback hosts are rejected: this endpoint takes a user-supplied URL.
