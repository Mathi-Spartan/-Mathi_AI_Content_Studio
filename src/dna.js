/* Design DNA. Every visual axis the studio can move, plus the fingerprint
   that encodes a full design into four hex pairs. */

export const PALETTES = [
  { id: "ledger",     name: "Ledger",     deep: "#0A2748", primary: "#123C6B", accent: "#2E7DD6", night: "#0B1522", wash: "#F4F8FC", line: "#E3EAF2", ink: "#16202C", ink2: "#5B6B7D" },
  { id: "meridian",   name: "Meridian",   deep: "#08241B", primary: "#0F2E23", accent: "#2FA37A", night: "#07130F", wash: "#F2F9F6", line: "#DDEDE6", ink: "#132019", ink2: "#546B60" },
  { id: "harbour",    name: "Harbour",    deep: "#0C1B2B", primary: "#132437", accent: "#4FA8D8", night: "#08131E", wash: "#F3F8FB", line: "#DFEAF1", ink: "#141F2A", ink2: "#556674" },
  { id: "atlas",      name: "Atlas",      deep: "#08152A", primary: "#0C1B2E", accent: "#5B8DEF", night: "#060F1D", wash: "#F4F6FC", line: "#E1E6F2", ink: "#131A28", ink2: "#565F73" },
  { id: "foundry",    name: "Foundry",    deep: "#141416", primary: "#1B1B1F", accent: "#D9A94A", night: "#0D0D0F", wash: "#FAF8F3", line: "#E9E4D8", ink: "#1A1A1C", ink2: "#63625E" },
  { id: "signal",     name: "Signal",     deep: "#171331", primary: "#1E1A2E", accent: "#6F7BE8", night: "#100D22", wash: "#F5F5FD", line: "#E3E2F4", ink: "#1A1826", ink2: "#5C5A72" },
  { id: "reef",       name: "Reef",       deep: "#08211F", primary: "#0E2A2E", accent: "#3FB8B0", night: "#061618", wash: "#F1F9F9", line: "#D9EDEC", ink: "#112223", ink2: "#4E6768" },
  { id: "kiln",       name: "Kiln",       deep: "#25100B", primary: "#31160F", accent: "#D9603A", night: "#180A06", wash: "#FCF5F2", line: "#F0E2DA", ink: "#241713", ink2: "#6E5C56" },
  { id: "brass",      name: "Brass",      deep: "#1B180D", primary: "#242012", accent: "#C0A24E", night: "#121007", wash: "#FBF8F0", line: "#EBE4D2", ink: "#211E14", ink2: "#66614F" },
  { id: "ember",      name: "Ember",      deep: "#210D18", primary: "#2B1220", accent: "#D45C86", night: "#160812", wash: "#FCF3F6", line: "#F1DDE5", ink: "#241520", ink2: "#6D5560" },
  { id: "grove",      name: "Grove",      deep: "#101D13", primary: "#16261A", accent: "#5FBF87", night: "#0A140C", wash: "#F3F9F4", line: "#DDEBDF", ink: "#152018", ink2: "#556157" },
  { id: "vault",      name: "Vault",      deep: "#200F2A", primary: "#2A1436", accent: "#8A5CD1", night: "#150920", wash: "#F8F4FC", line: "#E8DEF3", ink: "#1F1626", ink2: "#61566E" },
  { id: "slate",      name: "Slate",      deep: "#191C21", primary: "#22262D", accent: "#7C8CA0", night: "#101318", wash: "#F6F7F9", line: "#E4E7EB", ink: "#1B1E23", ink2: "#5D646E" },
  { id: "indigo",     name: "Indigo",     deep: "#141B4D", primary: "#1C244B", accent: "#467FF7", night: "#0C1133", wash: "#F4F6FD", line: "#E0E5F4", ink: "#161B33", ink2: "#535A78" },
  { id: "clay",       name: "Clay",       deep: "#2C1E17", primary: "#3A2820", accent: "#B4714A", night: "#1C120D", wash: "#FBF6F2", line: "#EDE1D8", ink: "#271C16", ink2: "#6B5C52" },
  { id: "pine",       name: "Pine",       deep: "#0B2620", primary: "#123329", accent: "#2E9E77", night: "#071A15", wash: "#F1F8F5", line: "#DAEBE3", ink: "#12241E", ink2: "#4E6459" },
  { id: "cobalt",     name: "Cobalt",     deep: "#0A1E4A", primary: "#0F2A63", accent: "#3B72E8", night: "#07142F", wash: "#F3F6FD", line: "#DDE5F5", ink: "#111A2E", ink2: "#4F5A75" },
  { id: "rust",       name: "Rust",       deep: "#2E1408", primary: "#3D1D0E", accent: "#C2622C", night: "#1E0C04", wash: "#FCF6F1", line: "#F0E1D5", ink: "#261710", ink2: "#6C5A4E" },
  { id: "steel",      name: "Steel",      deep: "#12181D", primary: "#1A2229", accent: "#4E97B8", night: "#0B1014", wash: "#F4F7F9", line: "#E0E6EA", ink: "#161C21", ink2: "#57626B" },
  { id: "plum",       name: "Plum",       deep: "#251024", primary: "#331630", accent: "#A05099", night: "#180A17", wash: "#FAF4F9", line: "#EEDDEC", ink: "#231522", ink2: "#665667" },
  { id: "moss",       name: "Moss",       deep: "#1B2411", primary: "#263317", accent: "#7A9E3A", night: "#11170A", wash: "#F7F9F1", line: "#E5EBD6", ink: "#1F2615", ink2: "#5E6650" },
  { id: "navy-gold",  name: "Navy Gold",  deep: "#08182F", primary: "#0D2242", accent: "#D2A63C", night: "#050F1F", wash: "#F8F7F2", line: "#E7E4D8", ink: "#111927", ink2: "#535C6B" },
  { id: "graphite",   name: "Graphite",   deep: "#151515", primary: "#1F1F1F", accent: "#9AA7B8", night: "#0C0C0C", wash: "#F6F6F7", line: "#E5E5E7", ink: "#1A1A1A", ink2: "#606064" },
  { id: "teal-ink",   name: "Teal Ink",   deep: "#062B33", primary: "#0A3A45", accent: "#22A6BF", night: "#041C22", wash: "#F0F9FB", line: "#D6EBF0", ink: "#0F2429", ink2: "#4C6469" }
];

