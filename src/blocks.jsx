import React from "react";
import facts from "../content/facts.json";
import { geoName } from "./geometry.js";

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

const M = (s, p) => typeof s === "string"
  ? s.replace(/\{\{\s*partner\.([a-z_]+)\s*\}\}/gi, (m, k) => (p[k] || "").trim() || "\u27E8" + k + "\u27E9")
  : s;

/* ============================ HERO ============================ */
export function Hero({ geo, v, partner, pack }) {
  const t = s => M(s, partner);
  const g = geo.g, media = geo.m;
  const Media = () => media === "panel" ? (pack.id === "vmc-cmc-dmarc" ? <InboxCard partner={partner} /> : <OrderCard />)
    : media === "stats" ? <Stats /> : null;
  const eyebrow = v.eyebrow ? <span className="pp-badge">{t(v.eyebrow)}</span> : null;
  const btns = <div className="pp-btns"><span className="pp-b1">{v.cta_primary}</span><span className="pp-b2">{v.cta_secondary}</span></div>;
  const H1 = <h1>{t(v.headline)}</h1>;
  const Lede = <p className="pp-hl">{t(v.lede)}</p>;
  const copy = <>{eyebrow}{H1}{Lede}{btns}</>;
  const tick = <div className="pp-tick">{["DigiCert", "GeoTrust", "RapidSSL", "Thawte", "Sectigo", "DigiCert", "GeoTrust", "RapidSSL"].map((n, i) => <span key={i}>{n}</span>)}</div>;

  switch (g) {
    case "mirror": return <section className={hc(g)}><div className="pp-hgrid"><Media />{copyWrap(copy)}</div>{media === "ticker" && tick}</section>;
    case "centre": return <section className={hc(g)}><div className="pp-hin">{eyebrow}{H1}{Lede}{btns}</div>{media !== "none" && <div className="pp-hwide"><Media /></div>}{media === "ticker" && tick}</section>;
    case "editorial": return <section className={hc(g)}><div className="pp-hrule" />{eyebrow}{H1}<div className="pp-hcols">{Lede}<div>{btns}</div></div>{media === "stats" && <Stats />}<div className="pp-hrule" /></section>;
    case "banded": return <><section className={hc(g)}>{eyebrow}{H1}</section><section className="pp-hero-under"><div><p className="pp-hl dark">{t(v.lede)}</p>{btns}</div>{media !== "none" ? <Media /> : <Stats dark />}</section></>;
    case "poster": return <section className={hc(g)}><div className="pp-posterbadge">{eyebrow}</div><div className="pp-posterbottom">{H1}{Lede}{btns}{media === "stats" && <Stats />}</div></section>;
    case "frame": return <section className={hc(g)}><div className="pp-hframe">{eyebrow}{H1}{Lede}{btns}{media !== "none" && <div className="pp-hframemedia"><Media /></div>}</div></section>;
    case "diagonal": return <section className={hc(g)}><div className="pp-hgrid"><div>{copy}</div><div className="pp-hdiagmedia"><Media /></div></div></section>;
    case "sidecar": return <section className={hc(g)}><div className="pp-sidecarrail"><span>{t(partner.name || "Partner")}</span></div><div className="pp-sidecarbody">{copy}{media !== "none" && <div className="pp-sidecarmedia"><Media /></div>}</div></section>;
    case "statfirst": return <section className={hc(g)}><Stats big /><div className="pp-statcopy">{eyebrow}{H1}{Lede}{btns}</div></section>;
    case "minimal": return <section className={hc(g)}>{eyebrow}{H1}{Lede}<div className="pp-btns"><span className="pp-b1">{v.cta_primary}</span></div></section>;
    case "marquee": return <section className={hc(g)}><div className="pp-hgrid"><div>{copy}</div><div /></div>{tick}</section>;
    case "overlap": return <><section className={hc(g)}>{eyebrow}{H1}{Lede}{btns}</section><div className="pp-overlapmedia"><Media /></div></>;
    case "gridbg": return <section className={hc(g)}><div className="pp-hgrid"><div>{copy}</div><Media /></div></section>;
    case "twin": return <section className={hc(g)}>{eyebrow}<h1 className="pp-twin1">{t(v.headline).split(".")[0]}.</h1><div className="pp-twinrule" /><div className="pp-hcols">{Lede}<div>{btns}</div></div>{media !== "none" && <div className="pp-hwide"><Media /></div>}</section>;
    case "arch": return <section className={hc(g)}><div className="pp-hgrid"><div>{copy}</div><div className="pp-arch"><Media /></div></div></section>;
    case "ribbon": return <><div className="pp-heroribbon"><span>{t(v.eyebrow || "")}</span></div><section className={hc(g)}><div className="pp-hgrid"><div>{H1}{Lede}{btns}</div><Media /></div></section></>;
    case "terminal": return <section className={hc(g)}><div className="pp-hgrid"><div>{copy}</div><div className="pp-term"><div className="pp-termbar"><i /><i /><i /></div><pre>{"$ certbot register --eab-kid ****\n$ certbot certonly -d " + (partner.site_url || "example.com").replace(/https?:\/\//, "") + "\n✓ certificate issued\n✓ renewal scheduled — nothing else to do"}</pre></div></div></section>;
    case "receipt": return <section className={hc(g)}><div className="pp-hgrid"><div>{copy}</div><div className="pp-receipt"><b>{t(partner.name || "Partner")}</b><span>Renewals this year</span><div className="pp-receiptrow"><i>Manual, 47-day era</i><em>×12 per cert</em></div><div className="pp-receiptrow hot"><i>With automation</i><em>×0</em></div><span className="pp-receiptfoot">— nothing to do —</span></div></div></section>;
    case "blueprint": return <section className={hc(g)}><div className="pp-hgrid"><div>{copy}</div><Media /></div></section>;
    case "magazine": return <section className={hc(g)}><span className="pp-magkicker">{t(v.eyebrow || "")}</span><h1 className="pp-maghead">{t(v.headline)}</h1><div className="pp-magcols"><p className="pp-hl">{t(v.lede)}</p><div>{btns}{media === "stats" && <Stats />}</div></div></section>;
    case "badges": return <section className={hc(g)}>{H1}{Lede}{btns}<div className="pp-badgewall">{["DigiCert", "GeoTrust", "RapidSSL", "Thawte", "Sectigo", "ACME", "DV·OV·EV", (partner.country || "Local") + " invoicing"].map((b, i) => <span key={i}>{b}</span>)}</div></section>;
    case "countdown": return <section className={hc(g)}><div className="pp-cdrow">{facts.validity_schedule.phases.map(p => <div key={p.from} className="pp-cd"><b>{p.max_validity_days}</b><span>days · {p.from.slice(0, 4)}</span></div>)}</div>{H1}{Lede}{btns}</section>;
    case "orbit": return <section className={hc(g)}><div className="pp-hgrid"><div>{copy}</div><div className="pp-orbit"><i className="o1" /><i className="o2" /><div className="pp-orbitcore">47<span>days</span></div></div></div></section>;
    default: return <section className={hc("split")}><div className="pp-hgrid">{copyWrap(copy)}<Media /></div>{media === "ticker" && tick}</section>;
  }
  function hc(id) { return "pp-hero h-" + id; }
  function copyWrap(c) { return <div>{c}</div>; }
}

function Stats({ big, dark }) {
  return <div className={"pp-hstats" + (big ? " big" : "") + (dark ? " dark" : "")}>
    {facts.validity_schedule.phases.map(p => <div key={p.from}><b>{p.max_validity_days}</b><span>days from {p.from.slice(0, 4)}</span></div>)}
  </div>;
}

/* ============================ POINTS ============================ */
export function Points({ geo, v, partner, head }) {
  const t = s => M(s, partner);
  const rows = v.points || v.rows || (v.stage_detail || []).map(s => ({ title: s.title, body: s.body }));
  if (!rows.length) return <Shell head={head} />;
  const mk = geo.m;
  const Mark = ({ i }) => mk === "number" ? <i className="pp-mk n">{String(i + 1).padStart(2, "0")}</i>
    : mk === "tick" ? <i className="pp-mk t">✓</i>
    : mk === "bar" ? <i className="pp-mk b" /> : null;
  const Item = ({ r, i, cls }) => (
    <div className={"pp-pt " + (cls || "")}><Mark i={i} /><div><b>{t(r.title)}</b><p>{t(r.body)}</p></div></div>
  );
  const g = geo.g;
  const grid = n => <Shell head={head}><div className={"pp-ptgrid g" + n}>{rows.map((r, i) => <Item key={i} r={r} i={i} />)}</div></Shell>;

  switch (g) {
    case "cards2": return grid(2);
    case "cards4": return grid(4);
    case "ruled": return <Shell head={head}><div className="pp-ptruled">{rows.map((r, i) => <Item key={i} r={r} i={i} />)}</div></Shell>;
    case "numgrid": return <Shell head={head}><div className="pp-ptnum">{rows.map((r, i) => <div key={i}><i>{String(i + 1).padStart(2, "0")}</i><b>{t(r.title)}</b><p>{t(r.body)}</p></div>)}</div></Shell>;
    case "aside": return <Shell head={head} aside><div className="pp-ptlist">{rows.map((r, i) => <Item key={i} r={r} i={i} />)}</div></Shell>;
    case "tiles": return <Shell head={head}><div className="pp-pttiles">{rows.map((r, i) => <div key={i} className={i === 0 ? "wide" : ""}><Mark i={i} /><b>{t(r.title)}</b><p>{t(r.body)}</p></div>)}</div></Shell>;
    case "zigzag": return <Shell head={head}><div className="pp-ptzig">{rows.map((r, i) => <div key={i} className={i % 2 ? "r" : ""}><Mark i={i} /><div><b>{t(r.title)}</b><p>{t(r.body)}</p></div></div>)}</div></Shell>;
    case "columns": return <Shell head={head}><div className="pp-ptcols">{rows.map((r, i) => <Item key={i} r={r} i={i} />)}</div></Shell>;
    case "rail": return <Shell head={head}><div className="pp-ptrail">{rows.map((r, i) => <div key={i}><Mark i={i} /><b>{t(r.title)}</b><p>{t(r.body)}</p></div>)}</div></Shell>;
    case "ledger": return <Shell head={head}><div className="pp-ptledger">{rows.map((r, i) => <div key={i}><span className="pp-ledi">{String(i + 1).padStart(2, "0")}</span><b>{t(r.title)}</b><p>{t(r.body)}</p></div>)}</div></Shell>;
    case "spotlight": return <Shell head={head}><div className="pp-ptspot"><div className="lead"><Mark i={0} /><b>{t(rows[0].title)}</b><p>{t(rows[0].body)}</p></div><div className="rest">{rows.slice(1).map((r, i) => <Item key={i} r={r} i={i + 1} />)}</div></div></Shell>;
    case "offset": return <Shell head={head}><div className="pp-ptoffset">{rows.map((r, i) => <div key={i} style={{ marginTop: (i % 2) * 18 }}><Mark i={i} /><b>{t(r.title)}</b><p>{t(r.body)}</p></div>)}</div></Shell>;
    case "bandlist": return <Shell head={head}><div className="pp-ptband">{rows.map((r, i) => <div key={i}><Mark i={i} /><b>{t(r.title)}</b><span>{t(r.body)}</span></div>)}</div></Shell>;
    case "duo": return <Shell head={head}><div className="pp-ptduo">{rows.map((r, i) => <div key={i}><b>{t(r.title)}</b><p>{t(r.body)}</p></div>)}</div></Shell>;
    case "stack": return <Shell head={head}><div className="pp-ptstack">{rows.map((r, i) => <Item key={i} r={r} i={i} />)}</div></Shell>;
    default: return grid(3);
  }
}

/* ============================ TABLE ============================ */
export function TableSec({ geo, v, partner, head, sectionId }) {
  const t = s => M(s, partner);
  const framed = geo.m === "framed";
  const wrap = n => <Shell head={head}><div className={framed ? "pp-framed" : ""}>{n}</div>{v.footnote && <p className="pp-foot-note">{t(v.footnote)}</p>}{v.recommendation && <p className="pp-foot-note">{t(v.recommendation)}</p>}</Shell>;
  const isVmc = sectionId === "vmc-vs-cmc";
  const phases = facts.validity_schedule.phases;

  if (isVmc) {
    const rows = v.rows || [];
    switch (geo.g) {
      case "columnsvs": case "splitcards": return wrap(<div className="pp-vs"><div className="pp-vscol"><h3>VMC</h3>{rows.map((r, i) => <div key={i}><b>{r.label}</b><p>{r.vmc}</p></div>)}</div><div className="pp-vsdiv"><span>vs</span></div><div className="pp-vscol"><h3>CMC</h3>{rows.map((r, i) => <div key={i}><b>{r.label}</b><p>{r.cmc}</p></div>)}</div></div>);
      case "matrix": return wrap(<div className="pp-matrix">{rows.map((r, i) => <div key={i} className="pp-mxrow"><span>{r.label}</span><em className={/^yes/i.test(r.vmc) ? "y" : ""}>{r.vmc}</em><em className={/^yes/i.test(r.cmc) ? "y" : ""}>{r.cmc}</em></div>)}</div>);
      case "stackrows": return wrap(<div className="pp-stackrows">{rows.map((r, i) => <div key={i}><b>{r.label}</b><div><span className="tagv">VMC</span>{r.vmc}</div><div><span className="tagc">CMC</span>{r.cmc}</div></div>)}</div>);
      default: return wrap(<div className="pp-table"><div className="pp-tr pp-th"><span /><span>VMC</span><span>CMC</span></div>{rows.map((r, i) => <div key={i} className="pp-tr"><span><b>{r.label}</b></span><span>{r.vmc}</span><span>{r.cmc}</span></div>)}</div>);
    }
  }

  switch (geo.g) {
    case "eras": return wrap(<div className="pp-eras">{phases.map(p => <div key={p.from} className={"pp-era" + (p.max_validity_days === 47 ? " hot" : "")}><b>{p.max_validity_days}</b><span>days maximum</span><em>from {yr(p.from)}</em><p>DCV reuse {p.dcv_reuse_days}d</p></div>)}</div>);
    case "timeline": return wrap(<div className="pp-tl">{phases.map((p, i) => <div key={p.from} className={"pp-tlnode" + (i === 2 ? " hot" : "")}><i /><b>{yr(p.from)}</b><span>{p.max_validity_days}-day certificates</span><em>DCV {p.dcv_reuse_days}d</em></div>)}</div>);
    case "bars": return wrap(<div className="pp-bars">{phases.map(p => <div key={p.from} className={"pp-bar" + (p.max_validity_days === 47 ? " hot" : "")}><span className="pp-barlb">{p.from.slice(0, 4)}</span><span className="pp-bartrack"><i style={{ width: (p.max_validity_days / 200 * 100) + "%" }} /></span><span className="pp-barn">{p.max_validity_days}d</span></div>)}</div>);
    case "splitcards": return wrap(<div className="pp-splitc"><div className="now"><b>Today</b><span>{phases[0].max_validity_days} days</span></div><div className="then hot"><b>March 2029</b><span>{phases[2].max_validity_days} days · DCV reuse {phases[2].dcv_reuse_days} days</span></div></div>);
    case "stackrows": return wrap(<div className="pp-stackrows">{phases.map(p => <div key={p.from}><b>{yr(p.from)}</b><div>{p.max_validity_days}-day maximum</div><div>DCV reuse {p.dcv_reuse_days} days</div></div>)}</div>);
    case "matrix": return wrap(<div className="pp-matrix"><div className="pp-mxrow hd"><span /><em>Validity</em><em>DCV reuse</em></div>{phases.map(p => <div key={p.from} className="pp-mxrow"><span>{yr(p.from)}</span><em>{p.max_validity_days}d</em><em>{p.dcv_reuse_days}d</em></div>)}</div>);
    case "bannerstats": return wrap(<div className="pp-banner">{phases.map(p => <div key={p.from}><b>{p.max_validity_days}</b><span>{yr(p.from)}</span></div>)}</div>);
    case "countdown": return wrap(<div className="pp-cdrow inpage">{phases.map(p => <div key={p.from} className={"pp-cd" + (p.max_validity_days === 47 ? " hot" : "")}><b>{p.max_validity_days}</b><span>{yr(p.from)}</span></div>)}</div>);
    case "ribbonrow": return wrap(<div className="pp-ribbons">{phases.map(p => <div key={p.from} className={p.max_validity_days === 47 ? "hot" : ""}><span>{yr(p.from)}</span><b>{p.max_validity_days} days</b><em>DCV {p.dcv_reuse_days}d</em></div>)}</div>);
    case "ledger": return wrap(<div className="pp-tledger">{phases.map((p, i) => <div key={p.from}><span>{String(i + 1).padStart(2, "0")}</span><b>{new Date(p.from).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</b><em>{p.max_validity_days} days</em><em>{p.dcv_reuse_days}d reuse</em></div>)}</div>);
    case "gauge": return wrap(<div className="pp-gauges">{phases.map(p => <div key={p.from} className={p.max_validity_days === 47 ? "hot" : ""}><div className="pp-gring" style={{ "--pct": (p.max_validity_days / 398 * 100) + "%" }}><b>{p.max_validity_days}</b></div><span>{yr(p.from)}</span></div>)}</div>);
    case "dominoes": return wrap(<div className="pp-dominoes">{phases.map((p, i) => <div key={p.from} style={{ transform: "rotate(" + (i - 1) * 2 + "deg)" }} className={p.max_validity_days === 47 ? "hot" : ""}><b>{p.max_validity_days}</b><span>{yr(p.from)}</span></div>)}</div>);
    case "milestones": return wrap(<div className="pp-miles">{phases.map(p => <div key={p.from} className={p.max_validity_days === 47 ? "hot" : ""}><em>{yr(p.from)}</em><i /><b>{p.max_validity_days} days</b><span>DCV {p.dcv_reuse_days}d</span></div>)}</div>);
    case "foldout": return wrap(<div className="pp-foldout">{phases.map(p => <details key={p.from} open={p.max_validity_days === 200}><summary>{yr(p.from)} — {p.max_validity_days} days</summary><p>Domain validation reuse {p.dcv_reuse_days} days.</p></details>)}</div>);
    default: return wrap(<div className="pp-table"><div className="pp-tr pp-th"><span>In effect from</span><span>Max validity</span><span>DCV reuse</span></div>{phases.map(p => <div key={p.from} className={"pp-tr" + (p.max_validity_days === 47 ? " hot" : "")}><span>{new Date(p.from).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span><span><b>{p.max_validity_days}</b> days</span><span>{p.dcv_reuse_days} days</span></div>)}</div>);
  }
  function yr(d) { return new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" }); }
}

/* ============================ STEPS ============================ */
export function Steps({ geo, v, partner, head }) {
  const t = s => M(s, partner);
  let list = v.steps || v.expanded || (v.routes || []).map(r => ({ title: r.title, body: r.body || r.for }));
  if (!list.length && v.inputs) list = v.inputs.map(i => ({ title: i.label, body: i.hint || "" }));
  if (!list.length) return <Shell head={head} />;
  const mk = geo.m;
  const Mk = ({ i }) => <i className={"pp-smk " + mk}>{mk === "tick" ? "✓" : mk === "dot" ? "" : (i + 1)}</i>;
  const g = geo.g;

  switch (g) {
    case "railway": return <Shell head={head}><div className="pp-rail2">{list.map((s, i) => <div key={i}><Mk i={i} /><b>{t(s.title)}</b><p>{t(s.body)}</p></div>)}</div>{closer()}</Shell>;
    case "cards": return <Shell head={head}><div className="pp-ptgrid g3">{list.map((s, i) => <div key={i} className="pp-pt card"><Mk i={i} /><div><b>{t(s.title)}</b><p>{t(s.body)}</p></div></div>)}</div></Shell>;
    case "checklist": return <Shell head={head}><div className="pp-check">{list.map((s, i) => <div key={i}><em>✓</em><div><b>{t(s.title)}</b><p>{t(s.body)}</p></div></div>)}</div></Shell>;
    case "ladder": return <Shell head={head}><div className="pp-ladder">{list.map((s, i) => <div key={i} style={{ marginLeft: Math.min(i, 4) * 22 }}><Mk i={i} /><b>{t(s.title)}</b><p>{t(s.body)}</p></div>)}</div></Shell>;
    case "vtimeline": return <Shell head={head}><div className="pp-vtl">{list.map((s, i) => <div key={i}><Mk i={i} /><div><b>{t(s.title)}</b><p>{t(s.body)}</p></div></div>)}</div>{closer()}</Shell>;
    case "alternating": return <Shell head={head}><div className="pp-alt">{list.map((s, i) => <div key={i} className={i % 2 ? "r" : ""}><Mk i={i} /><div><b>{t(s.title)}</b><p>{t(s.body)}</p></div></div>)}</div></Shell>;
    case "circuit": return <Shell head={head}><div className="pp-circuit">{list.map((s, i) => <div key={i}><Mk i={i} /><b>{t(s.title)}</b><p>{t(s.body)}</p></div>)}</div></Shell>;
    case "tabs": return <Shell head={head}><div className="pp-tabs"><div className="pp-tabrow">{list.map((s, i) => <span key={i} className={i === 0 ? "on" : ""}><Mk i={i} />{t(s.title)}</span>)}</div><div className="pp-tabbody"><b>{t(list[0].title)}</b><p>{t(list[0].body)}</p></div></div></Shell>;
    case "bignum": return <Shell head={head}><div className="pp-bignum">{list.map((s, i) => <div key={i}><i>{i + 1}</i><div><b>{t(s.title)}</b><p>{t(s.body)}</p></div></div>)}</div></Shell>;
    case "splitpanel": return <Shell head={head} aside><div className="pp-vtl">{list.map((s, i) => <div key={i}><Mk i={i} /><div><b>{t(s.title)}</b><p>{t(s.body)}</p></div></div>)}</div></Shell>;
    case "compact": return <Shell head={head}><div className="pp-scompact">{list.map((s, i) => <div key={i}><Mk i={i} /><b>{t(s.title)}</b><span>{t(s.body)}</span></div>)}</div></Shell>;
    case "chevron": return <Shell head={head}><div className="pp-chev">{list.map((s, i) => <div key={i}><b>{t(s.title)}</b></div>)}</div><div className="pp-chevdetail">{list.map((s, i) => <p key={i}><Mk i={i} /> {t(s.body)}</p>)}</div></Shell>;
    case "pathway": return <Shell head={head}><div className="pp-path">{list.map((s, i) => <div key={i} className={i % 2 ? "lo" : "hi"}><Mk i={i} /><b>{t(s.title)}</b><p>{t(s.body)}</p></div>)}</div></Shell>;
    case "staircase": return <Shell head={head}><div className="pp-stairs">{list.map((s, i) => <div key={i} style={{ width: (100 - i * (55 / Math.max(list.length - 1, 1))) + "%" }}><Mk i={i} /><b>{t(s.title)}</b><p>{t(s.body)}</p></div>)}</div></Shell>;
    case "dashed": return <Shell head={head}><div className="pp-dashed">{list.map((s, i) => <div key={i}><Mk i={i} /><div><b>{t(s.title)}</b><p>{t(s.body)}</p></div></div>)}</div></Shell>;
    default: return <Shell head={head}><ol className="pp-steps">{list.map((s, i) => <li key={i}><Mk i={i} /><div><b>{t(s.title)}</b><p>{t(s.body)}</p></div></li>)}</ol>{closer()}</Shell>;
  }
  function closer() { return v.closer ? <p className="pp-foot-note">{t(v.closer)}</p> : null; }
}

/* ============================ PRODUCTS ============================ */
export function Products({ geo, v, partner, head, sectionId }) {
  const t = s => M(s, partner);
  let items;
  if (sectionId === "certificates") items = facts.digicert_catalogue.items.map(c => ({ name: c.name, a: c.validation, b: c.coverage }));
  else if (sectionId === "dmarc-ladder") items = (v.stage_detail || []).map(s => ({ name: s.title, a: "p=" + s.p, note: s.body }));
  else items = facts.automation_products.items.map(p => ({ name: p.name, a: p.validation, b: p.methods.length > 1 ? "Agent + ACME" : "ACME only", note: p.dcv_note }));
  const badged = geo.m === "badged";
  const Chips = ({ p }) => <div className="pp-tags">{p.a && <span className="pp-chip dv">{p.a}</span>}{p.b && badged && <span className="pp-chip au">{p.b}</span>}</div>;
  const Card = ({ p, cls }) => <div className={"pp-card " + (cls || "")}><h4>{p.name}</h4><Chips p={p} />{p.note && <p className="pp-note">{p.note}</p>}</div>;
  const g = geo.g;

  switch (g) {
    case "grid2": return <Shell head={head}><div className="pp-ptgrid g2">{items.map(p => <Card key={p.name} p={p} />)}</div></Shell>;
    case "rows": return <Shell head={head}><div className="pp-prows">{items.map(p => <div key={p.name} className="pp-prow2"><b>{p.name}</b><Chips p={p} /></div>)}</div></Shell>;
    case "grouped": { const g1 = items.filter(p => p.b !== "ACME only"), g2 = items.filter(p => p.b === "ACME only");
      return <Shell head={head}><div className="pp-group"><span className="pp-glabel">Agent or ACME</span><div className="pp-ptgrid g3">{(g1.length ? g1 : items).map(p => <Card key={p.name} p={p} />)}</div></div>{g2.length > 0 && <div className="pp-group"><span className="pp-glabel">ACME only</span><div className="pp-ptgrid g2">{g2.map(p => <Card key={p.name} p={p} />)}</div></div>}</Shell>; }
    case "band": return <Shell head={head}><div className="pp-band">{items.map(p => <div key={p.name}><b>{p.name}</b><span>{p.b || p.a}</span></div>)}</div></Shell>;
    case "shelf": return <Shell head={head}><div className="pp-shelf">{items.map(p => <Card key={p.name} p={p} />)}</div></Shell>;
    case "featured": return <Shell head={head}><div className="pp-feat"><Card p={items[0]} cls="lead" /><div className="rest">{items.slice(1).map(p => <Card key={p.name} p={p} />)}</div></div></Shell>;
    case "checker": return <Shell head={head}><div className="pp-checker">{items.map((p, i) => <div key={p.name} className={i % 2 ? "inv" : ""}><h4>{p.name}</h4><Chips p={p} /></div>)}</div></Shell>;
    case "spec": return <Shell head={head}><div className="pp-spec"><div className="pp-specrow hd"><span>Product</span><span>Validation</span><span>Method</span></div>{items.map(p => <div key={p.name} className="pp-specrow"><span>{p.name}</span><span>{p.a}</span><span>{p.b || "—"}</span></div>)}</div></Shell>;
    case "minimal": return <Shell head={head}><div className="pp-pmin">{items.map(p => <div key={p.name}><b>{p.name}</b>{badged && p.b && <em>{p.b}</em>}</div>)}</div></Shell>;
    case "pills": return <Shell head={head}><div className="pp-pills2">{items.map(p => <span key={p.name}>{p.name}</span>)}</div></Shell>;
    case "panels": return <Shell head={head}><div className="pp-panels">{items.map((p, i) => <div key={p.name}><i>{String(i + 1).padStart(2, "0")}</i><h4>{p.name}</h4><Chips p={p} /></div>)}</div></Shell>;
    case "catalog": return <Shell head={head}><div className="pp-catalog">{items.map(p => <div key={p.name}><div className="pp-catswatch" /><h4>{p.name}</h4><Chips p={p} /></div>)}</div></Shell>;
    case "duo": return <Shell head={head}><div className="pp-ptgrid g2 duo">{items.map(p => <Card key={p.name} p={p} />)}</div></Shell>;
    case "tiers": return <Shell head={head}><div className="pp-tiers">{items.map((p, i) => <div key={p.name} style={{ marginLeft: Math.min(i, 5) * 14 }}><h4>{p.name}</h4><Chips p={p} /></div>)}</div></Shell>;
    case "mosaic": return <Shell head={head}><div className="pp-mosaic">{items.map((p, i) => <div key={p.name} className={i % 5 === 0 ? "big" : ""}><h4>{p.name}</h4><Chips p={p} /></div>)}</div></Shell>;
    default: return <Shell head={head}><div className="pp-ptgrid g3">{items.map(p => <Card key={p.name} p={p} />)}</div></Shell>;
  }
}

/* ============================ FAQ ============================ */
export function Faq({ geo, v, partner, head }) {
  const t = s => M(s, partner);
  const items = (v.items || (v.groups || []).flatMap(g => g.items) || []).slice(0, 6);
  if (!items.length) return <Shell head={head} />;
  const mk = geo.m;
  const Q = ({ i }) => mk === "qletter" ? <span className="pp-q">Q</span> : mk === "number" ? <span className="pp-q n">{i + 1}</span> : null;
  const Item = ({ it, i }) => <div className="pp-fq"><Q i={i} /><div><b>{it.q}</b><p>{t(it.a)}</p></div></div>;
  const g = geo.g;

  switch (g) {
    case "twocol": return <Shell head={head}><div className="pp-faq2">{items.map((it, i) => <Item key={i} it={it} i={i} />)}</div></Shell>;
    case "cards": return <Shell head={head}><div className="pp-ptgrid g2">{items.map((it, i) => <div key={i} className="pp-card"><Q i={i} /><h4>{it.q}</h4><p>{t(it.a)}</p></div>)}</div></Shell>;
    case "boxed": return <Shell head={head}><div className="pp-boxfaq">{items.map((it, i) => <Item key={i} it={it} i={i} />)}</div></Shell>;
    case "numbered": return <Shell head={head}><div className="pp-faqnum">{items.map((it, i) => <div key={i}><i>{String(i + 1).padStart(2, "0")}</i><div><b>{it.q}</b><p>{t(it.a)}</p></div></div>)}</div></Shell>;
    case "splitaside": return <Shell head={head} aside><div className="pp-faqr">{items.map((it, i) => <Item key={i} it={it} i={i} />)}</div></Shell>;
    case "wide": return <Shell head={head}><div className="pp-faqwide">{items.map((it, i) => <div key={i}><b>{it.q}</b><p>{t(it.a)}</p></div>)}</div></Shell>;
    case "compact": return <Shell head={head}><div className="pp-faqcompact">{items.map((it, i) => <div key={i}><b>{it.q}</b><span>{t(it.a)}</span></div>)}</div></Shell>;
    case "zebra": return <Shell head={head}><div className="pp-faqzebra">{items.map((it, i) => <Item key={i} it={it} i={i} />)}</div></Shell>;
    case "drawer": return <Shell head={head}><div className="pp-faqdrawer">{items.map((it, i) => <details key={i} open={i === 0}><summary><Q i={i} />{it.q}</summary><p>{t(it.a)}</p></details>)}</div></Shell>;
    case "inline": return <Shell head={head}><div className="pp-faqinline">{items.map((it, i) => <p key={i}><b>{it.q}</b> {t(it.a)}</p>)}</div></Shell>;
    case "grid4": return <Shell head={head}><div className="pp-ptgrid g2">{items.slice(0, 4).map((it, i) => <div key={i} className="pp-card"><Q i={i} /><h4>{it.q}</h4><p>{t(it.a)}</p></div>)}</div></Shell>;
    case "bubble": return <Shell head={head}><div className="pp-bubbles">{items.map((it, i) => <div key={i}><span className="ask">{it.q}</span><span className="ans">{t(it.a)}</span></div>)}</div></Shell>;
    case "index": return <Shell head={head}><div className="pp-faqindex"><div className="ix">{items.map((it, i) => <span key={i}>{String(i + 1).padStart(2, "0")} {it.q}</span>)}</div><div className="bd">{items.map((it, i) => <div key={i}><b>{String(i + 1).padStart(2, "0")}</b><div><b>{it.q}</b><p>{t(it.a)}</p></div></div>)}</div></div></Shell>;
    default: return <Shell head={head}><div className="pp-faqr">{items.map((it, i) => <Item key={i} it={it} i={i} />)}</div></Shell>;
  }
}

/* ============================ FORM ============================ */
export function Form({ geo, v, partner, head }) {
  const fields = v.fields || [];
  const Fld = ({ f, full, line }) => <div className={"pp-fld" + (full ? " full" : "") + (line ? " line" : "")}><label>{f.label}{f.required ? " *" : ""}</label><div className="pp-input" /></div>;
  const sub = <span className="pp-submit">{v.submit || "Send"}</span>;
  const g = geo.g;
  const isFull = f => f.type === "textarea" || ["domains", "server", "esp", "setup"].indexOf(f.id) > -1;

  switch (g) {
    case "stacked": return <Shell head={head} form><div className="pp-formstack">{fields.map((f, i) => <Fld key={i} f={f} full />)}{sub}</div></Shell>;
    case "centred": return <Shell head={head} form centre><div className="pp-formcard"><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={isFull(f)} />)}{sub}</div></div></Shell>;
    case "aside": return <section className="pp-sec form"><div className="pp-formaside"><div className="pp-head">{head}</div><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={isFull(f)} />)}{sub}</div></div></section>;
    case "darkpanel": return <section className="pp-sec"><div className="pp-formdark"><div className="pp-head inv">{head}</div><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={isFull(f)} />)}{sub}</div></div></section>;
    case "splitband": return <section className="pp-sec form nopad"><div className="pp-formsplit"><div className="pp-fsleft">{head}</div><div className="pp-fsright"><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={isFull(f)} />)}{sub}</div></div></div></section>;
    case "floating": return <Shell head={head} form><div className="pp-formfloat"><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={isFull(f)} />)}{sub}</div></div></Shell>;
    case "lines": return <Shell head={head} form><div className="pp-formstack lines">{fields.map((f, i) => <Fld key={i} f={f} full line />)}{sub}</div></Shell>;
    case "widecta": return <Shell head={head} form><div className="pp-form wide">{fields.slice(0, 4).map((f, i) => <Fld key={i} f={f} />)}<span className="pp-submit big">{v.submit || "Send"}</span></div><p className="pp-foot-note">Full details collected after the first reply.</p></Shell>;
    case "twostep": return <Shell head={head} form><div className="pp-form2step"><div className="s"><span className="pp-glabel">1 · About you</span><div className="pp-form">{fields.slice(0, 4).map((f, i) => <Fld key={i} f={f} />)}</div></div><div className="s"><span className="pp-glabel">2 · What you need</span><div className="pp-form">{fields.slice(4).map((f, i) => <Fld key={i} f={f} full={isFull(f)} />)}{sub}</div></div></div></Shell>;
    case "boxed": return <Shell head={head} form><div className="pp-formboxed"><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={isFull(f)} />)}{sub}</div></div></Shell>;
    case "sidebar": return <section className="pp-sec form"><div className="pp-formsidebar"><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={isFull(f)} />)}{sub}</div><div className="pp-fsnote"><div className="pp-head">{head}</div></div></div></section>;
    default: return <Shell head={head} form><div className="pp-form">{fields.map((f, i) => <Fld key={i} f={f} full={isFull(f)} />)}{sub}</div></Shell>;
  }
}

