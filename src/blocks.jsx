import React from "react";
import facts from "../content/facts.json";

/* Every section belongs to a FAMILY. Each family has several genuinely
   different structural layouts. A page picks one block per section, so two
   partners with the same content and the same palette still get different
   pages. This is where the variety actually lives. */

export const FAMILY = {
  hero: "hero",
  "why-partner": "points", limits: "points", valimail: "points", platforms: "points",
  "the-change": "table", "vmc-vs-cmc": "table",
  "renewal-anatomy": "steps", "migration-path": "steps", "how-it-works": "steps",
  process: "steps", requirements: "steps", "the-arithmetic": "steps",
  certificates: "products", automation: "products", plans: "products", "dmarc-ladder": "products",
  guides: "faq", faq: "faq",
  enquiry: "form", contact: "contact"
};

export const BLOCKS = {
  hero: ["split", "centre", "editorial", "banded", "asym", "minimal", "datafirst", "stack", "mirror", "ticker"],
  points: ["cards3", "cards2", "ruled", "numbered", "aside", "tiles"],
  table: ["grid", "eras", "timeline", "bars"],
  steps: ["rows", "railway", "cards", "checklist", "ladder"],
  products: ["grid3", "grid2", "rows", "grouped", "band"],
  faq: ["twocol", "ruled", "cards", "boxed"],
  form: ["grid", "stacked", "centred", "aside"],
  contact: ["bar", "cards"]
};

const M = (s, p) => typeof s === "string"
  ? s.replace(/\{\{\s*partner\.([a-z_]+)\s*\}\}/gi, (m, k) => (p[k] || "").trim() || "\u27E8" + k + "\u27E9")
  : s;

/* ============================ HERO ============================ */
export function Hero({ block, v, partner, pack, dna }) {
  const t = s => M(s, partner);
  const Widget = pack.id === "vmc-cmc-dmarc" ? InboxCard : OrderCard;
  const eyebrow = v.eyebrow ? <span className="pp-badge">{t(v.eyebrow)}</span> : null;
  const btns = (
    <div className="pp-btns">
      <span className="pp-b1">{v.cta_primary}</span>
      <span className="pp-b2">{v.cta_secondary}</span>
    </div>
  );
  const copy = <>{eyebrow}<h1>{t(v.headline)}</h1><p className="pp-hl">{t(v.lede)}</p>{btns}</>;

  switch (block) {
    case "centre":
      return <section className="pp-hero h-centre"><div className="pp-hin">{eyebrow}<h1>{t(v.headline)}</h1><p className="pp-hl">{t(v.lede)}</p>{btns}</div><div className="pp-hwide"><Widget partner={partner} /></div></section>;
    case "editorial":
      return <section className="pp-hero h-editorial"><div className="pp-hrule" />{eyebrow}<h1>{t(v.headline)}</h1><div className="pp-hcols"><p className="pp-hl">{t(v.lede)}</p><div>{btns}</div></div><div className="pp-hrule" /></section>;
    case "banded":
      return (<><section className="pp-hero h-banded">{eyebrow}<h1>{t(v.headline)}</h1></section>
        <section className="pp-hero-under"><div><p className="pp-hl dark">{t(v.lede)}</p>{btns}</div><Widget partner={partner} /></section></>);
    case "asym":
      return <section className="pp-hero h-asym"><div className="pp-hasym">{copy}</div><div className="pp-hfloat"><Widget partner={partner} /></div></section>;
    case "minimal":
      return <section className="pp-hero h-minimal">{eyebrow}<h1>{t(v.headline)}</h1><p className="pp-hl">{t(v.lede)}</p><div className="pp-btns"><span className="pp-b1">{v.cta_primary}</span></div></section>;
    case "datafirst":
      return <section className="pp-hero h-data"><div className="pp-hdatawrap"><Widget partner={partner} /></div><div className="pp-hdatacopy">{eyebrow}<h2 className="pp-hsm">{t(v.headline)}</h2><p className="pp-hl">{t(v.lede)}</p>{btns}</div></section>;
    case "stack":
      return <section className="pp-hero h-stack">{eyebrow}<h1>{t(v.headline)}</h1><p className="pp-hl">{t(v.lede)}</p>{btns}<div className="pp-hstats">{facts.validity_schedule.phases.map(p => <div key={p.from}><b>{p.max_validity_days}</b><span>days from {p.from.slice(0, 4)}</span></div>)}</div></section>;
    case "mirror":
      return <section className="pp-hero h-split mirror"><div className="pp-hgrid"><Widget partner={partner} /><div>{copy}</div></div></section>;
    case "ticker":
      return (<section className="pp-hero h-ticker"><div className="pp-hgrid"><div>{copy}</div><Widget partner={partner} /></div>
        <div className="pp-tick"><span>DigiCert</span><span>GeoTrust</span><span>RapidSSL</span><span>Thawte</span><span>Sectigo</span><span>DigiCert</span><span>GeoTrust</span></div></section>);
    default:
      return <section className="pp-hero h-split"><div className="pp-hgrid"><div>{copy}</div><Widget partner={partner} /></div></section>;
  }
}

