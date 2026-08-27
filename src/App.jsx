import React, { useState, useMemo, useEffect } from "react";
import facts from "../content/facts.json";
import sslFull from "../content/packs/ssl-full.json";
import automationLp from "../content/packs/automation-lp.json";
import vmcCmc from "../content/packs/vmc-cmc-dmarc.json";

const PACKS = [sslFull, automationLp, vmcCmc];

const BLANK_PARTNER = {
  name: "", legal_name: "", country: "", city: "",
  phone: "", email: "", whatsapp: "", site_url: "",
  ca_status: "", warranty_table: ""
};

/* ---------- token merge ---------- */
function merge(str, partner) {
  if (typeof str !== "string") return str;
  return str.replace(/\{\{\s*partner\.([a-z_]+)\s*\}\}/gi, (m, k) => {
    const v = (partner[k] || "").trim();
    return v || `⟨${k}⟩`;
  });
}
function unresolved(str, partner) {
  if (typeof str !== "string") return [];
  const out = [];
  str.replace(/\{\{\s*partner\.([a-z_]+)\s*\}\}/gi, (m, k) => {
    if (!(partner[k] || "").trim()) out.push(k);
    return m;
  });
  return out;
}

/* ---------- walk a variant collecting renderable text ---------- */
function collect(node, acc = []) {
  if (node == null) return acc;
  if (typeof node === "string") { acc.push(node); return acc; }
  if (Array.isArray(node)) { node.forEach(n => collect(n, acc)); return acc; }
  if (typeof node === "object") {
    Object.entries(node).forEach(([k, v]) => {
      if (k.startsWith("_") || k === "id" || k === "tone" || k === "gate") return;
      collect(v, acc);
    });
  }
  return acc;
}