/* ============================ CONTACT ============================ */
export function Contact({ geo, v, partner, head }) {
  const t = s => M(s, partner);
  const items = [["Call", partner.phone], ["Email", partner.email], partner.whatsapp ? ["WhatsApp", partner.whatsapp] : null].filter(Boolean);
  const g = geo.g;
  switch (g) {
    case "cards": return <Shell head={head}><div className="pp-ptgrid g3">{items.map(([k, vv]) => <div key={k} className="pp-card"><h4>{k}</h4><p>{vv || "\u27E8" + k.toLowerCase() + "\u27E9"}</p></div>)}</div></Shell>;
    case "banddark": return <section className="pp-sec nopad"><div className="pp-ctadark"><div>{head}</div><div className="pp-ctaline">{items.map(([k, vv]) => <span key={k}><em>{k}</em>{vv}</span>)}</div></div></section>;
    case "split": return <Shell head={head} aside><div className="pp-ctalist">{items.map(([k, vv]) => <div key={k}><em>{k}</em><b>{vv}</b></div>)}</div></Shell>;
    case "centredbig": return <Shell head={head} centre><div className="pp-ctabig">{items.map(([k, vv]) => <b key={k}>{vv}</b>)}</div></Shell>;
    case "framed": return <Shell head={head}><div className="pp-framed pad"><div className="pp-ctaline dark">{items.map(([k, vv]) => <span key={k}><em>{k}</em>{vv}</span>)}</div></div></Shell>;
    case "ribbon": return <section className="pp-sec nopad"><div className="pp-ctaribbon">{items.map(([k, vv]) => <span key={k}><em>{k}</em> {vv}</span>)}</div></section>;
    case "minimal": return <Shell head={head}><p className="pp-foot-note">{t(v.lede)}</p></Shell>;
    case "mega": return <section className="pp-sec nopad"><div className="pp-ctamega"><h2>{v.headline || "Prefer to talk?"}</h2><div className="pp-ctaline">{items.map(([k, vv]) => <span key={k}><em>{k}</em>{vv}</span>)}</div></div></section>;
    case "corner": return <Shell head={head}><div className="pp-ctacorner"><div className="pp-ctalist">{items.map(([k, vv]) => <div key={k}><em>{k}</em><b>{vv}</b></div>)}</div></div></Shell>;
    case "gradient": return <section className="pp-sec nopad"><div className="pp-ctagrad"><div>{head}</div><div className="pp-ctaline">{items.map(([k, vv]) => <span key={k}><em>{k}</em>{vv}</span>)}</div></div></section>;
    case "outline": return <Shell head={head}><div className="pp-ctaoutline">{items.map(([k, vv]) => <span key={k}><em>{k}</em>{vv}</span>)}</div></Shell>;
    default: return <Shell head={head}><div className="pp-ctaline dark2">{items.map(([k, vv]) => <span key={k}><em>{k}</em>{vv}</span>)}</div></Shell>;
  }
}

/* ============================ shells ============================ */
function Shell({ head, children, aside, form, centre }) {
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

export function renderSection({ id, geo, v, partner, pack, head }) {
  const fam = FAMILY[id] || "points";
  const props = { geo, v, partner, head, sectionId: id, pack };
  if (fam === "hero") return <Hero {...props} />;
  if (fam === "points") return <Points {...props} />;
  if (fam === "table") return <TableSec {...props} />;
  if (fam === "steps") return <Steps {...props} />;
  if (fam === "products") return <Products {...props} />;
  if (fam === "faq") return <Faq {...props} />;
  if (fam === "form") return <Form {...props} />;
  return <Contact {...props} />;
}
