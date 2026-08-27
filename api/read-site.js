// Reads a partner's live site and extracts what PLATE needs to brand a page.
// Runs server-side because CORS makes a browser fetch of another origin impossible.

const TIMEOUT_MS = 9000;
const UA = "Mozilla/5.0 (compatible; PlateStudio/1.0; +partner-site-builder)";

const COUNTRY_BY_TLD = {
  pk: "Pakistan", in: "India", id: "Indonesia", kr: "South Korea", my: "Malaysia",
  sg: "Singapore", vn: "Vietnam", th: "Thailand", ph: "Philippines", lk: "Sri Lanka",
  bd: "Bangladesh", ae: "United Arab Emirates", sa: "Saudi Arabia", ng: "Nigeria",
  ke: "Kenya", za: "South Africa", uk: "United Kingdom", nl: "Netherlands",
  de: "Germany", fr: "France", es: "Spain", it: "Italy", br: "Brazil", au: "Australia"
};

function textOf(html, re) { const m = html.match(re); return m ? m[1].trim() : ""; }
function decode(s) {
  return String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

function normaliseHex(c) {
  let h = c.trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(h)) h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  if (!/^#[0-9a-f]{6}$/.test(h)) return null;
  return h.toUpperCase();
}
function luminance(hex) {
  const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
function saturation(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  return mx === 0 ? 0 : (mx - mn) / mx;
}

export default async function handler(req, res) {
  const raw = (req.query.url || "").toString();
  let target;
  try {
    target = new URL(raw.startsWith("http") ? raw : "https://" + raw);
    if (!/^https?:$/.test(target.protocol)) throw new Error();
  } catch {
    return res.status(400).json({ error: "That does not look like a valid URL." });
  }
  // Block private ranges — this endpoint takes a user-supplied URL.
  if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|\[?::1)/i.test(target.hostname)) {
    return res.status(400).json({ error: "That host is not reachable from here." });
  }

  const t0 = Date.now();
  let html = "";
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    const r = await fetch(target.href, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow", signal: ctl.signal
    });
    clearTimeout(timer);
    if (!r.ok) {
      return res.status(502).json({ error: `The site answered ${r.status}. It may be behind a firewall or bot protection.` });
    }
    html = (await r.text()).slice(0, 900000);
  } catch (e) {
    return res.status(504).json({
      error: e.name === "AbortError"
        ? "The site took too long to answer."
        : "Could not reach that site. Cloudflare and JS-rendered sites often block this."
    });
  }

  const host = target.hostname.replace(/^www\./, "");
  const tld = host.split(".").pop();
  const sld = host.split(".").slice(-2)[0];

  /* --- name --- */
  const ogSite = decode(textOf(html, /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)/i));
  const title = decode(textOf(html, /<title[^>]*>([\s\S]{0,160}?)<\/title>/i));
  const titleName = title.split(/[|\u2013\u2014\-\u00b7]/)[0].trim();
  const name = ogSite || (titleName.length > 2 && titleName.length < 60 ? titleName : sld);

  /* --- legal name: look for a Pvt/Ltd/Inc style string --- */
  const legal = decode(textOf(html,
    /([A-Z][A-Za-z0-9&.,'\- ]{2,60}?(?:\(Pvt\.?\)\s*)?(?:Pvt\.?\s*)?(?:Ltd\.?|Limited|Inc\.?|LLC|GmbH|B\.?V\.?|Pte\.?\s*Ltd\.?|S\.?A\.?))/))
    || "";

  /* --- contact --- */
  const emails = [...html.matchAll(/mailto:([^"'?\s>]+@[^"'?\s>]+)/gi)].map(m => m[1].toLowerCase());
  const email = emails.find(e => !/example|sentry|wixpress|\.png|\.jpg/.test(e)) || "";
  const tels = [...html.matchAll(/tel:([+0-9()\-.\s]{6,24})/gi)].map(m => m[1].trim());
  const phone = tels[0] || "";

  /* --- palette: declared colours, ranked --- */
  const hexes = [...html.matchAll(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g)]
    .map(m => normaliseHex("#" + m[1])).filter(Boolean);
  const counts = {};
  hexes.forEach(h => { counts[h] = (counts[h] || 0) + 1; });
  const palette = Object.keys(counts)
    .filter(h => {
      const l = luminance(h);
      return l > 0.015 && l < 0.93 && saturation(h) > 0.12; // drop near-black, near-white, greys
    })
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 6);

  /* --- fonts --- */
  const gf = [...html.matchAll(/fonts\.googleapis\.com\/css2?\?([^"']+)/gi)]
    .flatMap(m => [...m[1].matchAll(/family=([^&:]+)/g)].map(f => decodeURIComponent(f[1]).replace(/\+/g, " ")));
  const declared = [...html.matchAll(/font-family\s*:\s*([^;}"']+)/gi)]
    .map(m => m[1].split(",")[0].replace(/["']/g, "").trim())
    .filter(f => f && !/^(inherit|initial|unset|var\()/i.test(f) && !/^-/.test(f));
  const fonts = [...new Set([...gf, ...declared])].slice(0, 4);

  /* --- nav --- */
  const navBlock = textOf(html, /<nav[^>]*>([\s\S]{0,6000}?)<\/nav>/i) || html.slice(0, 30000);
  const nav = [...new Set(
    [...navBlock.matchAll(/<a[^>]*>([\s\S]{1,60}?)<\/a>/gi)]
      .map(m => decode(m[1].replace(/<[^>]+>/g, "")))
      .filter(t => t && t.length > 1 && t.length < 30 && !/^\W+$/.test(t))
  )].slice(0, 8);

  /* --- does the site already sell SSL? --- */
  const lower = html.toLowerCase();
  const sslHits = ["ssl certificate", "tls certificate", "digicert", "sectigo", "comodo", "rapidssl", "geotrust"]
    .filter(k => lower.includes(k));
  const greenfield = sslHits.length === 0;

  /* --- location --- */
  const country = COUNTRY_BY_TLD[tld] || "";

  const partner = {
    name, legal_name: legal || name, country, city: "",
    phone, email, whatsapp: "", site_url: target.origin,
    ca_status: ""
  };

  const checks = [name, palette.length, fonts.length, phone || email, country, nav.length, true];
  const found = checks.filter(Boolean).length;

  return res.status(200).json({
    host, ms: Date.now() - t0, found, total: checks.length,
    partner, palette, fonts, nav, greenfield, ssl_signals: sslHits
  });
}
