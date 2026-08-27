import React, { useState, useMemo, useEffect } from "react";
import sslFull from "../content/packs/ssl-full.json";
import automationLp from "../content/packs/automation-lp.json";
import vmcCmc from "../content/packs/vmc-cmc-dmarc.json";
import PartnerPage from "./PartnerPage.jsx";
import {
  PALETTES, TYPES, SURFACES, DENSITY, CORNERS, MOTION,
  SKELETONS, PRESETS, fingerprint, pick, shuffle
} from "./dna.js";

const PACKS = { "ssl-full": sslFull, "automation-lp": automationLp, "vmc-cmc-dmarc": vmcCmc };
const JOBS = [
  { pack: "ssl-full", title: "Full SSL site, automation-first", blurb: "Certificate range, platforms, the 47-day narrative, automation products, guides, enquiry form." },
  { pack: "automation-lp", title: "Automation landing page only", blurb: "One scrolling upsell page. Plan + Automate and ACME CaaS, the renewal-cost argument, single lead form." },
  { pack: "vmc-cmc-dmarc", title: "VMC / CMC / DMARC", blurb: "BIMI readiness, mark certificate path, DMARC enforcement ladder, Valimail, trademark prerequisites." }
];
const BLANK = { name: "", legal_name: "", country: "", city: "", phone: "", email: "", whatsapp: "", site_url: "", ca_status: "" };

