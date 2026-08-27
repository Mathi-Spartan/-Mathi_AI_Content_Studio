import React from "react";
import { FAMILY, Hero, Points, TableSec, Steps, Products, Faq, Form, Contact, Head } from "./blocks.jsx";
import { SKELETONS, TYPES, SURFACES, DENSITY, CORNERS, pick } from "./dna.js";

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

export default function PartnerPage({ pack, partner, comp, choice }) {
  const order = comp.order;
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
        <nav>{order.filter(id => ["hero", "enquiry", "contact"].indexOf(id) < 0).slice(0, 4).map(id => {
          const s = secOf(id); return s ? <a key={id}>{s.label}</a> : null;
        })}</nav>
        <span className="pp-cta">Get a quote</span>
      </div>

      {order.map((id, i) => {
        const s = secOf(id); if (!s) return null;
        const v = varOf(s);
        const block = comp.blocks[id] || "default";
        const fam = FAMILY[id] || "points";
        const head = <Head v={v} partner={partner} />;
        const cls = anim && i > 0 ? anim : "";
        const props = { block, v, partner, head, sectionId: id, pack, dna: comp.dna };
        let node;
        if (fam === "hero") node = <Hero {...props} />;
        else if (fam === "points") node = <Points {...props} />;
        else if (fam === "table") node = <TableSec {...props} />;
        else if (fam === "steps") node = <Steps {...props} />;
        else if (fam === "products") node = <Products {...props} />;
        else if (fam === "faq") node = <Faq {...props} />;
        else if (fam === "form") node = <Form {...props} />;
        else node = <Contact {...props} />;
        return <div key={id} className={"pp-slot " + cls} data-i={i}>{node}</div>;
      })}

      <div className="pp-foot">
        <b>{brand}</b>
        <span>{partner.email || "\u27E8email\u27E9"} · {partner.phone || "\u27E8phone\u27E9"}</span>
        <span>{[partner.city, partner.country].filter(Boolean).join(", ") || "\u27E8city\u27E9"}</span>
      </div>
    </div>
  );
}

export { SKELETONS };
