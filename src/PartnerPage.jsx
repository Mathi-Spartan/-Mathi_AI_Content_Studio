import React from "react";
import facts from "../content/facts.json";
import { dnaToCss, pick, PALETTES, SKELETONS } from "./dna.js";

const M = (s, p) => typeof s === "string"
  ? s.replace(/\{\{\s*partner\.([a-z_]+)\s*\}\}/gi, (m, k) => (p[k] || "").trim() || `⟨${k}⟩`)
  : s;

export default function PartnerPage({ pack, partner, dna, skeletonId, choice, motionOn }) {
  const sk = SKELETONS.find(s => s.id === skeletonId) || SKELETONS[0];
  const css = dnaToCss(dna);
  const pal = pick(PALETTES, dna.pal);
  const secOf = (id) => pack.content.find(s => s.id === id);
  const varOf = (s) => s.variants.find(v => v.id === choice[`${pack.id}:${s.id}`]) || s.variants[0];
  const anim = motionOn && dna.motion !== "none" ? ` pp-${dna.motion}` : "";

  const brand = (partner.name || "Partner").toUpperCase();

  return (
    <div className="pp" style={css}>
      <div className="pp-top">
        <span>{M(partner.ca_status || "Certified Partner", partner)}</span>
        <span className="pp-topr">{partner.phone || "⟨phone⟩"}</span>
      </div>

      <div className="pp-nav">
        <span className="pp-logo">{brand}</span>
        <nav>
          {sk.order.filter(id => !["hero", "enquiry", "contact"].includes(id)).slice(0, 4).map(id => {
            const s = secOf(id);
            return s ? <a key={id}>{s.label}</a> : null;
          })}
        </nav>
        <span className="pp-cta">Get a quote</span>
      </div>

      {sk.order.map((id, i) => {
        const s = secOf(id);
        if (!s) return null;
        const v = varOf(s);
        return <Section key={id} id={id} s={s} v={v} partner={partner} pal={pal} anim={anim} i={i} pack={pack} />;
      })}

      <div className="pp-foot">
        <b>{brand}</b>
        <span>{partner.email || "⟨email⟩"} · {partner.phone || "⟨phone⟩"}</span>
        <span>{[partner.city, partner.country].filter(Boolean).join(", ") || "⟨city⟩, ⟨country⟩"}</span>
      </div>
    </div>
  );
}