/* ============================ POINTS ============================ */
export function Points({ block, v, partner, head }) {
  const t = s => M(s, partner);
  const rows = v.points || v.rows || (v.products_from_facts ? [] : []);
  const list = rows.length ? rows : (v.stage_detail || []).map(s => ({ title: s.title, body: s.body }));
  if (!list.length) return <SecShell head={head}>{null}</SecShell>;

  switch (block) {
    case "cards2": return <SecShell head={head}><div className="pp-grid two">{list.map((r, i) => <Card key={i} r={r} t={t} />)}</div></SecShell>;
    case "ruled": return <SecShell head={head}><div className="pp-ruled">{list.map((r, i) => <div key={i}><b>{t(r.title)}</b><p>{t(r.body)}</p></div>)}</div></SecShell>;
    case "numbered": return <SecShell head={head}><div className="pp-numgrid">{list.map((r, i) => <div key={i}><i>{String(i + 1).padStart(2, "0")}</i><b>{t(r.title)}</b><p>{t(r.body)}</p></div>)}</div></SecShell>;
    case "aside": return <SecShell head={head} aside><div className="pp-asidelist">{list.map((r, i) => <div key={i}><b>{t(r.title)}</b><p>{t(r.body)}</p></div>)}</div></SecShell>;
    case "tiles": return <SecShell head={head}><div className="pp-tiles">{list.map((r, i) => <div key={i} className={i % 3 === 0 ? "wide" : ""}><b>{t(r.title)}</b><p>{t(r.body)}</p></div>)}</div></SecShell>;
    default: return <SecShell head={head}><div className="pp-grid three">{list.map((r, i) => <Card key={i} r={r} t={t} />)}</div></SecShell>;
  }
}
const Card = ({ r, t }) => <div className="pp-card"><h4>{t(r.title)}</h4><p>{t(r.body)}</p></div>;