export default function App() {
  const [packId, setPackId] = useState(PACKS[0].id);
  const [partner, setPartner] = useState(BLANK_PARTNER);
  const [choice, setChoice] = useState({});      // sectionId -> variantId
  const [open, setOpen] = useState(null);        // sectionId expanded
  const [tab, setTab] = useState("library");
  const [saved, setSaved] = useState([]);
  const [status, setStatus] = useState(null);

  const pack = PACKS.find(p => p.id === packId);

  useEffect(() => { setOpen(null); }, [packId]);

  const chosenFor = (s) => choice[`${pack.id}:${s.id}`] || s.variants[0].id;
  const variantOf = (s) => s.variants.find(v => v.id === chosenFor(s)) || s.variants[0];

  const gaps = useMemo(() => {
    const g = new Set();
    pack.content.forEach(s => collect(variantOf(s)).forEach(t =>
      unresolved(t, partner).forEach(k => g.add(k))));
    return [...g];
  }, [pack, partner, choice]);

  const exportJson = () => {
    const out = {
      pack: pack.id,
      generated: new Date().toISOString(),
      partner,
      sections: pack.content.map(s => {
        const v = variantOf(s);
        return { id: s.id, label: s.label, variant: v.id, tone: v.tone, content: deepMerge(v, partner) };
      }),
      unresolved_tokens: gaps
    };
    download(`${pack.id}-${(partner.name || "partner").toLowerCase().replace(/\W+/g, "-")}.json`,
      JSON.stringify(out, null, 2), "application/json");
  };

  const exportMd = () => {
    let md = `# ${pack.name}\n\n**Partner:** ${partner.name || "⟨name⟩"}  \n**Generated:** ${new Date().toISOString().slice(0, 10)}\n\n`;
    pack.content.forEach(s => {
      const v = variantOf(s);
      md += `\n---\n\n## ${s.label}\n\n*Variant: ${v.tone}*\n\n`;
      if (v.eyebrow) md += `**${merge(v.eyebrow, partner)}**\n\n`;
      if (v.headline) md += `### ${merge(v.headline, partner)}\n\n`;
      if (v.lede) md += `${merge(v.lede, partner)}\n\n`;
      (v.points || v.rows || v.steps || []).forEach(p => {
        if (p.title) md += `- **${merge(p.title, partner)}** — ${merge(p.body || "", partner)}\n`;
      });
      (v.items || []).forEach(i => { if (i.q) md += `\n**${i.q}**  \n${merge(i.a, partner)}\n`; });
      (v.groups || []).forEach(g => {
        md += `\n#### ${g.group}\n`;
        g.items.forEach(i => { md += `\n**${i.q}**  \n${merge(i.a, partner)}\n`; });
      });
    });
    if (gaps.length) md += `\n---\n\n> **Unresolved:** ${gaps.join(", ")}\n`;
    download(`${pack.id}-${(partner.name || "partner").toLowerCase().replace(/\W+/g, "-")}.md`, md, "text/markdown");
  };

  const savePartner = async () => {
    if (!partner.name.trim()) { setStatus({ t: "err", m: "Partner needs a name before saving." }); return; }
    setStatus({ t: "wait", m: "Saving…" });
    try {
      const r = await fetch("/api/partners", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner, pack: pack.id, choices: choice })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Save failed");
      setStatus({ t: "ok", m: `Saved ${partner.name}.` });
      loadPartners();
    } catch (e) { setStatus({ t: "err", m: e.message }); }
  };

  const loadPartners = async () => {
    try {
      const r = await fetch("/api/partners");
      const j = await r.json();
      if (r.ok) setSaved(j.partners || []);
    } catch { /* offline is fine — the library still works */ }
  };
  useEffect(() => { loadPartners(); }, []);

  return (
    <div className="app">
      <header className="top">
        <div className="mark"><b>CONTENT STUDIO</b><span>ssl · automation · vmc</span></div>
        <div className="seg">
          {["library", "partner", "export"].map(t => (
            <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
              {t === "library" ? "Library" : t === "partner" ? "Partner" : "Export"}
            </button>
          ))}
        </div>
        <div className="right">
          {gaps.length > 0
            ? <span className="pill warn">{gaps.length} unresolved</span>
            : <span className="pill ok">all tokens resolved</span>}
          <span className="pill muted">verified {facts._meta.last_verified}</span>
        </div>
      </header>

      <div className="body">
        <nav className="rail">
          {PACKS.map(p => (
            <button key={p.id} aria-pressed={p.id === packId} onClick={() => setPackId(p.id)}>
              <b>{p.name}</b>
              <u>{p.content.length} sections</u>
            </button>
          ))}
          <div className="railfoot">
            <p className="lb">Canonical facts</p>
            <p className="tiny">Every number on every page traces to <code>facts.json</code>. Change it once, it changes everywhere.</p>
            <p className="tiny warn">Warranty figures and the PositiveSSL CaaS product ID are deliberately blank — supply them, never guess.</p>
          </div>
        </nav>

        <main className="pane">
          {tab === "library" && (
            <>
              <div className="phead">
                <h1>{pack.name}</h1>
                <p className="sub">{pack.summary}</p>
                <div className="meta">
                  <div><span className="lb">Audience</span><p>{pack.audience}</p></div>
                  <div><span className="lb">The page's job</span><p>{pack.job}</p></div>
                </div>
                {pack.constraints && (
                  <div className="constraints">
                    <span className="lb">Hard constraints</span>
                    <ul>{pack.constraints.map((c, i) => <li key={i}>{c}</li>)}</ul>
                  </div>
                )}
                {pack.strategy_note && (
                  <div className="constraints note">
                    <span className="lb">Strategy</span><p>{pack.strategy_note}</p>
                  </div>
                )}
              </div>

              <div className="sections">
                {pack.content.map(s => {
                  const v = variantOf(s);
                  const isOpen = open === s.id;
                  return (
                    <section key={s.id} className={"sec" + (isOpen ? " open" : "")}>
                      <button className="sechd" onClick={() => setOpen(isOpen ? null : s.id)}>
                        <span className="secname">{s.label}</span>
                        {s.required && <span className="req">required</span>}
                        <span className="vcount">{s.variants.length} variant{s.variants.length > 1 ? "s" : ""}</span>
                        <span className="chev">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen && (
                        <div className="secbody">
                          {s.purpose && <p className="purpose"><span className="lb">Why this section exists</span>{s.purpose}</p>}
                          {s.variants.length > 1 && (
                            <div className="vtabs">
                              {s.variants.map(vv => (
                                <button key={vv.id} aria-pressed={vv.id === v.id}
                                  onClick={() => setChoice({ ...choice, [`${pack.id}:${s.id}`]: vv.id })}>
                                  {vv.tone}
                                </button>
                              ))}
                            </div>
                          )}
                          <Preview v={v} partner={partner} />
                          {s.widget_note && (
                            <p className="widget"><span className="lb">Signature widget — {s.signature_widget}</span>{s.widget_note}</p>
                          )}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            </>
          )}

          {tab === "partner" && (
            <div className="form">
              <h1>Partner details</h1>
              <p className="sub">These fill the merge tokens throughout the library. Anything left blank shows as ⟨token⟩ in the preview and is flagged before export.</p>
              <div className="grid">
                {Object.keys(BLANK_PARTNER).map(k => (
                  <label key={k} className={gaps.includes(k) ? "fld gap" : "fld"}>
                    <span>{k.replace(/_/g, " ")}</span>
                    <input value={partner[k]} onChange={e => setPartner({ ...partner, [k]: e.target.value })}
                      placeholder={PLACEHOLDER[k] || ""} />
                  </label>
                ))}
              </div>
              <div className="frow">
                <button className="btn seal" onClick={savePartner}>Save partner</button>
                <button className="btn" onClick={() => setPartner(BLANK_PARTNER)}>Clear</button>
                {status && <span className={"stat " + status.t}>{status.m}</span>}
              </div>
              {saved.length > 0 && (
                <div className="savedlist">
                  <span className="lb">Saved partners</span>
                  <div className="chips">
                    {saved.map(p => (
                      <button key={p.id} className="chip" onClick={() => { setPartner({ ...BLANK_PARTNER, ...p.data }); setStatus({ t: "ok", m: `Loaded ${p.name}.` }); }}>
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "export" && (
            <div className="form">
              <h1>Export</h1>
              <p className="sub">The merged copy for <b>{partner.name || "⟨no partner set⟩"}</b>, ready to drop into a page build.</p>
              {gaps.length > 0 ? (
                <div className="preflight bad">
                  <span className="lb">Pre-flight — {gaps.length} unresolved</span>
                  <ul>{gaps.map(g => <li key={g}>{g.replace(/_/g, " ")} is empty — it will render as ⟨{g}⟩</li>)}</ul>
                  <p className="tiny">Export is allowed. The gaps are listed in the file so nothing ships silently wrong.</p>
                </div>
              ) : (
                <div className="preflight good"><span className="lb">Pre-flight — clear</span>
                  <p>Every token resolves. No placeholder will reach the page.</p></div>
              )}
              <div className="frow">
                <button className="btn seal" onClick={exportMd}>Download Markdown</button>
                <button className="btn" onClick={exportJson}>Download JSON</button>
              </div>
              <p className="tiny" style={{ marginTop: 18 }}>
                Markdown is for review and for handing to a partner. JSON is what the page builder consumes — section id, chosen variant, and fully merged content.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const PLACEHOLDER = {
  name: "Ace Micro", legal_name: "Ace Micro (Pvt.) Ltd.", country: "Pakistan", city: "Islamabad",
  phone: "051-6108450", email: "info@acemicro.com.pk", whatsapp: "leave blank if none",
  site_url: "https://www.acemicro.com.pk", ca_status: "DigiCert Certified Partner",
  warranty_table: "leave blank unless supplied from the portal"
};

function deepMerge(node, partner) {
  if (typeof node === "string") return merge(node, partner);
  if (Array.isArray(node)) return node.map(n => deepMerge(n, partner));
  if (node && typeof node === "object") {
    const o = {};
    Object.entries(node).forEach(([k, v]) => { o[k] = deepMerge(v, partner); });
    return o;
  }
  return node;
}

function Preview({ v, partner }) {
  const M = (s) => merge(s, partner);
  return (
    <div className="prev">
      {v.eyebrow && <p className="pv-eb">{M(v.eyebrow)}</p>}
      {v.headline && <h2 className="pv-h">{M(v.headline)}</h2>}
      {v.lede && <p className="pv-l">{M(v.lede)}</p>}

      {v.points && <div className="pv-grid">{v.points.map((p, i) =>
        <div key={i} className="pv-card"><h4>{M(p.title)}</h4><p>{M(p.body)}</p></div>)}</div>}

      {v.steps && <ol className="pv-steps">{v.steps.map((s, i) =>
        <li key={i}><b>{M(s.title)}</b><span>{M(s.body)}</span></li>)}</ol>}

      {v.rows && Array.isArray(v.rows) && v.rows[0]?.title && <div className="pv-grid">{v.rows.map((r, i) =>
        <div key={i} className="pv-card"><h4>{M(r.title)}</h4><p>{M(r.body)}</p></div>)}</div>}

      {v.routes && <div className="pv-grid">{v.routes.map((r, i) =>
        <div key={i} className="pv-card">
          {r.label && <span className="pv-tag">{r.label}</span>}
          <h4>{M(r.title)}</h4>
          <p>{M(r.body || r.for || "")}</p>
          {r.steps && <ul>{r.steps.map((s, j) => <li key={j}>{M(s)}</li>)}</ul>}
          {r.note && <p className="pv-note">{M(r.note)}</p>}
        </div>)}</div>}

      {v.items && <div className="pv-faq">{v.items.map((it, i) =>
        <div key={i}><b>{M(it.q)}</b><p>{M(it.a)}</p></div>)}</div>}

      {v.groups && v.groups.map((g, i) =>
        <div key={i} className="pv-faq">
          <p className="lb" style={{ marginTop: 14 }}>{g.group}</p>
          {g.items.map((it, j) => <div key={j}><b>{M(it.q)}</b><p>{M(it.a)}</p></div>)}
        </div>)}

      {v.fields && <div className="pv-fields">
        {v.fields.map((f, i) => <span key={i} className="pv-fld">{f.label}{f.required ? " *" : ""}</span>)}
      </div>}

      {v.closer && <p className="pv-closer">{M(v.closer)}</p>}
      {v.recommendation && <p className="pv-closer">{M(v.recommendation)}</p>}
      {v.footnote && <p className="pv-foot">{M(v.footnote)}</p>}
      {v.honesty_note && <p className="pv-warn"><b>Editorial note — not for the page:</b> {v.honesty_note}</p>}
      {v.accuracy_warning && <p className="pv-warn"><b>Accuracy:</b> {v.accuracy_warning}</p>}
      {v.claim_rule && <p className="pv-warn"><b>Claim handling:</b> {v.claim_rule}</p>}
      {v.delivery_warning && <p className="pv-warn"><b>Delivery:</b> {v.delivery_warning}</p>}
      {v.gate && <p className="pv-warn"><b>Gated variant:</b> only render when <code>{v.gate}</code></p>}
      {v.capability_rule && <p className="pv-warn"><b>Build rule:</b> {v.capability_rule}</p>}
      {v.card_rules && <p className="pv-warn"><b>Build rules:</b> {v.card_rules.join(" ")}</p>}
    </div>
  );
}

function download(name, text, type) {
  const b = new Blob([text], { type });
  const u = URL.createObjectURL(b);
  const a = document.createElement("a");
  a.href = u; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
