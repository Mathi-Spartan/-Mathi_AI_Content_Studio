/* The structure library. Every entry is a genuinely different arrangement —
   different DOM order, grid template, framing or flow — not a recolour.
   The count shown in the app is COMPUTED from this registry so it stays honest. */

export const GEO = {
  hero: [
    { id: "split", name: "Split" }, { id: "mirror", name: "Mirror" }, { id: "centre", name: "Centre" },
    { id: "editorial", name: "Editorial" }, { id: "banded", name: "Banded" }, { id: "poster", name: "Poster" },
    { id: "frame", name: "Frame" }, { id: "diagonal", name: "Diagonal" }, { id: "sidecar", name: "Sidecar" },
    { id: "statfirst", name: "Stat first" }, { id: "minimal", name: "Minimal" }, { id: "marquee", name: "Marquee" },
    { id: "overlap", name: "Overlap" }, { id: "gridbg", name: "Grid" }, { id: "twin", name: "Twin" },
    { id: "arch", name: "Arch" }, { id: "ribbon", name: "Ribbon" }, { id: "terminal", name: "Terminal" },
    { id: "receipt", name: "Receipt" }, { id: "blueprint", name: "Blueprint" }, { id: "magazine", name: "Magazine" },
    { id: "badges", name: "Badge wall" }, { id: "countdown", name: "Countdown" }, { id: "orbit", name: "Orbit" }
  ],
  points: [
    { id: "cards3", name: "Three cards" }, { id: "cards2", name: "Two cards" }, { id: "cards4", name: "Four up" },
    { id: "ruled", name: "Ruled" }, { id: "numgrid", name: "Number grid" }, { id: "aside", name: "Side head" },
    { id: "tiles", name: "Tiles" }, { id: "zigzag", name: "Zigzag" }, { id: "columns", name: "Columns" },
    { id: "rail", name: "Rail" }, { id: "ledger", name: "Ledger" }, { id: "spotlight", name: "Spotlight" },
    { id: "offset", name: "Offset" }, { id: "bandlist", name: "Band list" }, { id: "duo", name: "Duo" },
    { id: "stack", name: "Stack" }
  ],
  steps: [
    { id: "rows", name: "Rows" }, { id: "railway", name: "Railway" }, { id: "cards", name: "Cards" },
    { id: "checklist", name: "Checklist" }, { id: "ladder", name: "Ladder" }, { id: "vtimeline", name: "Timeline" },
    { id: "alternating", name: "Alternating" }, { id: "circuit", name: "Circuit" }, { id: "tabs", name: "Tabs" },
    { id: "bignum", name: "Big numbers" }, { id: "splitpanel", name: "Split panel" }, { id: "compact", name: "Compact" },
    { id: "chevron", name: "Chevron" }, { id: "pathway", name: "Pathway" }, { id: "staircase", name: "Staircase" },
    { id: "dashed", name: "Dashed" }
  ],
  table: [
    { id: "grid", name: "Table" }, { id: "eras", name: "Era cards" }, { id: "timeline", name: "Timeline" },
    { id: "bars", name: "Bars" }, { id: "splitcards", name: "Split cards" }, { id: "stackrows", name: "Stacked" },
    { id: "matrix", name: "Matrix" }, { id: "bannerstats", name: "Banner" }, { id: "countdown", name: "Countdown" },
    { id: "ribbonrow", name: "Ribbon" }, { id: "ledger", name: "Ledger" }, { id: "columnsvs", name: "Versus" },
    { id: "gauge", name: "Gauge" }, { id: "dominoes", name: "Dominoes" }, { id: "milestones", name: "Milestones" },
    { id: "foldout", name: "Foldout" }
  ],
  products: [
    { id: "grid3", name: "Grid of three" }, { id: "grid2", name: "Grid of two" }, { id: "rows", name: "Rows" },
    { id: "grouped", name: "Grouped" }, { id: "band", name: "Band" }, { id: "shelf", name: "Shelf" },
    { id: "featured", name: "Featured" }, { id: "checker", name: "Checker" }, { id: "spec", name: "Spec table" },
    { id: "minimal", name: "Minimal" }, { id: "pills", name: "Pills" }, { id: "panels", name: "Panels" },
    { id: "catalog", name: "Catalogue" }, { id: "duo", name: "Duo" }, { id: "tiers", name: "Tiers" },
    { id: "mosaic", name: "Mosaic" }
  ],
  faq: [
    { id: "ruled", name: "Ruled" }, { id: "twocol", name: "Two columns" }, { id: "cards", name: "Cards" },
    { id: "boxed", name: "Boxed" }, { id: "numbered", name: "Numbered" }, { id: "splitaside", name: "Side head" },
    { id: "wide", name: "Wide" }, { id: "compact", name: "Compact" }, { id: "zebra", name: "Zebra" },
    { id: "drawer", name: "Drawer" }, { id: "inline", name: "Inline" }, { id: "grid4", name: "Grid" },
    { id: "bubble", name: "Bubble" }, { id: "index", name: "Index" }
  ],
  form: [
    { id: "grid", name: "Grid" }, { id: "stacked", name: "Stacked" }, { id: "centred", name: "Centred" },
    { id: "aside", name: "Side head" }, { id: "darkpanel", name: "Dark panel" }, { id: "splitband", name: "Split band" },
    { id: "floating", name: "Floating" }, { id: "lines", name: "Lines" }, { id: "widecta", name: "Wide" },
    { id: "twostep", name: "Two step" }, { id: "boxed", name: "Boxed" }, { id: "sidebar", name: "Sidebar" }
  ],
  contact: [
    { id: "bar", name: "Bar" }, { id: "cards", name: "Cards" }, { id: "banddark", name: "Dark band" },
    { id: "split", name: "Split" }, { id: "centredbig", name: "Centred" }, { id: "framed", name: "Framed" },
    { id: "ribbon", name: "Ribbon" }, { id: "minimal", name: "Minimal" }, { id: "mega", name: "Mega" },
    { id: "corner", name: "Corner" }, { id: "gradient", name: "Gradient" }, { id: "outline", name: "Outline" }
  ]
};

