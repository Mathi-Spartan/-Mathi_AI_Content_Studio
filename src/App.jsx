import React, { useState, useMemo, useEffect } from "react";
import sslFull from "../content/packs/ssl-full.json";
import automationLp from "../content/packs/automation-lp.json";
import vmcCmc from "../content/packs/vmc-cmc-dmarc.json";
import PartnerPage from "./PartnerPage.jsx";
import { BLOCKS, FAMILY } from "./blocks.jsx";
import { TYPES, SURFACES, DENSITY, CORNERS, MOTION, RHYTHM, NAV, ACCENT_SHAPE, SKELETONS, pick } from "./dna.js";
import { HARMONIES, TONES, buildPalette, signature, shortId } from "./compose.js";
import { generate, generateUnique, spaceSize, minDistance } from "./engine.js";

const PACKS = { "ssl-full": sslFull, "automation-lp": automationLp, "vmc-cmc-dmarc": vmcCmc };
const JOBS = [
  { pack: "ssl-full", title: "Full SSL site", blurb: "Certificate range, platforms, the 47-day narrative, automation, guides, enquiry." },
  { pack: "automation-lp", title: "Automation landing page", blurb: "One upsell page. Plan + Automate and ACME CaaS, the renewal-cost argument." },
  { pack: "vmc-cmc-dmarc", title: "VMC / CMC / DMARC", blurb: "BIMI readiness, mark certificates, the DMARC enforcement ladder, Valimail." }
];
const BLANK = { name: "", legal_name: "", country: "", city: "", phone: "", email: "", whatsapp: "", site_url: "", ca_status: "" };

const BLOCK_LABEL = {
  split: "Split", centre: "Centred", editorial: "Editorial", banded: "Banded", asym: "Asymmetric",
  minimal: "Minimal", datafirst: "Data first", stack: "Stacked", mirror: "Mirrored", ticker: "Ticker",
  cards3: "Three cards", cards2: "Two cards", ruled: "Ruled list", numbered: "Numbered", aside: "Side heading", tiles: "Tiles",
  grid: "Table", eras: "Era cards", timeline: "Timeline", bars: "Bars",
  rows: "Rows", railway: "Railway", cards: "Cards", checklist: "Checklist", ladder: "Ladder",
  grid3: "Grid of three", grid2: "Grid of two", grouped: "Grouped", band: "Band",
  twocol: "Two columns", boxed: "Boxed", stacked: "Stacked", centred: "Centred card", bar: "Bar"
};

