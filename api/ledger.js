const URL_BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function sb(path, init = {}) {
  const r = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY, Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json", Prefer: "return=representation",
      ...(init.headers || {})
    }
  });
  const text = await r.text();
  let body; try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { ok: r.ok, status: r.status, body };
}

export default async function handler(req, res) {
  if (!URL_BASE || !KEY) return res.status(503).json({ error: "Supabase is not configured on this deployment." });

  try {
    if (req.method === "GET") {
      const r = await sb("designs?select=id,partner,pack,signature,design_id,comp,created_at&order=created_at.desc&limit=500");
      if (!r.ok) throw new Error(r.body?.message || "Read failed");
      return res.status(200).json({ rows: r.body || [] });
    }

    if (req.method === "POST") {
      const { partner, pack, signature, design_id, comp, partner_data } = req.body || {};
      if (!partner || !signature || !design_id) return res.status(400).json({ error: "partner, signature and design_id are required." });

      const r = await sb("designs", {
        method: "POST",
        body: JSON.stringify({ partner, pack, signature, design_id, comp: comp || {}, partner_data: partner_data || {} })
      });

      // 23505 is the unique-violation on signature — that IS the guarantee working.
      if (!r.ok) {
        const dup = r.status === 409 || /duplicate key|23505/i.test(JSON.stringify(r.body || ""));
        if (dup) {
          const ex = await sb(`designs?select=partner,design_id,created_at&signature=eq.${encodeURIComponent(signature)}&limit=1`);
          const who = ex.ok && ex.body && ex.body[0] ? ex.body[0].partner : "another partner";
          return res.status(200).json({ duplicate: true, taken_by: who, error: null });
        }
        throw new Error(r.body?.message || "Reserve failed");
      }
      return res.status(201).json({ row: r.body?.[0] || null, duplicate: false });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
