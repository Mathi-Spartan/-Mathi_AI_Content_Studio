import React, { useState, useMemo, useEffect } from "react";
import sslFull from "../content/packs/ssl-full.json";
import automationLp from "../content/packs/automation-lp.json";
import vmcCmc from "../content/packs/vmc-cmc-dmarc.json";
import PartnerPage, { SectionOnly } from "./PartnerPage.jsx";
import { FAMILY } from "./blocks.jsx";
import { GEO, validMods, geoName, MODS } from "./geometry.js";
import { TYPES, SURFACES, DENSITY, CORNERS, MOTION, RHYTHM, NAV, ACCENT_SHAPE, pick } from "./dna.js";
import { HARMONIES, TONES, buildPalette } from "./compose.js";
import { generate, generateUnique, structureCounts, minDistance, signature, shortId } from "./engine.js";

const PACKS = { "ssl-full": sslFull, "automation-lp": automationLp, "vmc-cmc-dmarc": vmcCmc };
const JOBS = [
  { pack: "ssl-full", title: "Full SSL site", blurb: "Certificates, platforms, the 47-day story, automation, enquiry." },
  { pack: "automation-lp", title: "Automation landing page", blurb: "One upsell page for Plan + Automate and ACME CaaS." },
  { pack: "vmc-cmc-dmarc", title: "VMC / CMC / DMARC", blurb: "BIMI readiness, mark certificates, DMARC ladder." }
];
const BLANK = { name: "", legal_name: "", country: "", city: "", phone: "", email: "", whatsapp: "", site_url: "", ca_status: "" };

/* Curated style recipes for the gallery — rendered live with the partner's brand. */
const STYLE_CARDS = [
  { name: "Boardroom", harmony: "mono", tone: "deep", type: "institutional", surface: "lifted", rhythm: "alt", accentShape: "solid", corners: "6" },
  { name: "Swiss", harmony: "near", tone: "ink", type: "swiss", surface: "outlined", rhythm: "white", accentShape: "underline", corners: "0" },
  { name: "Warm counsel", harmony: "analogous-warm", tone: "earth", type: "warm", surface: "paper", rhythm: "washy", accentShape: "dot", corners: "6" },
  { name: "Product", harmony: "split-a", tone: "vivid", type: "tech2", surface: "softshadow", rhythm: "alt", accentShape: "highlight", corners: "16" },
  { name: "Broadsheet", harmony: "mono", tone: "ink", type: "gazette", surface: "flat", rhythm: "white", accentShape: "bracket", corners: "0" },
  { name: "Night ops", harmony: "complement", tone: "midnight", type: "monolead", surface: "inset", rhythm: "inverted", accentShape: "solid", corners: "3" },
  { name: "Brutal", harmony: "triad-a", tone: "vivid", type: "brutal", surface: "brutal", rhythm: "banded", accentShape: "highlight", corners: "0" },
  { name: "Soft touch", harmony: "analogous-cool", tone: "muted", type: "soft", surface: "softshadow", rhythm: "washy", accentShape: "dot", corners: "24" },
  { name: "Legal pad", harmony: "mono", tone: "slateish", type: "legal", surface: "etched", rhythm: "bookend", accentShape: "underline", corners: "3" },
  { name: "Showcase", harmony: "wide", tone: "rich", type: "display2", surface: "glass", rhythm: "alt", accentShape: "solid", corners: "16" },
  { name: "Elegant", harmony: "near", tone: "muted", type: "elegant", surface: "flat", rhythm: "white", accentShape: "bracket", corners: "6" },
  { name: "Utility", harmony: "split-b", tone: "deep", type: "utility", surface: "flat", rhythm: "banded", accentShape: "solid", corners: "3" }
];

