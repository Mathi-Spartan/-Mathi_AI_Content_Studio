export const TYPES = [
  { id: "editorial", name: "Bricolage / Public Sans", display: "'Bricolage Grotesque'", body: "'Public Sans'", tag: "Editorial" },
  { id: "technical", name: "Space Grotesk / Inter", display: "'Space Grotesk'", body: "'Inter'", tag: "Technical" },
  { id: "institutional", name: "Fraunces / Libre Franklin", display: "'Fraunces'", body: "'Libre Franklin'", tag: "Institutional" },
  { id: "neutral", name: "Archivo / Archivo", display: "'Archivo'", body: "'Archivo'", tag: "Neutral" },
  { id: "modern", name: "Sora / DM Sans", display: "'Sora'", body: "'DM Sans'", tag: "Modern" },
  { id: "humanist", name: "Newsreader / Work Sans", display: "'Newsreader'", body: "'Work Sans'", tag: "Humanist" },
  { id: "corporate", name: "IBM Plex Sans", display: "'IBM Plex Sans'", body: "'IBM Plex Sans'", tag: "Corporate" },
  { id: "geometric", name: "Outfit / Manrope", display: "'Outfit'", body: "'Manrope'", tag: "Geometric" },
  { id: "classic", name: "Playfair / Source Serif", display: "'Playfair Display'", body: "'Source Serif 4'", tag: "Classic" },
  { id: "engineered", name: "Chivo / Figtree", display: "'Chivo'", body: "'Figtree'", tag: "Engineered" },
  { id: "expressive", name: "Syne / Epilogue", display: "'Syne'", body: "'Epilogue'", tag: "Expressive" },
  { id: "warm", name: "Lora / Public Sans", display: "'Lora'", body: "'Public Sans'", tag: "Warm" },
  { id: "compact", name: "Bitter / Inter", display: "'Bitter'", body: "'Inter'", tag: "Compact" },
  { id: "swiss", name: "Inter / Inter", display: "'Inter'", body: "'Inter'", tag: "Swiss" },
  { id: "monolead", name: "JetBrains / Inter", display: "'JetBrains Mono'", body: "'Inter'", tag: "Mono-led" },
  { id: "grotesk", name: "Space Grotesk / Figtree", display: "'Space Grotesk'", body: "'Figtree'", tag: "Grotesk" },
  { id: "serifbody", name: "Archivo / Newsreader", display: "'Archivo'", body: "'Newsreader'", tag: "Serif body" },
  { id: "tall", name: "Epilogue / DM Sans", display: "'Epilogue'", body: "'DM Sans'", tag: "Tall" },
  { id: "solid", name: "Manrope / Manrope", display: "'Manrope'", body: "'Manrope'", tag: "Solid" },
  { id: "gazette", name: "Fraunces / Work Sans", display: "'Fraunces'", body: "'Work Sans'", tag: "Gazette" },
  { id: "condensed", name: "Oswald / Public Sans", display: "'Oswald'", body: "'Public Sans'", tag: "Condensed" },
  { id: "editorialserif", name: "Instrument / Inter", display: "'Instrument Serif'", body: "'Inter'", tag: "Editorial serif" },
  { id: "brutal", name: "Archivo Black / Inter", display: "'Archivo Black'", body: "'Inter'", tag: "Brutal" },
  { id: "soft", name: "Quicksand / Nunito Sans", display: "'Quicksand'", body: "'Nunito Sans'", tag: "Soft" },
  { id: "legal", name: "Spectral / Inter", display: "'Spectral'", body: "'Inter'", tag: "Legal" },
  { id: "tech2", name: "Red Hat Display / Red Hat Text", display: "'Red Hat Display'", body: "'Red Hat Text'", tag: "Product" },
  { id: "elegant", name: "Cormorant / Work Sans", display: "'Cormorant Garamond'", body: "'Work Sans'", tag: "Elegant" },
  { id: "utility", name: "Roboto Condensed / Roboto", display: "'Roboto Condensed'", body: "'Roboto'", tag: "Utility" },
  { id: "display2", name: "Unbounded / DM Sans", display: "'Unbounded'", body: "'DM Sans'", tag: "Display" },
  { id: "quiet", name: "Karla / Karla", display: "'Karla'", body: "'Karla'", tag: "Quiet" }
];

export const SURFACES = [
  { id: "flat", name: "Flat" }, { id: "lifted", name: "Lifted" }, { id: "outlined", name: "Outlined" },
  { id: "glass", name: "Glass" }, { id: "paper", name: "Paper" }, { id: "etched", name: "Etched" },
  { id: "brutal", name: "Brutal" }, { id: "softshadow", name: "Soft" }, { id: "inset", name: "Inset" }
];