export default function App() {
  const [screen, setScreen] = useState("intake");
  const [partner, setPartner] = useState(BLANK);
  const [packId, setPackId] = useState("ssl-full");
  const [skeletonId, setSkeletonId] = useState("S-03");
  const [dna, setDna] = useState(PRESETS[0].dna);
  const [locks, setLocks] = useState({ pal: false, type: false, layout: false, motion: false, surface: false, density: false, corners: false });
  const [tab, setTab] = useState("brand");
  const [device, setDevice] = useState("desktop");
  const [choice, setChoice] = useState({});
  const [url, setUrl] = useState("");
  const [read, setRead] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [filter, setFilter] = useState("all");
  const [saved, setSaved] = useState([]);

  const pack = PACKS[packId];
  const fp = fingerprint(dna, skeletonId);
  const fits = PRESETS.filter(p => p.pack === packId);
  const gaps = useMemo(() => ["name", "country", "phone", "email"].filter(k => !(partner[k] || "").trim()), [partner]);

  useEffect(() => { fetch("/api/partners").then(r => r.json()).then(j => setSaved(j.partners || [])).catch(() => {}); }, []);

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
      if (j.palette && j.palette.length) setDna(d => ({ ...d, pal: nearestPalette(j.palette[0]) }));
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const applyPreset = (p) => { setPackId(p.pack); setSkeletonId(p.skeleton); setDna(p.dna); setScreen("studio"); };
  const doShuffle = () => { const r = shuffle(dna, locks, skeletonId, packId); setDna(r.dna); setSkeletonId(r.skeletonId); };

  const savePartner = async () => {
    if (!partner.name.trim()) return;
    try {
      await fetch("/api/partners", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner, pack: packId, choices: { skeletonId, dna, choice } }) });
      const j = await (await fetch("/api/partners")).json(); setSaved(j.partners || []);
    } catch {}
  };

  const download = () => {
    const html = buildStandalone(pack, partner);
    const b = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `${(partner.name || "partner").toLowerCase().replace(/\W+/g, "-")}-${packId}.html`;
    a.click();
  };

  return (
    <div className="app">
      <div className="top">
        <div className="mark"><b>PLATE</b><span>partner studio</span></div>
        <div className="seg">
          {[["intake", "Intake"], ["studio", "Studio"], ["templates", "Templates"], ["export", "Export"]].map(([s, l]) => (
            <button key={s} aria-pressed={screen === s} onClick={() => setScreen(s)}>{l}</button>
          ))}
        </div>
        <div className="right">
          <div className="fp"><i /><span className="fplb">{partner.name || "No partner"}</span><code>{fp}</code></div>
          <button className="btn" onClick={savePartner}>Save design</button>
          <button className="btn seal" onClick={download}>Download page</button>
        </div>
      </div>

      {screen === "intake" && (
        <div className="screen scroll">
          <div className="intake-wrap">
            <h1 className="ih">Paste a partner's site. <em>Get their brand back in seconds.</em></h1>
            <p className="isub">PLATE reads the live site, pulls the name, contact block, palette and typefaces, then hands you a page that already looks like it belongs to them. Anything it cannot read, it asks you for.</p>

            <div className="urlbar">
              <span className="pre">https://</span>
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="www.acemicro.com.pk"
                spellCheck="false" onKeyDown={e => e.key === "Enter" && readSite()} />
              <button className="btn seal" onClick={readSite} disabled={busy}>{busy ? "Reading…" : "Read site"}</button>
            </div>
            {err && <p className="errline">{err} — fill the fields below by hand instead.</p>}

            <div className="scan">
              <div className="card">
                <div className="hd">
                  <span className="lb">{read ? `Extracted from ${read.host}` : "Extraction"}</span>
                  {read && <span className="okms">{read.found} of {read.total} · {read.ms}ms</span>}
                </div>
                <div className="rows">
                  <Row k="Legal name" ok={!!partner.name} v={partner.legal_name || partner.name} />
                  <Row k="Palette" ok={!!(read && read.palette && read.palette.length)}
                    v={read && read.palette && read.palette.length
                      ? <>{read.palette.slice(0, 5).map(c => <span key={c} className="sw" style={{ background: c }} />)}<span className="dimx">{read.palette.length} found</span></>
                      : null} />
                  <Row k="Typefaces" ok={!!(read && read.fonts && read.fonts.length)} v={read && read.fonts ? read.fonts.join(", ") : null} />
                  <Row k="Contact" ok={!!(partner.phone || partner.email)} v={[partner.phone, partner.email].filter(Boolean).join(" · ")} />
                  <Row k="Location" ok={!!partner.country} v={[partner.city, partner.country].filter(Boolean).join(", ")} />
                  <Row k="Navigation" ok={!!(read && read.nav && read.nav.length)}
                    v={read && read.nav ? read.nav.slice(0, 5).map(n => <span key={n} className="chipx">{n}</span>) : null} />
                  <Row k="SSL content" ok={read ? !read.greenfield : false} flag={read ? read.greenfield : false}
                    v={read ? (read.greenfield ? "None found — greenfield" : "Existing SSL pages found") : null} />
                </div>
                <div className="manual">
                  <span className="lb">Fill or correct by hand</span>
                  <div className="mgrid">
                    {Object.keys(BLANK).map(k => (
                      <label key={k} className={gaps.indexOf(k) > -1 ? "fld gap" : "fld"}>
                        <span>{k.replace(/_/g, " ")}</span>
                        <input value={partner[k]} onChange={e => setPartner({ ...partner, [k]: e.target.value })} />
                      </label>
                    ))}
                  </div>
                  {saved.length > 0 && (
                    <div className="chips">
                      {saved.map(s => <button key={s.id} className="chip" onClick={() => setPartner({ ...BLANK, ...s.data })}>{s.name}</button>)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="lb" style={{ marginBottom: 10 }}>What are you building for them</p>
                <div className="jobs">
                  {JOBS.map(j => (
                    <div key={j.pack} className="job" data-sel={packId === j.pack ? "1" : "0"}
                      onClick={() => { setPackId(j.pack); const f = PRESETS.filter(p => p.pack === j.pack)[0]; setSkeletonId(f.skeleton); setDna(f.dna); }}>
                      <h4>{j.title}</h4><p>{j.blurb}</p>
                      <div className="meta">
                        <span className="chipx">{PACKS[j.pack].content.length} sections</span>
                        <span className="chipx">{PRESETS.filter(p => p.pack === j.pack).length} templates fit</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn seal wide" onClick={() => setScreen("studio")}>Open in Studio →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "studio" && (
        <div className="studio">
          <div className="rail">
            {[["brand", "Brand"], ["type", "Type"], ["layout", "Layout"], ["motion", "Motion"], ["sections", "Sections"], ["copy", "Copy"]].map(([id, label]) => (
              <button key={id} aria-pressed={tab === id} onClick={() => setTab(id)}><RailIcon id={id} /><u>{label}</u></button>
            ))}
          </div>

          <div className="stage">
            <div className="stagebar">
              <div className="dev">
                {["desktop", "tablet", "phone"].map(d => <button key={d} aria-pressed={device === d} onClick={() => setDevice(d)}>{d.toUpperCase()}</button>)}
              </div>
              <span className="lb">Skeleton</span>
              <span className="monoval">{skeletonId} {(SKELETONS.filter(s => s.id === skeletonId)[0] || {}).name}</span>
              <span className="lb" style={{ marginLeft: 8 }}>Pack</span>
              <span className="monoval">{pack.id.toUpperCase()}</span>
            </div>

            <div className="plateWrap">
              <div className="gutter">
                <span className="cap">Fingerprint</span>
                {fp.split(":").map((seg, i) => {
                  const key = ["pal", "type", "layout", "motion"][i];
                  return <span key={i} className="gseg" data-lock={locks[key] ? "1" : "0"} title={key + " — click to lock"}
                    onClick={() => setLocks({ ...locks, [key]: !locks[key] })}>{seg}</span>;
                })}
              </div>
              <div className={"plate " + device}>
                <div className="plateScroll">
                  <PartnerPage pack={pack} partner={partner} dna={dna} skeletonId={skeletonId} choice={choice} motionOn />
                </div>
              </div>
            </div>

            <div className="strip">
              <div className="striphd">
                <span className="lb">Templates that fit this brief</span>
                <span className="monoval">{fits.length}</span>
                <span className="lb" style={{ marginLeft: "auto" }}>Scroll →</span>
              </div>
              <div className="striprail">
                {fits.map(p => {
                  const pl = pick(PALETTES, p.dna.pal);
                  const on = p.skeleton === skeletonId && p.dna.pal === dna.pal && p.dna.type === dna.type;
                  return (
                    <div key={p.name} className="tcard" data-sel={on ? "1" : "0"} onClick={() => applyPreset(p)}>
                      <div className="th" style={{ background: pl.primary }} />
                      <div className="tb"><i style={{ width: "62%", background: pl.accent }} /><i /><i style={{ width: "80%" }} /><i style={{ width: "44%" }} /></div>
                      <div className="tn">{p.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="insp">
            <div className="inspbar">
              <span className="lb">{tab}</span>
              {read && <span className="monoval seal">from {read.host}</span>}
            </div>
            <div className="inspbody">
              {tab === "brand" && <>
                <Group label="Palette" lock={locks.pal} onLock={() => setLocks({ ...locks, pal: !locks.pal })}>
                  <div className="pal">
                    {PALETTES.map(p => (
                      <button key={p.id} aria-pressed={dna.pal === p.id} title={p.name}
                        style={{ background: "linear-gradient(150deg," + p.accent + " 0 46%," + p.primary + " 46% 100%)" }}
                        onClick={() => setDna({ ...dna, pal: p.id })} />
                    ))}
                  </div>
                  <p className="hint">{PALETTES.length} palettes, each graded against its own ink so body text clears AA.</p>
                </Group>
                <Group label="Surface" lock={locks.surface} onLock={() => setLocks({ ...locks, surface: !locks.surface })}>
                  <Pills items={SURFACES} value={dna.surface} onChange={v => setDna({ ...dna, surface: v })} />
                </Group>
              </>}

              {tab === "type" && (
                <Group label="Type pairing" lock={locks.type} onLock={() => setLocks({ ...locks, type: !locks.type })}>
                  <div className="tp">
                    {TYPES.map(t => (
                      <button key={t.id} aria-pressed={dna.type === t.id} onClick={() => setDna({ ...dna, type: t.id })}>
                        <b style={{ fontFamily: t.display + ", sans-serif" }}>{t.name}</b><span>{t.tag}</span>
                      </button>
                    ))}
                  </div>
                  <p className="hint">{TYPES.length} pairings — a display face and a body face chosen to sit together.</p>
                </Group>
              )}

              {tab === "layout" && <>
                <Group label="Skeleton" lock={locks.layout} onLock={() => setLocks({ ...locks, layout: !locks.layout })}>
                  <div className="tp">
                    {SKELETONS.filter(s => s.packs.indexOf(packId) > -1).map(s => (
                      <button key={s.id} aria-pressed={skeletonId === s.id} onClick={() => setSkeletonId(s.id)}>
                        <b>{s.name}</b><span>{s.order.length} SECTIONS</span>
                      </button>
                    ))}
                  </div>
                </Group>
                <Group label="Density" lock={locks.density} onLock={() => setLocks({ ...locks, density: !locks.density })}>
                  <Pills items={DENSITY} value={dna.density} onChange={v => setDna({ ...dna, density: v })} />
                </Group>
                <Group label="Corners" lock={locks.corners} onLock={() => setLocks({ ...locks, corners: !locks.corners })}>
                  <Pills items={CORNERS} value={dna.corners} onChange={v => setDna({ ...dna, corners: v })} />
                </Group>
              </>}

              {tab === "motion" && (
                <Group label="Motion" lock={locks.motion} onLock={() => setLocks({ ...locks, motion: !locks.motion })}>
                  <Pills items={MOTION} value={dna.motion} onChange={v => setDna({ ...dna, motion: v })} />
                  <p className="hint">Reduced motion is respected in the export whatever you pick here.</p>
                </Group>
              )}

              {tab === "sections" && (
                <Group label="Sections in this skeleton">
                  <div className="seclist">
                    {((SKELETONS.filter(s => s.id === skeletonId)[0] || {}).order || []).map(id => {
                      const s = pack.content.filter(x => x.id === id)[0];
                      return s ? <div key={id} className="secrow"><span>{s.label}</span>{s.required && <b>required</b>}</div> : null;
                    })}
                  </div>
                  <p className="hint">Order comes from the skeleton. Choose a different one in Layout to reorder.</p>
                </Group>
              )}

              {tab === "copy" && (
                <Group label="Tone per section">
                  <div className="copylist">
                    {pack.content.filter(s => s.variants.length > 1).map(s => (
                      <div key={s.id} className="copyrow">
                        <span className="lb">{s.label}</span>
                        <div className="pills">
                          {s.variants.map(v => (
                            <button key={v.id} aria-pressed={(choice[pack.id + ":" + s.id] || s.variants[0].id) === v.id}
                              onClick={() => setChoice({ ...choice, [pack.id + ":" + s.id]: v.id })}>{v.tone.split(" — ")[0]}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="hint">Sections with a single variant are not listed — there is nothing to choose.</p>
                </Group>
              )}
            </div>
            <div className="inspfoot">
              <div className="dice">
                <button onClick={doShuffle}>SHUFFLE UNLOCKED</button>
                <button onClick={() => { const p = fits[0]; setSkeletonId(p.skeleton); setDna(p.dna); }}>REVERT</button>
              </div>
              <button className="btn seal wide" onClick={download}>Download page</button>
            </div>
          </div>
        </div>
      )}

      {screen === "templates" && (
        <div className="screen scroll">
          <div className="gwrap">
            <div className="gbar">
              <div>
                <h2>Templates</h2>
                <p className="sub">Every card is a skeleton and a style recipe over the same content. Click to load it with {partner.name || "the partner"}'s brand inside.</p>
              </div>
              <div className="gfilters">
                {[["all", "All " + PRESETS.length], ["ssl-full", "SSL site"], ["automation-lp", "Automation"], ["vmc-cmc-dmarc", "VMC / DMARC"]].map(([id, label]) => (
                  <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
                ))}
              </div>
            </div>
            <div className="ggrid">
              {PRESETS.filter(p => filter === "all" || p.pack === filter).map(p => {
                const pl = pick(PALETTES, p.dna.pal), ty = pick(TYPES, p.dna.type);
                const sk = SKELETONS.filter(s => s.id === p.skeleton)[0];
                const r = pick(CORNERS, p.dna.corners).r;
                return (
                  <div key={p.name} className="gt" onClick={() => applyPreset(p)}>
                    <div className="gprev">
                      <div style={{ height: 15, background: pl.primary }} />
                      <div style={{ background: "linear-gradient(120deg," + pl.primary + "," + pl.deep + ")", height: 62, padding: "10px 12px" }}>
                        <div style={{ height: 8, width: "66%", background: "rgba(255,255,255,.92)", borderRadius: 2 }} />
                        <div style={{ height: 8, width: "44%", background: pl.accent, borderRadius: 2, marginTop: 5 }} />
                        <div style={{ height: 4, width: "78%", background: "rgba(255,255,255,.3)", borderRadius: 2, marginTop: 9 }} />
                        <div style={{ height: 11, width: "34%", background: pl.accent, borderRadius: 3, marginTop: 9 }} />
                      </div>
                      <div style={{ padding: "9px 12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, background: pl.wash }}>
                        {[0, 1, 2].map(i => <div key={i} style={{ height: 26, border: "1px solid " + pl.line, borderRadius: r > 16 ? 8 : r, background: "#fff" }} />)}
                      </div>
                    </div>
                    <div className="gmeta">
                      <b>{p.name}</b>
                      <span className="gsub">{sk && sk.name} · {sk && sk.order.length} sections</span>
                      <div className="gtags">
                        <span className={"gtag " + (p.pack === "ssl-full" ? "ssl" : p.pack === "automation-lp" ? "auto" : "vmc")}>
                          {p.pack === "ssl-full" ? "SSL" : p.pack === "automation-lp" ? "AUTO" : "VMC"}
                        </span>
                        <span className="gtag">{ty.tag.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {screen === "export" && (
        <div className="screen scroll">
          <div className="ewrap">
            <h2 className="eh">Ship it</h2>
            <p className="esub">The page carries {partner.name || "⟨partner⟩"}'s details already, styled by fingerprint <code>{fp}</code>.</p>
            <div className="ebox">
              <div className="hd"><span className="lb">Pre-flight</span>
                <span className={"monoval " + (gaps.length ? "warnc" : "okc")}>{gaps.length + 2} need you</span></div>
              <div className="echk">
                <Chk ok={gaps.indexOf("name") < 0}>Partner name filled</Chk>
                <Chk ok={gaps.indexOf("phone") < 0}>Phone filled</Chk>
                <Chk ok={gaps.indexOf("email") < 0}>Email filled</Chk>
                <Chk ok={gaps.indexOf("country") < 0}>Country filled</Chk>
                <Chk ok>Responsive at 390 / 768 / 1440</Chk>
                <Chk ok>Reduced motion respected</Chk>
                <Chk ok={false}>DigiCert warranty figures blank</Chk>
                <Chk ok={false}>PositiveSSL ACME CaaS product ID missing</Chk>
              </div>
            </div>
            <p className="tiny">Pre-flight never invents a number. Anything it cannot verify it leaves blank and reports here, so a wrong warranty figure cannot reach a partner with your name on it.</p>
            <div className="frow">
              <button className="btn seal" onClick={download}>Download single HTML file</button>
              <button className="btn" onClick={savePartner}>Save partner + design</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Row = ({ k, v, ok, flag }) => (
  <div className="row">
    <span className="k">{k}</span>
    <span className="v">{v || <em className="pending">—</em>}</span>
    <span className={"st " + (flag ? "flag" : ok ? "ok" : "pend")}>{flag ? "FLAG" : ok ? "READ" : "…"}</span>
  </div>
);
const Chk = ({ ok, children }) => <div><span className={"tick " + (ok ? "" : "bad")}>{ok ? "✓" : "!"}</span>{children}</div>;
const Group = ({ label, lock, onLock, children }) => (
  <div className="grp">
    <div className="grphd">
      <span className="lb">{label}</span>
      {onLock && <button className="lockb" data-on={lock ? "1" : "0"} onClick={onLock}>{lock ? "LOCKED" : "LOCK"}</button>}
    </div>
    {children}
  </div>
);
const Pills = ({ items, value, onChange }) => (
  <div className="pills">
    {items.map(i => <button key={i.id} aria-pressed={value === i.id} onClick={() => onChange(i.id)}>{String(i.name).toUpperCase()}</button>)}
  </div>
);
function RailIcon({ id }) {
  const p = {
    brand: <><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16" /></>,
    type: <path d="M5 6h14M9 6v13M15 6v13" />,
    layout: <><rect x="4" y="4" width="16" height="6" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="14" y="13" width="6" height="7" rx="1" /></>,
    motion: <><path d="M4 16c4-10 12-10 16 0" /><circle cx="12" cy="11" r="2" /></>,
    sections: <path d="M4 6h16M4 12h16M4 18h10" />,
    copy: <><path d="M6 5h9l4 4v10H6z" /><path d="M9 12h7M9 16h5" /></>
  }[id];
  return <svg viewBox="0 0 24 24">{p}</svg>;
}
function nearestPalette(hex) {
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  let best = PALETTES[0].id, bd = 1e9;
  try {
    const [r, g, b] = rgb(hex);
    PALETTES.forEach(p => {
      const [r2, g2, b2] = rgb(p.primary);
      const d = (r - r2) ** 2 + (g - g2) ** 2 + (b - b2) ** 2;
      if (d < bd) { bd = d; best = p.id; }
    });
  } catch (e) {}
  return best;
}
function buildStandalone(pack, partner) {
  const node = document.querySelector(".plateScroll");
  const inner = node ? node.innerHTML : "";
  const styles = [].slice.call(document.styleSheets).map(s => {
    try { return [].slice.call(s.cssRules).map(r => r.cssText).join("\n"); } catch (e) { return ""; }
  }).join("\n");
  const fl = document.querySelector('link[href*="fonts.googleapis"]');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    "<title>" + esc(partner.name || "Partner") + " — " + esc(pack.name) + "</title>\n" +
    (fl ? '<link rel="stylesheet" href="' + fl.href + '">\n' : "") +
    "<style>\nbody{margin:0;background:#fff;}\n@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}\n" +
    styles + "\n</style></head>\n<body>" + inner + "</body></html>";
}