/* ============================ TABLE ============================ */
export function TableSec({ block, v, partner, head, sectionId }) {
  const t = s => M(s, partner);
  const isVmc = sectionId === "vmc-vs-cmc";
  const phases = facts.validity_schedule.phases;

  if (isVmc) {
    const rows = v.rows || [];
    if (block === "eras") return <SecShell head={head}><div className="pp-grid two">{rows.slice(0, 6).map((r, i) => <div key={i} className="pp-card"><h4>{r.label}</h4><p><b>VMC</b> {r.vmc}</p><p><b>CMC</b> {r.cmc}</p></div>)}</div></SecShell>;
    return <SecShell head={head}><div className="pp-table">
      <div className="pp-tr pp-th"><span /><span>VMC</span><span>CMC</span></div>
      {rows.map((r, i) => <div key={i} className="pp-tr"><span><b>{r.label}</b></span><span>{r.vmc}</span><span>{r.cmc}</span></div>)}
    </div>{v.recommendation && <p className="pp-foot-note">{t(v.recommendation)}</p>}</SecShell>;
  }

  switch (block) {
    case "eras":
      return <SecShell head={head}><div className="pp-grid three">{phases.map(p => (
        <div key={p.from} className={"pp-era" + (p.max_validity_days === 47 ? " hot" : "")}>
          <b>{p.max_validity_days}</b><span>days maximum</span>
          <em>from {new Date(p.from).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</em>
          <p>Domain validation reuse {p.dcv_reuse_days} days</p>
        </div>))}</div>{v.footnote && <p className="pp-foot-note">{t(v.footnote)}</p>}</SecShell>;
    case "timeline":
      return <SecShell head={head}><div className="pp-tl">{phases.map((p, i) => (
        <div key={p.from} className={"pp-tlnode" + (i === phases.length - 1 ? " hot" : "")}>
          <i /><b>{new Date(p.from).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</b>
          <span>{p.max_validity_days}-day certificates</span><em>DCV reuse {p.dcv_reuse_days}d</em>
        </div>))}</div>{v.footnote && <p className="pp-foot-note">{t(v.footnote)}</p>}</SecShell>;
    case "bars":
      return <SecShell head={head}><div className="pp-bars">{phases.map(p => (
        <div key={p.from} className={"pp-bar" + (p.max_validity_days === 47 ? " hot" : "")}>
          <span className="pp-barlb">{p.from.slice(0, 4)}</span>
          <span className="pp-bartrack"><i style={{ width: (p.max_validity_days / 200 * 100) + "%" }} /></span>
          <span className="pp-barn">{p.max_validity_days}d</span>
        </div>))}</div>{v.footnote && <p className="pp-foot-note">{t(v.footnote)}</p>}</SecShell>;
    default:
      return <SecShell head={head}><div className="pp-table">
        <div className="pp-tr pp-th"><span>In effect from</span><span>Max validity</span><span>DCV reuse</span></div>
        {phases.map(p => <div key={p.from} className={"pp-tr" + (p.max_validity_days === 47 ? " hot" : "")}>
          <span>{new Date(p.from).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span><b>{p.max_validity_days}</b> days</span><span>{p.dcv_reuse_days} days</span>
        </div>)}
      </div>{v.footnote && <p className="pp-foot-note">{t(v.footnote)}</p>}</SecShell>;
  }
}

/* ============================ STEPS ============================ */
export function Steps({ block, v, partner, head }) {
  const t = s => M(s, partner);
  let list = v.steps || v.expanded || (v.routes || []).map(r => ({ title: r.title, body: r.body || r.for }));
  if (!list.length && v.inputs) list = v.inputs.map(i => ({ title: i.label, body: i.hint || "" }));
  if (!list.length) return <SecShell head={head}>{null}</SecShell>;

  switch (block) {
    case "railway":
      return <SecShell head={head}><div className="pp-rail">{list.map((s, i) => (
        <div key={i} className="pp-railnode"><i>{i + 1}</i><b>{t(s.title)}</b><p>{t(s.body)}</p></div>))}</div>
        {v.closer && <p className="pp-foot-note">{t(v.closer)}</p>}</SecShell>;
    case "cards":
      return <SecShell head={head}><div className="pp-grid three">{list.map((s, i) => (
        <div key={i} className="pp-card"><span className="pp-tag">Step {i + 1}</span><h4>{t(s.title)}</h4><p>{t(s.body)}</p></div>))}</div></SecShell>;
    case "checklist":
      return <SecShell head={head}><div className="pp-check">{list.map((s, i) => (
        <div key={i}><em>✓</em><div><b>{t(s.title)}</b><p>{t(s.body)}</p></div></div>))}</div></SecShell>;
    case "ladder":
      return <SecShell head={head}><div className="pp-ladder">{list.map((s, i) => (
        <div key={i} style={{ marginLeft: Math.min(i, 4) * 22 }}><i>{i + 1}</i><b>{t(s.title)}</b><p>{t(s.body)}</p></div>))}</div></SecShell>;
    default:
      return <SecShell head={head}><ol className="pp-steps">{list.map((s, i) => (
        <li key={i}><i>{s.n || i + 1}</i><div><b>{t(s.title)}</b><p>{t(s.body)}</p></div></li>))}</ol>
        {v.closer && <p className="pp-foot-note">{t(v.closer)}</p>}</SecShell>;
  }
}

/* ============================ PRODUCTS ============================ */
export function Products({ block, v, partner, head, sectionId }) {
  const t = s => M(s, partner);
  let items, kind;
  if (sectionId === "certificates") { items = facts.digicert_catalogue.items.map(c => ({ name: c.name, a: c.validation, b: c.coverage })); kind = "cert"; }
  else if (sectionId === "dmarc-ladder") { items = (v.stage_detail || []).map(s => ({ name: s.title, a: "p=" + s.p, note: s.body })); kind = "dmarc"; }
  else { items = facts.automation_products.items.map(p => ({ name: p.name, a: p.validation, b: p.methods.length > 1 ? "Agent + ACME" : "ACME only", note: p.dcv_note })); kind = "auto"; }

  const Item = ({ p }) => (
    <div className="pp-card">
      <h4>{p.name}</h4>
      <div className="pp-tags">{p.a && <span className="pp-chip dv">{p.a}</span>}{p.b && <span className="pp-chip au">{p.b}</span>}</div>
      {p.note && <p className="pp-note">{p.note}</p>}
    </div>
  );

  switch (block) {
    case "grid2": return <SecShell head={head}><div className="pp-grid two">{items.map(p => <Item key={p.name} p={p} />)}</div></SecShell>;
    case "rows": return <SecShell head={head}><div className="pp-prows">{items.map(p => (
      <div key={p.name} className="pp-prow2"><b>{p.name}</b><span className="pp-chip dv">{p.a}</span>{p.b && <span className="pp-chip au">{p.b}</span>}</div>))}</div></SecShell>;
    case "grouped": {
      const g1 = items.filter(p => p.b !== "ACME only"), g2 = items.filter(p => p.b === "ACME only");
      return <SecShell head={head}>
        <div className="pp-group"><span className="pp-glabel">{kind === "auto" ? "Agent or ACME" : "Standard"}</span>
          <div className="pp-grid three">{(g1.length ? g1 : items).map(p => <Item key={p.name} p={p} />)}</div></div>
        {g2.length > 0 && <div className="pp-group"><span className="pp-glabel">ACME only</span>
          <div className="pp-grid two">{g2.map(p => <Item key={p.name} p={p} />)}</div></div>}
      </SecShell>;
    }
    case "band": return <SecShell head={head}><div className="pp-band">{items.map(p => (
      <div key={p.name}><b>{p.name}</b><span>{p.b || p.a}</span></div>))}</div></SecShell>;
    default: return <SecShell head={head}><div className="pp-grid three">{items.map(p => <Item key={p.name} p={p} />)}</div></SecShell>;
  }
}

/* ============================ FAQ ============================ */
export function Faq({ block, v, partner, head }) {
  const t = s => M(s, partner);
  const items = (v.items || (v.groups || []).flatMap(g => g.items) || []).slice(0, 6);
  if (!items.length) return <SecShell head={head}>{null}</SecShell>;
  switch (block) {
    case "twocol": return <SecShell head={head}><div className="pp-faq2">{items.map((i, k) => <div key={k}><b>{i.q}</b><p>{t(i.a)}</p></div>)}</div></SecShell>;
    case "cards": return <SecShell head={head}><div className="pp-grid two">{items.map((i, k) => <div key={k} className="pp-card"><h4>{i.q}</h4><p>{t(i.a)}</p></div>)}</div></SecShell>;
    case "boxed": return <SecShell head={head}><div className="pp-boxfaq">{items.map((i, k) => <div key={k}><span>Q</span><div><b>{i.q}</b><p>{t(i.a)}</p></div></div>)}</div></SecShell>;
    default: return <SecShell head={head}><div className="pp-faq">{items.map((i, k) => <div key={k}><b>{i.q}</b><p>{t(i.a)}</p></div>)}</div></SecShell>;
  }
}

/* ============================ FORM ============================ */
export function Form({ block, v, partner, head }) {
  const fields = v.fields || [];
  const Fld = ({ f, full }) => (
    <div className={"pp-fld" + (full ? " full" : "")}><label>{f.label}{f.required ? " *" : ""}</label><div className="pp-input" /></div>
  );
  const sub = <span className="pp-submit">{v.submit || "Send"}</span>;
  switch (block) {
    case "stacked": return <SecShell head={head} form><div className="pp-formstack">{fields.map((f, i) => <Fld key={i} f={f} full />)}{sub}</div></SecShell>;
    case "centred": return <SecShell head={head} form centre><div className="pp-formcard"><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={i > fields.length - 3} />)}{sub}</div></div></SecShell>;
    case "aside": return <section className="pp-sec form"><div className="pp-formaside"><div className="pp-head">{head}</div><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={f.type === "textarea"} />)}{sub}</div></div></section>;
    default: return <SecShell head={head} form><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={f.type === "textarea" || ["domains", "server", "esp"].indexOf(f.id) > -1} />)}{sub}</div></SecShell>;
  }
}

