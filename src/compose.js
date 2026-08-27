/* Composition engine.
   Variation is structural, not cosmetic. A page is a composition: a section
   order, a layout block chosen per section, and a style DNA. The palette is
   GENERATED from the partner's own brand colour rather than picked from a
   fixed list, so the colour space is continuous instead of 24 options. */

/* ---------------- colour ---------------- */
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

export function hexToHsl(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let hue = 0;
  if (d) {
    if (mx === r) hue = ((g - b) / d) % 6;
    else if (mx === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
  }
  hue = (hue * 60 + 360) % 360;
  const l = (mx + mn) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [hue, s, l];
}

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360; s = clamp(s, 0, 1); l = clamp(l, 0, 1);
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const f = v => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return ("#" + f(r) + f(g) + f(b)).toUpperCase();
}

export function relLum(hex) {
  let h = hex.replace("#", "");
  const v = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
export function contrast(a, b) {
  const l1 = relLum(a), l2 = relLum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/* Harmony modes — how the accent relates to the brand hue. */
export const HARMONIES = [
  { id: "mono", name: "Monochrome", shift: 0, sat: 1.0 },
  { id: "analogous-warm", name: "Analogous warm", shift: 28, sat: 1.05 },
  { id: "analogous-cool", name: "Analogous cool", shift: -28, sat: 1.05 },
  { id: "split-a", name: "Split A", shift: 150, sat: 0.95 },
  { id: "split-b", name: "Split B", shift: -150, sat: 0.95 },
  { id: "complement", name: "Complement", shift: 180, sat: 0.9 },
  { id: "triad-a", name: "Triad A", shift: 120, sat: 0.95 },
  { id: "triad-b", name: "Triad B", shift: -120, sat: 0.95 },
  { id: "near", name: "Near", shift: 14, sat: 1.15 },
  { id: "wide", name: "Wide", shift: 62, sat: 1.0 }
];

/* Tonal treatments — how dark and how saturated the whole scheme runs. */
export const TONES = [
  { id: "deep",    name: "Deep",     pl: 0.22, dl: 0.13, nl: 0.08, ps: 0.62, wl: 0.975 },
  { id: "midnight",name: "Midnight", pl: 0.16, dl: 0.10, nl: 0.05, ps: 0.70, wl: 0.97 },
  { id: "rich",    name: "Rich",     pl: 0.28, dl: 0.18, nl: 0.10, ps: 0.55, wl: 0.98 },
  { id: "muted",   name: "Muted",    pl: 0.26, dl: 0.17, nl: 0.10, ps: 0.32, wl: 0.975 },
  { id: "ink",     name: "Ink",      pl: 0.14, dl: 0.09, nl: 0.05, ps: 0.18, wl: 0.98 },
  { id: "vivid",   name: "Vivid",    pl: 0.30, dl: 0.20, nl: 0.11, ps: 0.78, wl: 0.985 },
  { id: "earth",   name: "Earth",    pl: 0.24, dl: 0.15, nl: 0.09, ps: 0.40, wl: 0.972 },
  { id: "slateish",name: "Slate",    pl: 0.20, dl: 0.14, nl: 0.09, ps: 0.24, wl: 0.968 }
];

/* Build a full, contrast-checked palette from one brand colour. */
export function buildPalette(brandHex, harmonyId, toneId, accentLift = 0) {
  const H = HARMONIES.find(h => h.id === harmonyId) || HARMONIES[0];
  const T = TONES.find(t => t.id === toneId) || TONES[0];
  let [h, s] = hexToHsl(brandHex || "#123C6B");
  if (!isFinite(h)) h = 210;
  const baseS = clamp(s < 0.08 ? 0.42 : s, 0.12, 0.95);

  const primary = hslToHex(h, baseS * T.ps + 0.12, T.pl);
  const deep    = hslToHex(h + 4, baseS * T.ps + 0.14, T.dl);
  const night   = hslToHex(h + 8, baseS * 0.55 + 0.10, T.nl);

  // accent must clear 3:1 on the primary so buttons are legible
  let accL = clamp(0.52 + accentLift * 0.05, 0.34, 0.72);
  let accent = hslToHex(h + H.shift, clamp(baseS * H.sat + 0.14, 0.3, 0.95), accL);
  let guard = 0;
  while (contrast(accent, primary) < 3 && guard < 14) {
    accL = clamp(accL + 0.035, 0.2, 0.86);
    accent = hslToHex(h + H.shift, clamp(baseS * H.sat + 0.14, 0.3, 0.95), accL);
    guard++;
  }

  const wash = hslToHex(h, clamp(baseS * 0.22, 0.05, 0.3), T.wl);
  const line = hslToHex(h, clamp(baseS * 0.20, 0.04, 0.26), 0.905);

  // body ink must clear 4.5:1 on both white and the wash
  let inkL = 0.14;
  let ink = hslToHex(h, clamp(baseS * 0.22, 0.03, 0.28), inkL);
  while (contrast(ink, "#FFFFFF") < 7 && inkL > 0.04) { inkL -= 0.012; ink = hslToHex(h, 0.16, inkL); }
  let ink2L = 0.42;
  let ink2 = hslToHex(h, clamp(baseS * 0.2, 0.03, 0.26), ink2L);
  while (contrast(ink2, wash) < 4.5 && ink2L > 0.16) { ink2L -= 0.015; ink2 = hslToHex(h, 0.18, ink2L); }

  return { deep, primary, accent, night, wash, line, ink, ink2, _h: Math.round(h), harmony: H.id, tone: T.id };
}

/* ---------------- deterministic RNG ---------------- */
export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function rng(seed) {
  let x = seed >>> 0 || 1;
  return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
}
const take = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];

/* ---------------- composition ---------------- */
/* A composition is the full recipe for one page. Its signature is what the
   uniqueness ledger stores — two partners must never share one. */
export function signature(comp) {
  return [
    comp.pack,
    comp.order.join(">"),
    Object.keys(comp.blocks).sort().map(k => k + "=" + comp.blocks[k]).join(","),
    comp.dna.harmony, comp.dna.tone, comp.dna.type, comp.dna.surface,
    comp.dna.density, comp.dna.corners, comp.dna.motion, comp.dna.rhythm, comp.dna.accentShape
  ].join("|");
}
export function shortId(comp) {
  const h = hashStr(signature(comp)).toString(16).toUpperCase().padStart(8, "0");
  return h.match(/.{2}/g).join(":");
}

/* Structural variety: how many distinct pages the engine can express. */
export function spaceSize(BLOCKS, orders, packId, typeCount) {
  const o = orders.filter(x => x.packs.indexOf(packId) > -1);
  let blockProduct = 1;
  const seen = new Set();
  o.forEach(ord => ord.order.forEach(id => seen.add(id)));
  seen.forEach(id => { blockProduct *= (BLOCKS[id] || ["a"]).length; });
  return o.length * blockProduct * HARMONIES.length * TONES.length * typeCount;
}