export const TYPES = [
  { id: "editorial",     name: "Bricolage / Public Sans",  display: "'Bricolage Grotesque'", body: "'Public Sans'",    tag: "Editorial" },
  { id: "technical",     name: "Space Grotesk / Inter",    display: "'Space Grotesk'",       body: "'Inter'",          tag: "Technical" },
  { id: "institutional", name: "Fraunces / Libre Franklin",display: "'Fraunces'",            body: "'Libre Franklin'", tag: "Institutional" },
  { id: "neutral",       name: "Archivo / Archivo",        display: "'Archivo'",             body: "'Archivo'",        tag: "Neutral" },
  { id: "modern",        name: "Sora / DM Sans",           display: "'Sora'",                body: "'DM Sans'",        tag: "Modern" },
  { id: "humanist",      name: "Newsreader / Work Sans",   display: "'Newsreader'",          body: "'Work Sans'",      tag: "Humanist" },
  { id: "corporate",     name: "IBM Plex Sans / IBM Plex", display: "'IBM Plex Sans'",       body: "'IBM Plex Sans'",  tag: "Corporate" },
  { id: "geometric",     name: "Outfit / Manrope",         display: "'Outfit'",              body: "'Manrope'",        tag: "Geometric" },
  { id: "classic",       name: "Playfair / Source Serif",  display: "'Playfair Display'",    body: "'Source Serif 4'", tag: "Classic" },
  { id: "engineered",    name: "Chivo / Figtree",          display: "'Chivo'",               body: "'Figtree'",        tag: "Engineered" },
  { id: "expressive",    name: "Syne / Epilogue",          display: "'Syne'",                body: "'Epilogue'",       tag: "Expressive" },
  { id: "warm",          name: "Lora / Public Sans",       display: "'Lora'",                body: "'Public Sans'",    tag: "Warm" },
  { id: "compact",       name: "Bitter / Inter",           display: "'Bitter'",              body: "'Inter'",          tag: "Compact" },
  { id: "swiss",         name: "Inter / Inter",            display: "'Inter'",               body: "'Inter'",          tag: "Swiss" },
  { id: "mono-lead",     name: "JetBrains / Inter",        display: "'JetBrains Mono'",      body: "'Inter'",          tag: "Mono-led" },
  { id: "grotesk",       name: "Space Grotesk / Figtree",  display: "'Space Grotesk'",       body: "'Figtree'",        tag: "Grotesk" },
  { id: "serif-body",    name: "Archivo / Newsreader",     display: "'Archivo'",             body: "'Newsreader'",     tag: "Serif body" },
  { id: "tall",          name: "Epilogue / DM Sans",       display: "'Epilogue'",            body: "'DM Sans'",        tag: "Tall" },
  { id: "solid",         name: "Manrope / Manrope",        display: "'Manrope'",             body: "'Manrope'",        tag: "Solid" },
  { id: "gazette",       name: "Fraunces / Work Sans",     display: "'Fraunces'",            body: "'Work Sans'",      tag: "Gazette" }
];