/* ============================ CONTACT ============================ */
export function Contact({ block, v, partner, head }) {
  const t = s => M(s, partner);
  if (block === "cards") return <SecShell head={head}><div className="pp-grid three">
    <div className="pp-card"><h4>Call</h4><p>{partner.phone || "⟨phone⟩"}</p></div>
    <div className="pp-card"><h4>Email</h4><p>{partner.email || "⟨email⟩"}</p></div>
    {partner.whatsapp ? <div className="pp-card"><h4>WhatsApp</h4><p>{partner.whatsapp}</p></div> : null}
  </div></SecShell>;
  return <SecShell head={head}><p className="pp-foot-note">{t(v.lede)}</p></SecShell>;
}

/* ============================ shell ============================ */
function SecShell({ head, children, aside, form, centre }) {
  return (
    <section className={"pp-sec" + (form ? " form" : "") + (centre ? " centre" : "")}>
      {aside
        ? <div className="pp-asidegrid"><div className="pp-head">{head}</div><div>{children}</div></div>
        : <>{head && <div className="pp-head">{head}</div>}{children}</>}
    </section>
  );
}

export function Head({ v, partner }) {
  const t = s => M(s, partner);
  return <>
    {v.eyebrow && <span className="pp-eb">{t(v.eyebrow)}</span>}
    {v.headline && <h2>{t(v.headline)}</h2>}
    {v.lede && <p>{t(v.lede)}</p>}
  </>;
}

