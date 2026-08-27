// Partner persistence. The service_role key is read from the environment and
// never leaves this function — it must not appear in the client bundle.
const URL_BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function sb(path, init = {}) {
  const r = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {})
    }
  });
  const text = await r.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!r.ok) throw new Error(typeof body === "object" && body?.message ? body.message : `Supabase ${r.status}`);
  return body;
}

export default async function handler(req, res) {
  if (!URL_BASE || !KEY) {
    return res.status(503).json({ error: "Supabase is not configured on this deployment." });
  }

  try {
    if (req.method === "GET") {
      const rows = await sb("partners?select=id,name,data,updated_at&order=updated_at.desc&limit=50");
      return res.status(200).json({ partners: rows || [] });
    }

    if (req.method === "POST") {
      const { partner, pack, choices } = req.body || {};
      const name = (partner?.name || "").trim();
      if (!name) return res.status(400).json({ error: "Partner name is required." });

      const row = {
        name,
        data: partner,
        last_pack: pack || null,
        choices: choices || {},
        updated_at: new Date().toISOString()
      };

      const existing = await sb(`partners?select=id&name=eq.${encodeURIComponent(name)}&limit=1`);
      if (existing && existing.length) {
        const out = await sb(`partners?id=eq.${existing[0].id}`, { method: "PATCH", body: JSON.stringify(row) });
        return res.status(200).json({ partner: out?.[0] || row, updated: true });
      }
      const out = await sb("partners", { method: "POST", body: JSON.stringify(row) });
      return res.status(201).json({ partner: out?.[0] || row, created: true });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