export const SURFACES = [
  { id: "flat",     name: "Flat",     card: "background:var(--p-wash);border:1px solid var(--p-line);box-shadow:none;" },
  { id: "lifted",   name: "Lifted",   card: "background:#fff;border:1px solid var(--p-line);box-shadow:0 10px 26px -14px rgba(0,0,0,.30);" },
  { id: "outlined", name: "Outlined", card: "background:transparent;border:1.5px solid var(--p-ink);box-shadow:none;" },
  { id: "glass",    name: "Glass",    card: "background:rgba(255,255,255,.62);border:1px solid rgba(255,255,255,.85);backdrop-filter:blur(9px);box-shadow:0 12px 34px -18px rgba(0,0,0,.34);" },
  { id: "paper",    name: "Paper",    card: "background:#fff;border:1px solid var(--p-line);box-shadow:2px 2px 0 var(--p-line);" },
  { id: "etched",   name: "Etched",   card: "background:var(--p-wash);border:1px solid var(--p-line);box-shadow:inset 0 1px 0 #fff,0 1px 0 var(--p-line);" }
];

export const DENSITY = [
  { id: "tight",   name: "Tight",   pad: 26, gap: 9,  scale: 0.92 },
  { id: "compact", name: "Compact", pad: 38, gap: 12, scale: 1.0 },
  { id: "open",    name: "Open",    pad: 54, gap: 16, scale: 1.06 },
  { id: "airy",    name: "Airy",    pad: 72, gap: 22, scale: 1.12 }
];

export const CORNERS = [
  { id: "0",  name: "0",    r: 0 },
  { id: "4",  name: "4",    r: 4 },
  { id: "8",  name: "8",    r: 8 },
  { id: "16", name: "16",   r: 16 },
  { id: "pill", name: "Pill", r: 999 }
];

export const MOTION = [
  { id: "none",     name: "None" },
  { id: "reveal",   name: "Reveal" },
  { id: "stagger",  name: "Stagger" },
  { id: "parallax", name: "Parallax" }
];

/* Skeletons — structural shape and section order. The content packs supply the
   words; a skeleton decides which sections appear and in what order. */
export const SKELETONS = [
  { id: "S-01", name: "Column",   packs: ["ssl-full"],       order: ["hero","why-partner","the-change","certificates","automation","guides","enquiry","contact"] },
  { id: "S-02", name: "Argument", packs: ["ssl-full"],       order: ["hero","the-change","renewal-anatomy","automation","certificates","migration-path","enquiry","contact"] },
  { id: "S-03", name: "Ledger",   packs: ["ssl-full"],       order: ["hero","why-partner","the-change","renewal-anatomy","certificates","platforms","automation","migration-path","guides","enquiry","contact"] },
  { id: "S-04", name: "Catalogue",packs: ["ssl-full"],       order: ["hero","certificates","platforms","automation","why-partner","guides","enquiry","contact"] },
  { id: "S-05", name: "Upsell",   packs: ["automation-lp"],  order: ["hero","the-arithmetic","how-it-works","plans","limits","enquiry"] },
  { id: "S-06", name: "Proof",    packs: ["automation-lp"],  order: ["hero","how-it-works","the-arithmetic","plans","limits","enquiry"] },
  { id: "S-07", name: "Direct",   packs: ["automation-lp"],  order: ["hero","plans","how-it-works","limits","enquiry"] },
  { id: "S-08", name: "Inbox",    packs: ["vmc-cmc-dmarc"],  order: ["hero","vmc-vs-cmc","requirements","dmarc-ladder","valimail","process","faq","enquiry"] },
  { id: "S-09", name: "Readiness",packs: ["vmc-cmc-dmarc"],  order: ["hero","requirements","dmarc-ladder","vmc-vs-cmc","process","faq","enquiry"] },
  { id: "S-10", name: "Brief",    packs: ["vmc-cmc-dmarc"],  order: ["hero","vmc-vs-cmc","requirements","enquiry"] }
];

