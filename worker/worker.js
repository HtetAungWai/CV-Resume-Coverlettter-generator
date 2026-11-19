// Cloudflare Worker: relays "Improve with AI" requests to OpenRouter so the key never reaches the browser.
const MODEL = 'openrouter/free';
const MAX_PROMPT = 6000;   // characters per request
const PER_IP = 8;          // AI requests per visitor per day
const GLOBAL = 300;        // AI requests per day overall
const ORIGINS = [];        // optional, e.g. ['https://YOUR-USERNAME.github.io']; empty = allow any website
const mem = { day: '', total: 0, ip: new Map() };   // best-effort limits when no KV is bound

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': ORIGINS.length ? (ORIGINS.includes(origin) ? origin : ORIGINS[0]) : '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' };
    const send = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return send({ error: 'POST only.' }, 405);
    if (ORIGINS.length && !ORIGINS.includes(origin)) return send({ error: 'Origin not allowed.' }, 403);
    if (!env.OPENROUTER_KEY) return send({ error: 'Server is not configured.' }, 500);
    let body; try { body = await req.json() } catch { return send({ error: 'Invalid request.' }, 400) }
    const prompt = body && body.prompt;
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > MAX_PROMPT) return send({ error: 'Invalid request.' }, 400);
    const ip = req.headers.get('CF-Connecting-IP') || 'unknown', day = new Date().toISOString().slice(0, 10);
    if (!(await allow(env, ip, day))) return send({ error: 'Daily AI limit reached. Try again tomorrow.' }, 429);
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST', headers: { Authorization: 'Bearer ' + env.OPENROUTER_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: prompt }] })
    });
    if (!r.ok) return send({ error: 'The AI service is busy. Try again shortly.' }, 502);
    const j = await r.json();
    return send({ text: j.choices?.[0]?.message?.content ?? '' });
  }
};

async function allow(env, ip, day) {
  if (env.LIMITS) {   // durable limits: optional KV namespace bound as LIMITS
    const k = day + ':' + ip, a = day + ':all', n = +(await env.LIMITS.get(k)) || 0, t = +(await env.LIMITS.get(a)) || 0;
    if (n >= PER_IP || t >= GLOBAL) return false;
    await env.LIMITS.put(k, String(n + 1), { expirationTtl: 172800 });
    await env.LIMITS.put(a, String(t + 1), { expirationTtl: 172800 });
    return true;
  }
  if (mem.day !== day) { mem.day = day; mem.total = 0; mem.ip.clear() }
  const n = mem.ip.get(ip) || 0;
  if (n >= PER_IP || mem.total >= GLOBAL) return false;
  mem.ip.set(ip, n + 1); mem.total++; return true;
}