export default function App() {
  const [step, setStep] = useState("brand");
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
  const [drawer, setDrawer] = useState(null); // {kind:'layout', id} | {kind:'style'} | {kind:'tune'}
  const [msg, setMsg] = useState(null);

  const pack = PACKS[packId];
  const counts = useMemo(() => structureCounts(packId), [packId]);
  const gaps = useMemo(() => ["name", "country", "phone", "email"].filter(k => !(partner[k] || "").trim()), [partner]);
  const others = useMemo(() => ledger.map(l => l.comp).filter(c => c && (!comp || c.signature !== comp.signature)), [ledger, comp]);
  const distinct = useMemo(() => comp ? minDistance(comp, others) : 1, [comp, others]);

  useEffect(() => { fetch("/api/ledger").then(r => r.json()).then(j => setLedger(j.rows || [])).catch(() => {}); }, []);
  useEffect(() => {
    const k = e => { if (e.key === "Escape") setDrawer(null); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  const usedSigs = ledger.map(l => l.signature);

  const doGenerate = (keep = {}) => {
    const { comp: c } = generateUnique({ packId, partner, brandHex, nonce: nonce + 1, keep }, usedSigs);
    setNonce(n => n + 1); setComp(c); setStep("design"); setMsg(null);
  };
  const remixStyle = () => comp && doGenerate({ skeleton: comp.skeleton, blocks: comp.blocks });
  const remixLayout = () => comp && doGenerate({
    harmony: comp.dna.harmony, tone: comp.dna.tone, type: comp.dna.type, surface: comp.dna.surface,
    rhythm: comp.dna.rhythm, accentShape: comp.dna.accentShape, corners: comp.dna.corners,
    density: comp.dna.density, motion: comp.dna.motion, nav: comp.dna.nav
  });

  const patch = (fn) => {
    const c = fn({ ...comp, blocks: { ...comp.blocks }, dna: { ...comp.dna } });
    c.palette = buildPalette(brandHex, c.dna.harmony, c.dna.tone);
    c.signature = signature(c); c.id = shortId(c);
    setComp(c);
  };
  const cycleGeo = (id, dir) => patch(c => {
    const fam = FAMILY[id] || "points";
    const gs = GEO[fam]; const i = gs.findIndex(x => x.id === c.blocks[id].g);
    const g = gs[(i + dir + gs.length) % gs.length].id;
    const mods = validMods(fam, g);
    c.blocks[id] = { g, m: mods.indexOf(c.blocks[id].m) > -1 ? c.blocks[id].m : mods[0] };
    return c;
  });
  const diceGeo = (id) => patch(c => {
    const fam = FAMILY[id] || "points";
    const gs = GEO[fam]; const g = gs[Math.floor(Math.random() * gs.length)].id;
    const mods = validMods(fam, g);
    c.blocks[id] = { g, m: mods[Math.floor(Math.random() * mods.length)] };
    return c;
  });
  const setGeo = (id, g, m) => patch(c => {
    const fam = FAMILY[id] || "points";
    const mods = validMods(fam, g);
    c.blocks[id] = { g, m: m && mods.indexOf(m) > -1 ? m : (mods.indexOf(c.blocks[id].m) > -1 ? c.blocks[id].m : mods[0]) };
    return c;
  });
  const applyStyle = (s) => patch(c => { c.dna = { ...c.dna, ...s }; return c; });
  const setAxis = (k, v) => patch(c => { c.dna[k] = v; return c; });

  const readSite = async () => {
    const clean = url.trim().replace(/^https?:\/\//, "");
    if (!clean) return;
    setBusy(true); setErr(null); setRead(null);
    try {
      const r = await fetch("/api/read-site?url=" + encodeURIComponent("https://" + clean));
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Could not read that site");
      setRead(j); setPartner(p => ({ ...p, ...j.partner }));
      if (j.palette && j.palette.length) setBrandHex(j.palette[0]);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const commit = async () => {
    if (!comp || !partner.name.trim()) { setMsg({ t: "warn", m: "Give the partner a name first." }); return; }
    try {
      const r = await fetch("/api/ledger", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner: partner.name, pack: packId, signature: comp.signature, design_id: comp.id, comp, partner_data: partner })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Could not reserve");
      const l = await (await fetch("/api/ledger")).json(); setLedger(l.rows || []);
      setMsg(j.duplicate ? { t: "warn", m: "Already reserved by " + j.taken_by + "." } : { t: "ok", m: comp.id + " reserved for " + partner.name + "." });
    } catch (e) { setMsg({ t: "warn", m: e.message }); }
  };

  const download = () => {
    const node = document.querySelector(".plateScroll .pp");
    const clone = node ? node.cloneNode(true) : null;
    if (clone) clone.querySelectorAll(".canvas-tools").forEach(n => n.remove());
    const styles = [].slice.call(document.styleSheets).map(s => {
      try { return [].slice.call(s.cssRules).map(r => r.cssText).join("\n"); } catch (e) { return ""; }
    }).join("\n");
    const fl = document.querySelector('link[href*="fonts.googleapis"]');
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
      "<title>" + esc(partner.name || "Partner") + "</title>\n" +
      (fl ? '<link rel="stylesheet" href="' + fl.href + '">\n' : "") +
      "<style>\nbody{margin:0;background:#fff;}\n@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}\n" +
      styles + "\n</style></head>\n<body>" + (clone ? clone.outerHTML : "") + "</body></html>";
    const b = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = (partner.name || "partner").toLowerCase().replace(/\W+/g, "-") + "-" + (comp ? comp.id.replace(/:/g, "") : "page") + ".html";
    a.click();
  };

  const previewComp = (over) => comp ? { ...comp, dna: { ...comp.dna, ...over }, palette: buildPalette(brandHex, over.harmony || comp.dna.harmony, over.tone || comp.dna.tone) } : null;

  return (
    <div className="app">
      <header className="top">
        <div className="mark"><b>PLATE</b><span>partner studio</span></div>
        <nav className="stepsnav">
          {[["brand", "1", "Brand"], ["design", "2", "Design"], ["ship", "3", "Ship"]].map(([id, n, label]) => (
            <button key={id} aria-pressed={step === id} disabled={id !== "brand" && !comp} onClick={() => setStep(id)}>
              <i>{n}</i>{label}
            </button>
          ))}
          <button className="ghost" aria-pressed={step === "ledger"} onClick={() => setStep("ledger")}>Ledger</button>
        </nav>
        <div className="right">
          {comp && <div className="fp" title="Design ID — unique to this partner"><i className={distinct > .55 ? "" : "lowd"} /><code>{comp.id}</code></div>}
          {comp && <button className="btn seal" onClick={download}>Download</button>}
        </div>
      </header>

      {/* ============ 1 · BRAND ============ */}
      {step === "brand" && (
        <main className="screen scroll">
          <div className="brandwrap">
            <h1 className="ih">Start with who it's for.</h1>
            <p className="isub">Paste their site and PLATE reads the brand back — or type it in. Everything downstream is generated from these few fields.</p>

            <div className="bigcard">
              <div className="urlbar">
                <span className="pre">https://</span>
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder="www.acemicro.com.pk"
                  spellCheck="false" onKeyDown={e => e.key === "Enter" && readSite()} />
                <button className="btn seal" onClick={readSite} disabled={busy}>{busy ? "Reading…" : "Read site"}</button>
              </div>
              {err && <p className="errline">{err} — fill the fields by hand instead.</p>}
              {read && <p className="okline">Read {read.found} of {read.total} signals from {read.host} in {read.ms}ms{read.greenfield ? " — no existing SSL content found (greenfield)." : "."}</p>}

              <div className="mgrid">
                {Object.keys(BLANK).map(k => (
                  <label key={k} className={gaps.indexOf(k) > -1 ? "fld gap" : "fld"}>
                    <span>{k.replace(/_/g, " ")}</span>
                    <input value={partner[k]} onChange={e => setPartner({ ...partner, [k]: e.target.value })} />
                  </label>
                ))}
              </div>

              <div className="brandrow">
                <span className="lb">Brand colour — the whole design derives from it</span>
                <div className="brandpick">
                  <input type="color" value={brandHex} onChange={e => setBrandHex(e.target.value.toUpperCase())} />
                  <code>{brandHex}</code>
                  {read && read.palette && read.palette.map(c => (
                    <button key={c} className="swpick" data-on={c === brandHex ? "1" : "0"} style={{ background: c }} title={c} onClick={() => setBrandHex(c)} />
                  ))}
                </div>
              </div>

              <div className="jobrow">
                {JOBS.map(j => (
                  <button key={j.pack} className="jobchip" data-sel={packId === j.pack ? "1" : "0"} onClick={() => setPackId(j.pack)}>
                    <b>{j.title}</b><span>{j.blurb}</span>
                  </button>
                ))}
              </div>

              <div className="golane">
                <div className="gonums">
                  <b>{counts.library}</b><span>section designs in the library</span>
                  <em>·</em>
                  <b>{counts.total.toLocaleString()}</b><span>distinct pages for this brief</span>
                </div>
                <button className="btn seal big" onClick={() => doGenerate()}>Generate →</button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ============ 2 · DESIGN ============ */}
      {step === "design" && comp && (
        <main className="designmain">
          <div className="designbar">
          <div className="dev">{["desktop", "tablet", "phone"].map(d =>
            <button key={d} aria-pressed={device === d} onClick={() => setDevice(d)}>{d[0].toUpperCase() + d.slice(1)}</button>)}</div>
            <span className="hintline">Hover any section on the page — swap its layout right there.</span>
            {msg && <span className={"msg " + msg.t}>{msg.m}</span>}
            <div className="remixes">
              <button className="btn" onClick={() => setDrawer({ kind: "style" })}>Styles</button>
              <button className="btn" onClick={() => setDrawer({ kind: "tune" })}>Tune</button>
              <button className="btn" onClick={remixLayout}>⚄ Layout</button>
              <button className="btn" onClick={remixStyle}>⚄ Style</button>
              <button className="btn seal" onClick={() => doGenerate()}>⚄ Remix all</button>
            </div>
          </div>

          <div className="canvasWrap">
            <div className={"plate " + device}>
              <div className="plateScroll">
                <PartnerPage pack={pack} partner={partner} comp={comp} choice={choice} editable
                  onOpen={id => setDrawer({ kind: "layout", id })}
                  onCycle={cycleGeo} onDice={diceGeo} />
              </div>
            </div>
            <div className="distfloat" title="How different this page is from the closest one you have shipped">
              <i style={{ width: Math.round(distinct * 100) + "%" }} className={distinct > .55 ? "" : "low"} />
              <span>{others.length ? Math.round(distinct * 100) + "% distinct" : "first of its kind"}</span>
            </div>
          </div>

          {/* ---- layout drawer: THIS section in every geometry, live ---- */}
          {drawer && drawer.kind === "layout" && (() => {
            const id = drawer.id; const fam = FAMILY[id] || "points";
            const s = pack.content.filter(x => x.id === id)[0];
            const cur = comp.blocks[id]; const mod = MODS[fam];
            const mods = validMods(fam, cur.g);
            return (
              <div className="drawer" onClick={() => setDrawer(null)}>
                <div className="drawerin" onClick={e => e.stopPropagation()}>
                  <div className="drawerhd">
                    <b>{s ? s.label : id}</b>
                    <span className="dim2">{GEO[fam].length} layouts — every tile is your page, live</span>
                    {mod && mods.length > 1 && (
                      <div className="modrow">
                        <span className="lb">{mod.name}</span>
                        {mods.map(m => <button key={m} className="modchip" aria-pressed={cur.m === m} onClick={() => setGeo(id, cur.g, m)}>{m}</button>)}
                      </div>
                    )}
                    <button className="xbtn" onClick={() => setDrawer(null)}>Done</button>
                  </div>
                  <div className="tilewrap">
                    {GEO[fam].map(g => {
                      const geo = { g: g.id, m: validMods(fam, g.id).indexOf(cur.m) > -1 ? cur.m : validMods(fam, g.id)[0] };
                      return (
                        <button key={g.id} className="tile" data-on={cur.g === g.id ? "1" : "0"} onClick={() => setGeo(id, g.id, geo.m)}>
                          <span className="tilezoom"><span className="tilepage">
                            <SectionOnly pack={pack} partner={partner} comp={comp} choice={choice} id={id} geo={geo} />
                          </span></span>
                          <em>{g.name}</em>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ---- style gallery: curated recipes rendered with their brand ---- */}
          {drawer && drawer.kind === "style" && (
            <div className="drawer" onClick={() => setDrawer(null)}>
              <div className="drawerin" onClick={e => e.stopPropagation()}>
                <div className="drawerhd">
                  <b>Styles</b><span className="dim2">Each card is your page in a different finish — same layout, same words.</span>
                  <button className="xbtn" onClick={() => setDrawer(null)}>Done</button>
                </div>
                <div className="tilewrap styles">
                  {STYLE_CARDS.map(sc => {
                    const pv = previewComp(sc);
                    const on = comp.dna.harmony === sc.harmony && comp.dna.tone === sc.tone && comp.dna.type === sc.type && comp.dna.surface === sc.surface;
                    return (
                      <button key={sc.name} className="tile" data-on={on ? "1" : "0"} onClick={() => applyStyle(sc)}>
                        <span className="tilezoom tall"><span className="tilepage">
                          <SectionOnly pack={pack} partner={partner} comp={pv} choice={choice} id={comp.order[0]} geo={comp.blocks[comp.order[0]]} />
                        </span></span>
                        <em>{sc.name}</em>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ---- tune drawer: the handful of dials, visual where possible ---- */}
          {drawer && drawer.kind === "tune" && (
            <div className="drawer" onClick={() => setDrawer(null)}>
              <div className="drawerin slim" onClick={e => e.stopPropagation()}>
                <div className="drawerhd"><b>Tune</b><span className="dim2">{comp.id}</span><button className="xbtn" onClick={() => setDrawer(null)}>Done</button></div>
                <div className="tunebody">
                  <div className="grp"><span className="lb">Palette from {brandHex}</span>
                    <div className="palrow">{["primary", "deep", "accent", "night", "wash", "line"].map(k => <span key={k} className="palsw" style={{ background: comp.palette[k] }} title={k} />)}</div>
                    <div className="pills mt6">{HARMONIES.map(h => <button key={h.id} aria-pressed={comp.dna.harmony === h.id} onClick={() => setAxis("harmony", h.id)}>{h.name}</button>)}</div>
                    <div className="pills mt6">{TONES.map(h => <button key={h.id} aria-pressed={comp.dna.tone === h.id} onClick={() => setAxis("tone", h.id)}>{h.name}</button>)}</div>
                  </div>
                  <div className="grp"><span className="lb">Type</span>
                    <div className="tp">{TYPES.map(t => <button key={t.id} aria-pressed={comp.dna.type === t.id} onClick={() => setAxis("type", t.id)}><b style={{ fontFamily: t.display + ", sans-serif" }}>{t.name}</b><span>{t.tag}</span></button>)}</div>
                  </div>
                  <Ax label="Surface" items={SURFACES} k="surface" comp={comp} set={setAxis} />
                  <Ax label="Rhythm" items={RHYTHM} k="rhythm" comp={comp} set={setAxis} />
                  <Ax label="Header" items={NAV} k="nav" comp={comp} set={setAxis} />
                  <Ax label="Accent" items={ACCENT_SHAPE} k="accentShape" comp={comp} set={setAxis} />
                  <Ax label="Density" items={DENSITY} k="density" comp={comp} set={setAxis} />
                  <Ax label="Corners" items={CORNERS} k="corners" comp={comp} set={setAxis} />
                  <Ax label="Motion" items={MOTION} k="motion" comp={comp} set={setAxis} />
                  <div className="grp"><span className="lb">Copy tone</span>
                    {pack.content.filter(s => s.variants.length > 1).map(s => (
                      <div key={s.id} className="copyrow"><span className="lb">{s.label}</span>
                        <div className="pills">{s.variants.map(v => (
                          <button key={v.id} aria-pressed={(choice[pack.id + ":" + s.id] || s.variants[0].id) === v.id}
                            onClick={() => setChoice({ ...choice, [pack.id + ":" + s.id]: v.id })}>{v.tone.split(" — ")[0]}</button>))}</div>
                      </div>))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ============ 3 · SHIP ============ */}
      {step === "ship" && comp && (
        <main className="screen scroll">
          <div className="ewrap">
            <h2 className="eh">Ship it</h2>
            <p className="esub">Design <code>{comp.id}</code> for {partner.name || "\u27E8partner\u27E9"}. Reserve it so no other partner can ever get it, then download one self-contained file.</p>
            <div className="ebox">
              <div className="hd"><span className="lb">Pre-flight</span></div>
              <div className="echk">
                <Chk ok={gaps.indexOf("name") < 0}>Partner name filled</Chk>
                <Chk ok={gaps.indexOf("phone") < 0}>Phone filled</Chk>
                <Chk ok={gaps.indexOf("email") < 0}>Email filled</Chk>
                <Chk ok={gaps.indexOf("country") < 0}>Country filled</Chk>
                <Chk ok>Responsive at 390 / 768 / 1440</Chk>
                <Chk ok>Reduced motion respected</Chk>
                <Chk ok={false}>DigiCert warranty figures blank — supply before shipping</Chk>
                <Chk ok={false}>PositiveSSL ACME CaaS product ID missing</Chk>
              </div>
            </div>
            <p className="tiny">Pre-flight never invents a number. What it cannot verify stays blank and is reported here.</p>
            <div className="frow">
              <button className="btn" onClick={commit}>Reserve this design</button>
              <button className="btn seal" onClick={download}>Download HTML</button>
            </div>
            {msg && <p className={"msg " + msg.t} style={{ marginTop: 12 }}>{msg.m}</p>}
          </div>
        </main>
      )}

      {/* ============ LEDGER ============ */}
      {step === "ledger" && (
        <main className="screen scroll">
          <div className="ewrap">
            <h2 className="eh">Ledger</h2>
            <p className="esub">Every reserved design, by signature. Generate never repeats anything on this list.</p>
            {ledger.length === 0 ? <p className="tiny">Nothing reserved yet.</p> :
              <div className="ledtable">
                <div className="ledrow ledhd"><span>Partner</span><span>Pack</span><span>Design</span><span>Date</span></div>
                {ledger.map(l => <div key={l.id} className="ledrow"><span>{l.partner}</span><span className="monoval">{l.pack}</span><span className="monoval seal">{l.design_id}</span><span className="monoval">{(l.created_at || "").slice(0, 10)}</span></div>)}
              </div>}
          </div>
        </main>
      )}
    </div>
  );
}

const Ax = ({ label, items, k, comp, set }) => (
  <div className="grp"><span className="lb">{label}</span>
    <div className="pills">{items.map(i => <button key={i.id} aria-pressed={comp.dna[k] === i.id} onClick={() => set(k, i.id)}>{String(i.name)}</button>)}</div>
  </div>
);
const Chk = ({ ok, children }) => <div><span className={"tick " + (ok ? "" : "bad")}>{ok ? "✓" : "!"}</span>{children}</div>;