const P = (name, pack, skeleton, pal, type, surface, density, corners, motion) =>
  ({ name, pack, skeleton, dna: { pal, type, surface, density, corners, motion } });

/* 54 curated presets. Each is a skeleton + a style recipe — not a separate
   codebase. Change a section's words once and all 54 update. */
export const PRESETS = [
  P("Ledger",        "ssl-full",      "S-03","ledger","editorial","lifted","compact","8","reveal"),
  P("Meridian",      "ssl-full",      "S-01","meridian","modern","flat","open","8","reveal"),
  P("Harbour",       "ssl-full",      "S-03","harbour","neutral","lifted","compact","4","reveal"),
  P("Atlas",         "ssl-full",      "S-02","atlas","technical","flat","compact","8","stagger"),
  P("Bastion",       "ssl-full",      "S-03","navy-gold","institutional","paper","open","0","none"),
  P("Cobalt",        "ssl-full",      "S-01","cobalt","swiss","lifted","compact","8","reveal"),
  P("Broadsheet",    "ssl-full",      "S-04","graphite","gazette","outlined","open","0","none"),
  P("Pine",          "ssl-full",      "S-03","pine","humanist","etched","open","4","reveal"),
  P("Steelworks",    "ssl-full",      "S-02","steel","engineered","flat","tight","4","stagger"),
  P("Almanac",       "ssl-full",      "S-04","clay","classic","paper","open","0","none"),
  P("Indigo",        "ssl-full",      "S-01","indigo","corporate","lifted","compact","8","reveal"),
  P("Teal Ink",      "ssl-full",      "S-03","teal-ink","geometric","flat","compact","16","reveal"),
  P("Slate",         "ssl-full",      "S-02","slate","neutral","outlined","tight","0","none"),
  P("Moss",          "ssl-full",      "S-01","moss","warm","etched","open","8","reveal"),
  P("Plum",          "ssl-full",      "S-04","plum","expressive","glass","open","16","parallax"),
  P("Rust",          "ssl-full",      "S-02","rust","compact","paper","compact","4","stagger"),
  P("Vault SSL",     "ssl-full",      "S-03","vault","modern","glass","open","16","parallax"),
  P("Graphite",      "ssl-full",      "S-04","graphite","swiss","flat","tight","0","none"),
  P("Grove",         "ssl-full",      "S-01","grove","serif-body","lifted","open","8","reveal"),
  P("Brasswork",     "ssl-full",      "S-03","brass","institutional","etched","compact","4","reveal"),
  P("Kiln",          "ssl-full",      "S-02","kiln","tall","lifted","compact","8","stagger"),
  P("Signal SSL",    "ssl-full",      "S-01","signal","grotesk","flat","compact","8","reveal"),
  P("Reef",          "ssl-full",      "S-04","reef","solid","lifted","open","16","reveal"),
  P("Ember",         "ssl-full",      "S-02","ember","expressive","glass","compact","16","stagger"),

  P("Foundry",       "automation-lp", "S-05","foundry","technical","flat","compact","4","stagger"),
  P("Shift",         "automation-lp", "S-05","atlas","modern","lifted","compact","8","reveal"),
  P("Cadence",       "automation-lp", "S-06","meridian","geometric","flat","open","16","reveal"),
  P("Zero Touch",    "automation-lp", "S-07","graphite","mono-lead","outlined","tight","0","none"),
  P("Clockwork",     "automation-lp", "S-05","steel","engineered","etched","compact","4","stagger"),
  P("Runway",        "automation-lp", "S-06","cobalt","swiss","lifted","open","8","reveal"),
  P("Relay",         "automation-lp", "S-07","reef","solid","flat","compact","16","reveal"),
  P("Pipeline",      "automation-lp", "S-05","slate","technical","outlined","tight","4","stagger"),
  P("Autopilot",     "automation-lp", "S-06","signal","modern","glass","open","16","parallax"),
  P("Kiln Auto",     "automation-lp", "S-07","kiln","tall","lifted","compact","8","reveal"),
  P("Meter",         "automation-lp", "S-05","teal-ink","compact","flat","compact","4","stagger"),
  P("Ratchet",       "automation-lp", "S-06","rust","engineered","paper","compact","0","none"),
  P("Cycle",         "automation-lp", "S-05","pine","humanist","etched","open","8","reveal"),
  P("Baseline",      "automation-lp", "S-07","harbour","neutral","flat","tight","4","none"),
  P("Uptime",        "automation-lp", "S-06","navy-gold","corporate","lifted","compact","8","reveal"),
  P("Drift",         "automation-lp", "S-05","plum","expressive","glass","open","16","parallax"),
  P("Ledger Auto",   "automation-lp", "S-06","ledger","editorial","lifted","compact","8","reveal"),
  P("Moss Auto",     "automation-lp", "S-07","moss","warm","flat","open","8","reveal"),

  P("Vault",         "vmc-cmc-dmarc", "S-08","vault","modern","glass","open","16","parallax"),
  P("Brass Mark",    "vmc-cmc-dmarc", "S-08","brass","institutional","paper","open","0","none"),
  P("Rosette",       "vmc-cmc-dmarc", "S-09","indigo","classic","lifted","open","8","reveal"),
  P("Ember Mark",    "vmc-cmc-dmarc", "S-08","ember","expressive","lifted","compact","16","stagger"),
  P("Postmark",      "vmc-cmc-dmarc", "S-09","clay","gazette","paper","open","0","none"),
  P("Envelope",      "vmc-cmc-dmarc", "S-10","harbour","neutral","flat","compact","8","reveal"),
  P("Sigil",         "vmc-cmc-dmarc", "S-08","plum","expressive","glass","open","16","parallax"),
  P("Crest",         "vmc-cmc-dmarc", "S-09","navy-gold","institutional","etched","open","4","reveal"),
  P("Bluecheck",     "vmc-cmc-dmarc", "S-08","cobalt","swiss","lifted","compact","8","reveal"),
  P("Watermark",     "vmc-cmc-dmarc", "S-10","graphite","mono-lead","outlined","tight","0","none"),
  P("Emblem",        "vmc-cmc-dmarc", "S-09","teal-ink","geometric","flat","open","16","reveal"),
  P("Hallmark",      "vmc-cmc-dmarc", "S-08","pine","serif-body","lifted","open","8","reveal")
];

