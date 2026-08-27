import { BLOCKS, FAMILY } from "./blocks.jsx";
import { TYPES, SURFACES, DENSITY, CORNERS, MOTION, RHYTHM, NAV, ACCENT_SHAPE, SKELETONS } from "./dna.js";
import { buildPalette, HARMONIES, TONES, hashStr, rng, signature, shortId } from "./compose.js";

const take = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];

/* How many structurally distinct pages this engine can express for a pack.
   Counted honestly: skeletons × the product of block choices per section
   × palette modes × type × surface × density × corners × rhythm × nav × accent. */
export function spaceSize(packId) {
  const sks = SKELETONS.filter(s => s.packs.indexOf(packId) > -1);
  let structural = 0;
  sks.forEach(sk => {
    let n = 1;
    sk.order.forEach(id => { n *= (BLOCKS[FAMILY[id] || "points"] || ["a"]).length; });
    structural += n;
  });
  const style = HARMONIES.length * TONES.length * TYPES.length * SURFACES.length *
    DENSITY.length * CORNERS.length * RHYTHM.length * NAV.length * ACCENT_SHAPE.length;
  return { structural, style, total: structural * style };
}

/* Build one composition. The seed is derived from the partner so the same
   partner regenerates the same page unless you bump the nonce. */
export function generate({ packId, partner, brandHex, nonce = 0, keep = {}, skeletonId = null }) {
  const seed = hashStr([partner.name || "partner", partner.site_url || "", packId, nonce].join("|"));
  const r = rng(seed);

  const sks = SKELETONS.filter(s => s.packs.indexOf(packId) > -1);
  const sk = skeletonId ? (sks.filter(s => s.id === skeletonId)[0] || take(r, sks)) : (keep.order ? sks.filter(s => s.order.join() === keep.order.join())[0] || take(r, sks) : take(r, sks));

  const blocks = {};
  sk.order.forEach(id => {
    const fam = FAMILY[id] || "points";
    blocks[id] = (keep.blocks && keep.blocks[id]) || take(r, BLOCKS[fam] || ["default"]);
  });

  const dna = {
    harmony: keep.harmony || take(r, HARMONIES).id,
    tone: keep.tone || take(r, TONES).id,
    type: keep.type || take(r, TYPES).id,
    surface: keep.surface || take(r, SURFACES).id,
    density: keep.density || take(r, DENSITY).id,
    corners: keep.corners || take(r, CORNERS).id,
    motion: keep.motion || take(r, MOTION).id,
    rhythm: keep.rhythm || take(r, RHYTHM).id,
    nav: keep.nav || take(r, NAV).id,
    accentShape: keep.accentShape || take(r, ACCENT_SHAPE).id
  };

  const palette = buildPalette(brandHex || "#123C6B", dna.harmony, dna.tone);
  const comp = { pack: packId, skeleton: sk.id, skeletonName: sk.name, order: sk.order, blocks, dna, palette };
  comp.signature = signature(comp);
  comp.id = shortId(comp);
  return comp;
}

/* Regenerate until the signature is one the ledger has never seen. */
export function generateUnique(opts, usedSignatures, maxTries = 60) {
  let nonce = opts.nonce || 0;
  for (let i = 0; i < maxTries; i++) {
    const c = generate({ ...opts, nonce: nonce + i });
    if (usedSignatures.indexOf(c.signature) < 0) return { comp: c, tries: i + 1 };
  }
  return { comp: generate({ ...opts, nonce: nonce + Math.floor(Math.random() * 1e6) }), tries: maxTries, exhausted: true };
}

/* How different two compositions are, 0–1. Used for the distinctness meter. */
export function distance(a, b) {
  if (!a || !b) return 1;
  let same = 0, total = 0;
  total++; if (a.skeleton === b.skeleton) same++;
  const ids = [...new Set([...Object.keys(a.blocks), ...Object.keys(b.blocks)])];
  ids.forEach(id => { total++; if (a.blocks[id] && a.blocks[id] === b.blocks[id]) same++; });
  ["harmony", "tone", "type", "surface", "density", "corners", "motion", "rhythm", "nav", "accentShape"]
    .forEach(k => { total++; if (a.dna[k] === b.dna[k]) same++; });
  return 1 - same / total;
}

export function minDistance(comp, others) {
  if (!others.length) return 1;
  return Math.min(...others.map(o => distance(comp, o)));
}