export const DENSITY = [
  { id: "tight", name: "Tight", pad: 26, gap: 9, scale: 0.94 },
  { id: "compact", name: "Compact", pad: 38, gap: 12, scale: 1.0 },
  { id: "open", name: "Open", pad: 54, gap: 16, scale: 1.06 },
  { id: "airy", name: "Airy", pad: 72, gap: 22, scale: 1.12 }
];

export const CORNERS = [
  { id: "0", name: "0", r: 0 }, { id: "3", name: "3", r: 3 }, { id: "6", name: "6", r: 6 },
  { id: "10", name: "10", r: 10 }, { id: "16", name: "16", r: 16 }, { id: "24", name: "24", r: 24 }
];

export const MOTION = [
  { id: "none", name: "None" }, { id: "reveal", name: "Reveal" },
  { id: "stagger", name: "Stagger" }, { id: "rise", name: "Rise" }, { id: "fade", name: "Fade" }
];

/* Section background patterns — which slots get the wash, which get white,
   which invert to the dark primary. Changes the whole read of a page. */
export const RHYTHM = [
  { id: "alt", name: "Alternating" },
  { id: "white", name: "All white" },
  { id: "washy", name: "Washed" },
  { id: "banded", name: "Banded" },
  { id: "inverted", name: "Dark bands" },
  { id: "bookend", name: "Bookends" }
];

export const NAV = [
  { id: "left", name: "Left" }, { id: "centre", name: "Centre" },
  { id: "split", name: "Split" }, { id: "stacked", name: "Stacked" }, { id: "minimal", name: "Minimal" }
];

export const ACCENT_SHAPE = [
  { id: "solid", name: "Solid" }, { id: "underline", name: "Underline" },
  { id: "bracket", name: "Bracket" }, { id: "highlight", name: "Highlight" }, { id: "dot", name: "Dot" }
];

export const SKELETONS = [
  { id: "S-01", name: "Column", packs: ["ssl-full"], order: ["hero", "why-partner", "the-change", "certificates", "automation", "guides", "enquiry", "contact"] },
  { id: "S-02", name: "Argument", packs: ["ssl-full"], order: ["hero", "the-change", "renewal-anatomy", "automation", "certificates", "migration-path", "enquiry", "contact"] },
  { id: "S-03", name: "Ledger", packs: ["ssl-full"], order: ["hero", "why-partner", "the-change", "renewal-anatomy", "certificates", "platforms", "automation", "migration-path", "guides", "enquiry", "contact"] },
  { id: "S-04", name: "Catalogue", packs: ["ssl-full"], order: ["hero", "certificates", "platforms", "automation", "why-partner", "guides", "enquiry", "contact"] },
  { id: "S-11", name: "Deadline", packs: ["ssl-full"], order: ["hero", "the-change", "certificates", "automation", "why-partner", "migration-path", "enquiry"] },
  { id: "S-12", name: "Service", packs: ["ssl-full"], order: ["hero", "why-partner", "certificates", "guides", "automation", "platforms", "enquiry", "contact"] },
  { id: "S-05", name: "Upsell", packs: ["automation-lp"], order: ["hero", "the-arithmetic", "how-it-works", "plans", "limits", "enquiry"] },
  { id: "S-06", name: "Proof", packs: ["automation-lp"], order: ["hero", "how-it-works", "the-arithmetic", "plans", "limits", "enquiry"] },
  { id: "S-07", name: "Direct", packs: ["automation-lp"], order: ["hero", "plans", "how-it-works", "limits", "enquiry"] },
  { id: "S-13", name: "Objection", packs: ["automation-lp"], order: ["hero", "limits", "how-it-works", "plans", "the-arithmetic", "enquiry"] },
  { id: "S-08", name: "Inbox", packs: ["vmc-cmc-dmarc"], order: ["hero", "vmc-vs-cmc", "requirements", "dmarc-ladder", "valimail", "process", "faq", "enquiry"] },
  { id: "S-09", name: "Readiness", packs: ["vmc-cmc-dmarc"], order: ["hero", "requirements", "dmarc-ladder", "vmc-vs-cmc", "process", "faq", "enquiry"] },
  { id: "S-10", name: "Brief", packs: ["vmc-cmc-dmarc"], order: ["hero", "vmc-vs-cmc", "requirements", "enquiry"] },
  { id: "S-14", name: "Authority", packs: ["vmc-cmc-dmarc"], order: ["hero", "dmarc-ladder", "requirements", "vmc-vs-cmc", "valimail", "faq", "process", "enquiry"] }
];

export function pick(arr, id) { return arr.filter(x => x.id === id)[0] || arr[0]; }