export default function App() {
  const [screen, setScreen] = useState("start");
  const [partner, setPartner] = useState(BLANK);
  const [packId, setPackId] = useState("ssl-full");
  const [brandHex, setBrandHex] = useState("#123C6B");
  const [comp, setComp] = useState(null);
  const [nonce, setNonce] = useState(0);
  const [choice, setChoice] = useState({});
  const [device, setDevice] = useState("desktop");
  const [url, setUrl] = useState("");
  const [read, setRead] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [refine, setRefine] = useState(false);
  const [msg, setMsg] = useState(null);
  const [variants, setVariants] = useState([]);

  const pack = PACKS[packId];
  const space = useMemo(() => spaceSize(packId), [packId]);
  const gaps = useMemo(() => ["name", "country", "phone", "email"].filter(k => !(partner[k] || "").trim()), [partner]);
  const others = useMemo(() => ledger.filter(l => !comp || l.signature !== comp.signature).map(l => l.comp).filter(Boolean), [ledger, comp]);
  const distinct = useMemo(() => comp ? minDistance(comp, others) : 1, [comp, others]);

  useEffect(() => {
    fetch("/api/ledger").then(r => r.json()).then(j => setLedger(j.rows || [])).catch(() => {});
  }, []);

  const usedSigs = ledger.map(l => l.signature);

  const doGenerate = (opts = {}) => {
    const { comp: c, exhausted } = generateUnique(
      { packId, partner, brandHex, nonce: nonce + 1, keep: opts.keep || {} }, usedSigs);
    setNonce(n => n + 1);
    setComp(c);
    setScreen("studio");
    if (exhausted) setMsg({ t: "warn", m: "Could not find an unused composition in 60 tries — widen the pack or clear old entries." });
    else setMsg(null);
  };

  const rerollSection = (id) => {
    if (!comp) return;
    const fam = FAMILY[id] || "points";
    const opts = BLOCKS[fam] || ["default"];
    const cur = comp.blocks[id];
    const next = opts[(opts.indexOf(cur) + 1) % opts.length];
    const blocks = { ...comp.blocks, [id]: next };
    const c = { ...comp, blocks };
    c.signature = signature(c); c.id = shortId(c);
    setComp(c);
  };

  const setAxis = (k, v) => {
    if (!comp) return;
    const dna = { ...comp.dna, [k]: v };
    const palette = (k === "harmony" || k === "tone") ? buildPalette(brandHex, dna.harmony, dna.tone) : comp.palette;
    const c = { ...comp, dna, palette };
    c.signature = signature(c); c.id = shortId(c);
    setComp(c);
  };

  const makeVariants = () => {
    const out = [];
    let n = nonce;
    for (let i = 0; i < 6; i++) {
      n += 1;
      out.push(generate({ packId, partner, brandHex, nonce: n }));
    }
    setNonce(n);
    setVariants(out);
    setScreen("variants");
  };

  const readSite = async () => {
    const clean = url.trim().replace(/^https?:\/\//, "");
    if (!clean) return;
    setBusy(true); setErr(null); setRead(null);
    try {
      const r = await fetch("/api/read-site?url=" + encodeURIComponent("https://" + clean));
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Could not read that site");
      setRead(j);
      setPartner(p => ({ ...p, ...j.partner }));
      if (j.palette && j.palette.length) setBrandHex(j.palette[0]);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const commit = async () => {
    if (!comp || !partner.name.trim()) { setMsg({ t: "warn", m: "Partner needs a name before you can reserve a design." }); return; }
    try {
      const r = await fetch("/api/ledger", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner: partner.name, pack: packId, signature: comp.signature, design_id: comp.id, comp, partner_data: partner })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Could not reserve");
      const l = await (await fetch("/api/ledger")).json();
      setLedger(l.rows || []);
      setMsg({ t: "ok", m: j.duplicate ? "That exact design was already reserved." : `Reserved ${comp.id} for ${partner.name}. No other partner can get it.` });
    } catch (e) { setMsg({ t: "warn", m: e.message }); }
  };

  const download = () => {
    const node = document.querySelector(".plateScroll");
    const styles = [].slice.call(document.styleSheets).map(s => {
      try { return [].slice.call(s.cssRules).map(r => r.cssText).join("\n"); } catch (e) { return ""; }
    }).join("\n");
    const fl = document.querySelector('link[href*="fonts.googleapis"]');
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
      "<title>" + esc(partner.name || "Partner") + "</title>\n" +
      (fl ? '<link rel="stylesheet" href="' + fl.href + '">\n' : "") +
      "<style>\nbody{margin:0;background:#fff;}\n@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}\n" +
      styles + "\n</style></head>\n<body>" + (node ? node.innerHTML : "") + "</body></html>";
    const b = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = (partner.name || "partner").toLowerCase().replace(/\W+/g, "-") + "-" + (comp ? comp.id.replace(/:/g, "") : "page") + ".html";
    a.click();
  };

  return (
    <div className="app">
      <div className="top">
        <div className="mark"><b>PLATE</b><span>partner studio</span></div>
        <div className="seg">
          {[["start", "Start"], ["studio", "Studio"], ["variants", "Variants"], ["ledger", "Ledger"]].map(([s, l]) => (
            <button key={s} aria-pressed={screen === s} onClick={() => setScreen(s)} disabled={s !== "start" && !comp}>{l}</button>
          ))}
        </div>
        <div className="right">
          {comp && <div className="fp"><i className={distinct > .55 ? "" : "lowd"} /><span className="fplb">{partner.name || "unnamed"}</span><code>{comp.id}</code></div>}
          {comp && <button className="btn" onClick={commit}>Reserve</button>}
          {comp && <button className="btn seal" onClick={download}>Download</button>}
        </div>
      </div>

      {/* ================= START ================= */}
      {screen === "start" && (
        <div className="screen scroll">
          <div className="intake-wrap">
            <h1 className="ih">One partner. <em>One page nobody else can have.</em></h1>
            <p className="isub">Paste their site, pick what you are building, press Generate. PLATE composes a page from their own brand colour and checks it against every design you have already shipped, so no two partners get the same one.</p>

            <div className="urlbar">
              <span className="pre">https://</span>
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="www.acemicro.com.pk"
                spellCheck="false" onKeyDown={e => e.key === "Enter" && readSite()} />
              <button className="btn seal" onClick={readSite} disabled={busy}>{busy ? "Reading…" : "Read site"}</button>
            </div>
            {err && <p className="errline">{err} — fill the fields below by hand instead.</p>}

            <div className="startgrid">
              <div className="card">
                <div className="hd"><span className="lb">{read ? "Read from " + read.host : "Partner details"}</span>
                  {read && <span className="okms">{read.found} of {read.total} · {read.ms}ms</span>}</div>
                <div className="manual">
                  <div className="mgrid">
                    {Object.keys(BLANK).map(k => (
                      <label key={k} className={gaps.indexOf(k) > -1 ? "fld gap" : "fld"}>
                        <span>{k.replace(/_/g, " ")}</span>
                        <input value={partner[k]} onChange={e => setPartner({ ...partner, [k]: e.target.value })} />
                      </label>
                    ))}
                  </div>
                  <div className="brandrow">
                    <span className="lb">Brand colour — everything is generated from this</span>
                    <div className="brandpick">
                      <input type="color" value={brandHex} onChange={e => setBrandHex(e.target.value.toUpperCase())} />
                      <code>{brandHex}</code>
                      {read && read.palette && read.palette.map(c => (
                        <button key={c} className="swpick" style={{ background: c }} title={c} onClick={() => setBrandHex(c)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="lb" style={{ marginBottom: 10 }}>What are you building</p>
                <div className="jobs">
                  {JOBS.map(j => (
                    <div key={j.pack} className="job" data-sel={packId === j.pack ? "1" : "0"} onClick={() => setPackId(j.pack)}>
                      <h4>{j.title}</h4><p>{j.blurb}</p>
                    </div>
                  ))}
                </div>
                <div className="spacebox">
                  <span className="lb">Distinct pages available for this brief</span>
                  <b>{space.total.toLocaleString()}</b>
                  <p>{space.structural.toLocaleString()} structural layouts × {space.style.toLocaleString()} style combinations. {ledger.length} used so far.</p>
                </div>
                <button className="btn seal wide big" onClick={() => doGenerate()}>Generate a unique page</button>
                <button className="btn wide" onClick={makeVariants} disabled={!partner.name}>Show me six options</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STUDIO ================= */}
      {screen === "studio" && comp && (
        <div className="studio2">
          <div className="outline">
            <div className="olhd">
              <span className="lb">Page outline</span>
              <button className="mini" onClick={() => doGenerate()}>Regenerate all</button>
            </div>
            <p className="olnote">Each row is one section and the layout it drew. Click a row to swap that section's layout — the rest of the page stays put.</p>
            <div className="ollist">
              {comp.order.map((id, i) => {
                const s = pack.content.filter(x => x.id === id)[0];
                const fam = FAMILY[id] || "points";
                const opts = BLOCKS[fam] || [];
                return (
                  <button key={id} className="olrow" onClick={() => rerollSection(id)}>
                    <span className="oln">{String(i + 1).padStart(2, "0")}</span>
                    <span className="oltitle">{s ? s.label : id}</span>
                    <span className="olblock">{BLOCK_LABEL[comp.blocks[id]] || comp.blocks[id]}</span>
                    <span className="olcount">{opts.length}</span>
                  </button>
                );
              })}
            </div>
            <div className="distbox">
              <span className="lb">Distinctness vs everything you have shipped</span>
              <div className="distbar"><i style={{ width: Math.round(distinct * 100) + "%" }} className={distinct > .55 ? "" : "low"} /></div>
              <p>{distinct === 1 ? "Nothing to compare against yet." :
                distinct > .55 ? `${Math.round(distinct * 100)}% different from the closest page you have shipped.` :
                  `Only ${Math.round(distinct * 100)}% different from an existing page. Regenerate.`}</p>
            </div>
          </div>

          <div className="stage">
            <div className="stagebar">
              <div className="dev">{["desktop", "tablet", "phone"].map(d =>
                <button key={d} aria-pressed={device === d} onClick={() => setDevice(d)}>{d.toUpperCase()}</button>)}</div>
              <span className="monoval">{comp.skeletonName} · {comp.order.length} sections</span>
              <button className={"tglrefine" + (refine ? " on" : "")} onClick={() => setRefine(!refine)}>
                {refine ? "Hide fine controls" : "Fine controls"}
              </button>
              {msg && <span className={"msg " + msg.t}>{msg.m}</span>}
            </div>
            <div className="plateWrap">
              <div className={"plate " + device}>
                <div className="plateScroll">
                  <PartnerPage pack={pack} partner={partner} comp={comp} choice={choice} />
                </div>
              </div>
            </div>
          </div>

          {refine && (
            <div className="insp">
              <div className="inspbar"><span className="lb">Fine controls</span><span className="monoval seal">{comp.id}</span></div>
              <div className="inspbody">
                <Axis label="Colour harmony" items={HARMONIES} value={comp.dna.harmony} onChange={v => setAxis("harmony", v)} />
                <Axis label="Tone" items={TONES} value={comp.dna.tone} onChange={v => setAxis("tone", v)} />
                <div className="grp"><span className="lb">Generated palette</span>
                  <div className="palrow">
                    {["primary", "deep", "accent", "night", "wash", "line"].map(k => (
                      <span key={k} className="palsw" style={{ background: comp.palette[k] }} title={k + " " + comp.palette[k]} />
                    ))}
                  </div>
                  <p className="hint">Derived from {brandHex} — contrast-checked, so body text clears AA on every surface it lands on.</p>
                </div>
                <div className="grp"><span className="lb">Type pairing</span>
                  <div className="tp">
                    {TYPES.map(t => <button key={t.id} aria-pressed={comp.dna.type === t.id} onClick={() => setAxis("type", t.id)}>
                      <b style={{ fontFamily: t.display + ", sans-serif" }}>{t.name}</b><span>{t.tag}</span></button>)}
                  </div>
                </div>
                <Axis label="Section rhythm" items={RHYTHM} value={comp.dna.rhythm} onChange={v => setAxis("rhythm", v)} />
                <Axis label="Surface" items={SURFACES} value={comp.dna.surface} onChange={v => setAxis("surface", v)} />
                <Axis label="Header" items={NAV} value={comp.dna.nav} onChange={v => setAxis("nav", v)} />
                <Axis label="Accent shape" items={ACCENT_SHAPE} value={comp.dna.accentShape} onChange={v => setAxis("accentShape", v)} />
                <Axis label="Density" items={DENSITY} value={comp.dna.density} onChange={v => setAxis("density", v)} />
                <Axis label="Corners" items={CORNERS} value={comp.dna.corners} onChange={v => setAxis("corners", v)} />
                <Axis label="Motion" items={MOTION} value={comp.dna.motion} onChange={v => setAxis("motion", v)} />
                <div className="grp"><span className="lb">Copy tone</span>
                  {pack.content.filter(s => s.variants.length > 1).map(s => (
                    <div key={s.id} className="copyrow">
                      <span className="lb">{s.label}</span>
                      <div className="pills">{s.variants.map(v => (
                        <button key={v.id} aria-pressed={(choice[pack.id + ":" + s.id] || s.variants[0].id) === v.id}
                          onClick={() => setChoice({ ...choice, [pack.id + ":" + s.id]: v.id })}>{v.tone.split(" — ")[0]}</button>))}</div>
                    </div>))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= VARIANTS ================= */}
      {screen === "variants" && (
        <div className="screen scroll">
          <div className="gwrap">
            <div className="gbar">
              <div><h2>Six options</h2>
                <p className="sub">All six are generated from {brandHex} for {partner.name || "this partner"}. Every one is structurally different — different section order, different section layouts, different palette derivation. Pick one and refine it.</p></div>
              <button className="btn" onClick={makeVariants}>Six more</button>
            </div>
            <div className="vgrid">
              {variants.map(v => (
                <div key={v.id} className="vcard" onClick={() => { setComp(v); setScreen("studio"); }}>
                  <div className="vprev"><div className="vscale">
                    <PartnerPage pack={PACKS[v.pack]} partner={partner} comp={v} choice={choice} />
                  </div></div>
                  <div className="vmeta">
                    <b>{v.skeletonName}</b>
                    <code>{v.id}</code>
                    <div className="vtags">
                      <span>{(BLOCK_LABEL[v.blocks[v.order[0]]] || "").toUpperCase()} HERO</span>
                      <span>{pick(TYPES, v.dna.type).tag.toUpperCase()}</span>
                      <span>{v.dna.harmony.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= LEDGER ================= */}
      {screen === "ledger" && (
        <div className="screen scroll">
          <div className="ewrap">
            <h2 className="eh">Uniqueness ledger</h2>
            <p className="esub">Every design you reserve is recorded here by signature. Generate checks against this list, so a composition can only ever be used once.</p>
            {ledger.length === 0
              ? <p className="tiny">Nothing reserved yet. Reserve a design from the Studio and it will appear here.</p>
              : <div className="ledtable">
                <div className="ledrow ledhd"><span>Partner</span><span>Pack</span><span>Design</span><span>Reserved</span></div>
                {ledger.map(l => (
                  <div key={l.id} className="ledrow">
                    <span>{l.partner}</span><span className="monoval">{l.pack}</span>
                    <span className="monoval seal">{l.design_id}</span>
                    <span className="monoval">{(l.created_at || "").slice(0, 10)}</span>
                  </div>))}
              </div>}
            <div className="spacebox" style={{ marginTop: 22 }}>
              <span className="lb">Headroom</span>
              <b>{(space.total - ledger.length).toLocaleString()}</b>
              <p>Distinct pages still available for the current brief.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Axis = ({ label, items, value, onChange }) => (
  <div className="grp">
    <span className="lb">{label}</span>
    <div className="pills">
      {items.map(i => <button key={i.id} aria-pressed={value === i.id} onClick={() => onChange(i.id)}>{String(i.name).toUpperCase()}</button>)}
    </div>
  </div>
);