/* ---- fingerprint ---- */
const hx = (n) => n.toString(16).toUpperCase().padStart(2, "0");
const idx = (arr, id) => Math.max(0, arr.findIndex(x => x.id === id));

export function fingerprint(dna, skeletonId) {
  const a = idx(PALETTES, dna.pal);
  const b = idx(TYPES, dna.type);
  const c = idx(SKELETONS, skeletonId) * 16 + idx(DENSITY, dna.density) * 4 + idx(CORNERS, dna.corners) % 4;
  const d = idx(SURFACES, dna.surface) * 8 + idx(MOTION, dna.motion);
  return [hx(a), hx(b), hx(c % 256), hx(d)].join(":");
}

export function pick(arr, id) { return arr.find(x => x.id === id) || arr[0]; }

/* Convert DNA to the CSS custom properties the preview page consumes. */
export function dnaToCss(dna) {
  const p = pick(PALETTES, dna.pal);
  const t = pick(TYPES, dna.type);
  const d = pick(DENSITY, dna.density);
  const c = pick(CORNERS, dna.corners);
  const s = pick(SURFACES, dna.surface);
  return {
    "--p-deep": p.deep, "--p-primary": p.primary, "--p-accent": p.accent,
    "--p-night": p.night, "--p-wash": p.wash, "--p-line": p.line,
    "--p-ink": p.ink, "--p-ink2": p.ink2,
    "--p-display": `${t.display}, sans-serif`,
    "--p-body": `${t.body}, sans-serif`,
    "--p-pad": `${d.pad}px`, "--p-gap": `${d.gap}px`, "--p-scale": d.scale,
    "--p-radius": `${c.r}px`,
    "--p-card": s.card
  };
}

export function surfaceCss(dna) { return pick(SURFACES, dna.surface).card; }

export function shuffle(dna, locks, skeletonId, packId) {
  const r = (arr) => arr[Math.floor(Math.random() * arr.length)].id;
  const next = { ...dna };
  if (!locks.pal) next.pal = r(PALETTES);
  if (!locks.type) next.type = r(TYPES);
  if (!locks.surface) next.surface = r(SURFACES);
  if (!locks.density) next.density = r(DENSITY);
  if (!locks.corners) next.corners = r(CORNERS);
  if (!locks.motion) next.motion = r(MOTION);
  let sk = skeletonId;
  if (!locks.layout) {
    const fits = SKELETONS.filter(s => s.packs.includes(packId));
    sk = fits[Math.floor(Math.random() * fits.length)].id;
  }
  return { dna: next, skeletonId: sk };
}