/* ============================ widgets ============================ */
export function OrderCard() {
  return (
    <div className="pp-panel">
      <span className="pp-plabel">Same order · shorter certificates</span>
      {facts.validity_schedule.phases.map(e => {
        const n = Math.max(1, Math.round(365 / e.max_validity_days));
        return (
          <div key={e.from} className={"pp-prow" + (e.max_validity_days === 47 ? " hot" : "")}>
            <span className="pp-pwhen"><b>{e.from.slice(0, 4)}</b>{e.max_validity_days}-day</span>
            <span className="pp-ptrack">{Array.from({ length: Math.min(n, 8) }).map((_, i) => <i key={i} />)}</span>
            <span className="pp-pn">{n}</span>
          </div>
        );
      })}
      <div className="pp-pfoot">None of them need doing by hand.</div>
    </div>
  );
}

export function InboxCard({ partner }) {
  const name = partner.name || "Your Brand";
  return (
    <div className="pp-inbox">
      <div className="pp-ibar"><span>Inbox</span></div>
      <div className="pp-isubj">Your February statement is ready</div>
      <div className="pp-irow">
        <span className="pp-iav">{name.slice(0, 1)}</span>
        <span className="pp-iname">{name} <b>✓</b></span>
        <span className="pp-ito">to me ▾</span>
      </div>
      <div className="pp-ibody" /><div className="pp-ibody short" />
      <span className="pp-itip">Verified sender · logo from a mark certificate</span>
    </div>
  );
}