function Section({ id, s, v, partner, pal, anim, i, pack }) {
  const t = (x) => M(x, partner);
  const alt = i % 2 === 1;

  if (id === "hero") {
    return (
      <section className={"pp-hero" + anim}>
        <div className="pp-hgrid">
          <div>
            {v.eyebrow && <span className="pp-badge">{t(v.eyebrow)}</span>}
            <h1>{t(v.headline)}</h1>
            <p>{t(v.lede)}</p>
            <div className="pp-btns">
              <span className="pp-b1">{v.cta_primary}</span>
              <span className="pp-b2">{v.cta_secondary}</span>
            </div>
          </div>
          {pack.id === "vmc-cmc-dmarc" ? <InboxCard partner={partner} /> : <OrderCard />}
        </div>
      </section>
    );
  }

  if (id === "the-change") {
    return (
      <section className={"pp-sec" + (alt ? " alt" : "") + anim}>
        <Head v={v} t={t} />
        <div className="pp-table">
          <div className="pp-tr pp-th"><span>In effect from</span><span>Max validity</span><span>DCV reuse</span></div>
          {facts.validity_schedule.phases.map(p => (
            <div key={p.from} className={"pp-tr" + (p.max_validity_days === 47 ? " hot" : "")}>
              <span>{new Date(p.from).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span><b>{p.max_validity_days}</b> days</span>
              <span>{p.dcv_reuse_days} days</span>
            </div>
          ))}
        </div>
        {v.footnote && <p className="pp-foot-note">{t(v.footnote)}</p>}
      </section>
    );
  }

  if (id === "automation" || id === "plans") {
    const items = facts.automation_products.items;
    return (
      <section className={"pp-sec" + (alt ? " alt" : "") + anim}>
        <Head v={v} t={t} />
        {v.routes && <div className="pp-grid two">{v.routes.map((r, k) =>
          <div key={k} className="pp-card">
            {r.label && <span className="pp-tag">{r.label}</span>}
            <h4>{t(r.title)}</h4><p>{t(r.body || r.for)}</p>
          </div>)}</div>}
        <div className="pp-grid three" style={{ marginTop: 18 }}>
          {items.map(p => (
            <div key={p.id} className="pp-card">
              <h4>{p.name}</h4>
              <div className="pp-tags">
                <span className="pp-chip dv">{p.validation}</span>
                <span className="pp-chip au">{p.methods.length > 1 ? "Agent + ACME" : "ACME only"}</span>
              </div>
              {p.dcv_note && <p className="pp-note">{p.dcv_note}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (id === "certificates") {
    return (
      <section className={"pp-sec" + (alt ? " alt" : "") + anim}>
        <Head v={v} t={t} />
        <div className="pp-grid three">
          {facts.digicert_catalogue.items.map(c => (
            <div key={c.name} className="pp-card">
              <h4>{c.name}</h4>
              <div className="pp-tags"><span className="pp-chip dv">{c.validation}</span>
                {c.coverage && <span className="pp-chip au">{c.coverage}</span>}</div>
              <p className="pp-note">Warranty confirmed on your quote.</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (id === "vmc-vs-cmc") {
    return (
      <section className={"pp-sec" + (alt ? " alt" : "") + anim}>
        <Head v={v} t={t} />
        <div className="pp-table">
          <div className="pp-tr pp-th"><span /><span>VMC</span><span>CMC</span></div>
          {v.rows.map((r, k) => (
            <div key={k} className="pp-tr"><span><b>{r.label}</b></span><span>{r.vmc}</span><span>{r.cmc}</span></div>
          ))}
        </div>
      </section>
    );
  }

  if (id === "dmarc-ladder") {
    return (
      <section className={"pp-sec" + (alt ? " alt" : "") + anim}>
        <Head v={v} t={t} />
        <div className="pp-grid three">
          {v.stage_detail.map(st => (
            <div key={st.p} className="pp-card">
              <span className="pp-tag">p={st.p}</span><h4>{st.title}</h4><p>{st.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (v.steps) {
    return (
      <section className={"pp-sec" + (alt ? " alt" : "") + anim}>
        <Head v={v} t={t} />
        <ol className="pp-steps">
          {v.steps.map((st, k) => <li key={k}><i>{st.n || k + 1}</i><div><b>{t(st.title)}</b><p>{t(st.body)}</p></div></li>)}
        </ol>
        {v.closer && <p className="pp-foot-note">{t(v.closer)}</p>}
      </section>
    );
  }

  if (v.points || (v.rows && v.rows[0]?.title)) {
    const rows = v.points || v.rows;
    return (
      <section className={"pp-sec" + (alt ? " alt" : "") + anim}>
        <Head v={v} t={t} />
        <div className="pp-grid two">
          {rows.map((r, k) => <div key={k} className="pp-card"><h4>{t(r.title)}</h4><p>{t(r.body)}</p></div>)}
        </div>
      </section>
    );
  }

  if (v.items || v.groups) {
    const items = v.items || v.groups.flatMap(g => g.items);
    return (
      <section className={"pp-sec" + (alt ? " alt" : "") + anim}>
        <Head v={v} t={t} />
        <div className="pp-faq">
          {items.slice(0, 6).map((it, k) => <div key={k}><b>{it.q}</b><p>{t(it.a)}</p></div>)}
        </div>
      </section>
    );
  }

  if (v.fields) {
    return (
      <section className={"pp-sec form" + anim}>
        <Head v={v} t={t} />
        <div className="pp-form">
          {v.fields.map((f, k) => (
            <div key={k} className={"pp-fld" + (f.type === "textarea" || f.id === "domains" || f.id === "server" ? " full" : "")}>
              <label>{f.label}{f.required ? " *" : ""}</label><div className="pp-input" />
            </div>
          ))}
          <span className="pp-submit">{v.submit || "Send"}</span>
        </div>
      </section>
    );
  }

  return (
    <section className={"pp-sec" + (alt ? " alt" : "") + anim}>
      <Head v={v} t={t} />
    </section>
  );
}

const Head = ({ v, t }) => (
  <div className="pp-head">
    {v.eyebrow && <span className="pp-eb">{t(v.eyebrow)}</span>}
    {v.headline && <h2>{t(v.headline)}</h2>}
    {v.lede && <p>{t(v.lede)}</p>}
  </div>
);

function OrderCard() {
  const eras = facts.validity_schedule.phases;
  return (
    <div className="pp-panel">
      <span className="pp-plabel">Same order · shorter certificates</span>
      {eras.map(e => {
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

function InboxCard({ partner }) {
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
      <div className="pp-ibody" />
      <div className="pp-ibody short" />
      <span className="pp-itip">Verified sender · logo from a mark certificate</span>
    </div>
  );
}