/* Structural modifiers per family — each changes the DOM, not just a colour. */
export const MODS = {
  hero: { key: "media", options: ["panel", "stats", "ticker", "none"], name: "Media" },
  points: { key: "marker", options: ["plain", "number", "tick", "bar"], name: "Marker" },
  steps: { key: "marker", options: ["number", "tick", "dot"], name: "Marker" },
  table: { key: "framemode", options: ["open", "framed"], name: "Frame" },
  products: { key: "badge", options: ["plain", "badged"], name: "Badges" },
  faq: { key: "marker", options: ["plain", "qletter", "number"], name: "Marker" },
  form: null,
  contact: null
};

/* Some hero geometries dictate their media slot. */
const HERO_MEDIA = {
  minimal: ["none"], marquee: ["ticker"], statfirst: ["stats"],
  poster: ["none", "stats"], badges: ["none"], countdown: ["stats", "none"],
  terminal: ["panel", "none"], receipt: ["panel"], editorial: ["none", "stats"],
  ribbon: ["panel", "stats", "none"]
};
export function heroMedia(g) { return HERO_MEDIA[g] || MODS.hero.options; }

export function validMods(family, g) {
  if (family === "hero") return heroMedia(g);
  const m = MODS[family];
  return m ? m.options : ["default"];
}

/* The honest count: geometries × their valid structural modifiers, per family. */
export function familyCount(family) {
  return (GEO[family] || []).reduce((n, g) => n + validMods(family, g.id).length, 0);
}
export function libraryCount() {
  return Object.keys(GEO).reduce((n, f) => n + familyCount(f), 0);
}
export function pickGeo(family, r) {
  const gs = GEO[family] || [{ id: "default" }];
  const g = gs[Math.floor(r() * gs.length) % gs.length].id;
  const mods = validMods(family, g);
  const m = mods[Math.floor(r() * mods.length) % mods.length];
  return { g, m };
}
export function nextGeo(family, cur) {
  const gs = GEO[family] || [];
  const i = gs.findIndex(x => x.id === cur.g);
  const g = gs[(i + 1) % gs.length].id;
  const mods = validMods(family, g);
  return { g, m: mods.indexOf(cur.m) > -1 ? cur.m : mods[0] };
}
export function geoName(family, id) {
  const g = (GEO[family] || []).filter(x => x.id === id)[0];
  return g ? g.name : id;
}
