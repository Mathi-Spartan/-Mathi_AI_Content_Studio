import React from "react";
import { renderSection, FAMILY, Head } from "./blocks.jsx";
import { TYPES, DENSITY, CORNERS, pick } from "./dna.js";
import { geoName, validMods, GEO } from "./geometry.js";

const M = (s, p) => typeof s === "string"
  ? s.replace(/\{\{\s*partner\.([a-z_]+)\s*\}\}/gi, (m, k) => (p[k] || "").trim() || "\u27E8" + k + "\u27E9")
  : s;

export function compToCss(comp) {
  const p = comp.palette;
  const t = pick(TYPES, comp.dna.type);
  const d = pick(DENSITY, comp.dna.density);
  const c = pick(CORNERS, comp.dna.corners);
  return {
    "--p-deep": p.deep, "--p-primary": p.primary, "--p-accent": p.accent,
    "--p-night": p.night, "--p-wash": p.wash, "--p-line": p.line,
    "--p-ink": p.ink, "--p-ink2": p.ink2,
    "--p-display": t.display + ", sans-serif",
    "--p-body": t.body + ", sans-serif",
    "--p-pad": d.pad + "px", "--p-gap": d.gap + "px", "--p-scale": d.scale,
    "--p-radius": c.r + "px"
  };
}

/* editable=true renders the hover toolbar per section (the canvas IS the editor).
   editable=false is used for mini previews and export. */
export default function PartnerPage({ pack, partner, comp, choice, editable, onOpen, onCycle, onDice }) {
  const secOf = id => pack.content.filter(s => s.id === id)[0];
  const varOf = s => s.variants.filter(v => v.id === choice[pack.id + ":" + s.id])[0] || s.variants[0];
  const brand = (partner.name || "Partner").toUpperCase();
  const css = compToCss(comp);
  const anim = comp.dna.motion !== "none" ? " pp-" + comp.dna.motion : "";

  return (
    <div className={"pp surf-" + comp.dna.surface + " rhythm-" + comp.dna.rhythm + " acc-" + comp.dna.accentShape} style={css}>
      <div className="pp-top">
        <span>{M(partner.ca_status || "Certified Partner", partner)}</span>
        <span className="pp-topr">{partner.phone || "\u27E8phone\u27E9"}</span>
      </div>
      <div className={"pp-nav nav-" + comp.dna.nav}>
        <span className="pp-logo">{brand}</span>
        <nav>{comp.order.filter(id => ["hero", "enquiry", "contact"].indexOf(id) < 0).slice(0, 4).map(id => {
          const s = secOf(id); return s ? <a key={id}>{s.label}</a> : null;
        })}</nav>
        <span className="pp-cta">Get a quote</span>
      </div>

      {comp.order.map((id, i) => {
        const s = secOf(id); if (!s) return null;
        const v = varOf(s);
        const geo = comp.blocks[id] || { g: "default", m: "default" };
        const fam = FAMILY[id] || "points";
        const head = <Head v={v} partner={partner} />;
        const node = renderSection({ id, geo, v, partner, pack, head });
        return (
          <div key={id} className={"pp-slot" + (i > 0 ? anim : "") + (editable ? " editable" : "")} data-i={i}>
            {editable && (
              <div className="canvas-tools" onClick={e => e.stopPropagation()}>
                <span className="ct-name">{s.label}</span>
                <button className="ct-b" title="Previous layout" onClick={() => onCycle(id, -1)}>‹</button>
                <span className="ct-geo" onClick={() => onOpen(id)}>{geoName(fam, geo.g)}</span>
                <button className="ct-b" title="Next layout" onClick={() => onCycle(id, 1)}>›</button>
                <button className="ct-b dice" title="Surprise me" onClick={() => onDice(id)}>⚄</button>
                <button className="ct-b more" title={"All " + (GEO[fam] || []).length + " layouts"} onClick={() => onOpen(id)}>⊞</button>
              </div>
            )}
            {node}
          </div>
        );
      })}

      <div className="pp-foot">
        <b>{brand}</b>
        <span>{partner.email || "\u27E8email\u27E9"} · {partner.phone || "\u27E8phone\u27E9"}</span>
        <span>{[partner.city, partner.country].filter(Boolean).join(", ") || "\u27E8city\u27E9"}</span>
      </div>
    </div>
  );
}

/* One section rendered alone — used by the layout drawer tiles. */
export function SectionOnly({ pack, partner, comp, choice, id, geo }) {
  const s = pack.content.filter(x => x.id === id)[0];
  if (!s) return null;
  const v = s.variants.filter(x => x.id === choice[pack.id + ":" + s.id])[0] || s.variants[0];
  const head = <Head v={v} partner={partner} />;
  const css = compToCss(comp);
  return (
    <div className={"pp surf-" + comp.dna.surface + " acc-" + comp.dna.accentShape} style={css}>
      {renderSection({ id, geo, v, partner, pack, head })}
    </div>
  );
}
