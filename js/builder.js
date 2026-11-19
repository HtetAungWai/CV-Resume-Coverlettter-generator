/* TechBridge CV Builder: templates, section ordering, personal info, photo, exports, optional AI */
(() => {
const $ = s => document.querySelector(s);
const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const NAMES = { resume: 'Resume', cv: 'CV', cover: 'Cover letter' };
const LABEL = { summary: 'Summary', skills: 'Skills', experience: 'Experience', projects: 'Projects', education: 'Education', activities: 'Activities' };
const INFO = { name: 'Full name', title: 'Title / target role', email: 'Email', phone: 'Phone', loc: 'Location', git: 'GitHub / portfolio', web: 'LinkedIn / website' };
const HINT = { experience: 'One block per entry: first line "Role, Organisation, dates", then one line per achievement. Blank line between blocks.', projects: 'Same format as experience.', education: 'Same format: "Degree, University, dates", then details.', activities: 'Clubs, leadership, events. Same format.' };

const DEF = {
  tpl: 'resume', accent: '#028090', font: 'sans', size: '11', align: 'left', photo: '',
  info: { name: '', title: '', email: '', phone: '', loc: '', git: '', web: '' },
  show: { title: 1, email: 1, phone: 1, loc: 1, git: 1, web: 1, photo: 0 },
  order: {
    resume: [['summary', 1], ['skills', 1], ['experience', 1], ['projects', 1], ['education', 1], ['activities', 0]],
    cv: [['summary', 1], ['education', 1], ['projects', 1], ['experience', 1], ['activities', 1], ['skills', 1]]
  },
  c: { summary: '', skills: '', experience: '', projects: '', education: '', activities: '', letter: '', company: '', recipient: '', why: '' }
};
const EXAMPLE = {
  info: { name: 'Nina Chaiyasit', title: 'Front-End Intern', email: 'nina.c@mail.com', phone: '081 234 5678', loc: 'Bangkok', git: 'github.com/ninac', web: '' },
  c: {
    summary: 'Computer science student who builds websites and automations for student clubs. Seeking a front-end internship.',
    skills: 'JavaScript, React, Python, Git, Figma',
    experience: 'Web Lead, TechBridge Club, 2025-now\nBuilt the club sign-up site; 120 members used it in two weeks\nAutomated event booking with n8n, saving 4 hours a week\nTaught Git to 9 new members',
    projects: 'Study planner app, React, 2025\nUsed by 80 students\nWon 2nd place at the campus hackathon',
    education: 'BSc Computer Science, Stamford University, 2022-2026\nGPA 3.6', activities: '', letter: '',
    company: 'Orbit Labs', recipient: '', why: 'I use their open-source dashboard kit for the club event tracker. Built a sign-up site for 120 members in two weeks.'
  }
};
let S = load() || clone(DEF);
function load() { try { const o = JSON.parse(localStorage.getItem('tb-cv')); return o && o.order ? merge(o) : null } catch (e) { return null } }
function merge(o) { const d = clone(DEF); return { ...d, ...o, info: { ...d.info, ...o.info }, show: { ...d.show, ...o.show }, c: { ...d.c, ...o.c }, order: { ...d.order, ...o.order } } }

const title = id => id === 'summary' && S.tpl === 'cv' ? 'Profile' : LABEL[id];
const blocks = t => String(t || '').split(/\n\s*\n/).map(b => b.split('\n').map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)).filter(b => b.length);
const bl = t => blocks(t).map(b => `<p class="eh"><b>${esc(b[0])}</b></p>${b.length > 1 ? `<ul>${b.slice(1).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}`).join('');
const active = () => S.order[S.tpl].filter(([id, on]) => on && String(S.c[id]).trim());
const details = () => ['email', 'phone', 'loc', 'git', 'web'].filter(k => S.show[k] && S.info[k]);

/* ---------- document (shared by preview and every export) ---------- */
function css() {
  const a = S.accent, f = S.font === 'serif' ? 'Georgia,"Times New Roman",serif' : 'Arial,Helvetica,sans-serif';
  return `@page{size:A4;margin:0.75in}@media screen{body{margin:30px auto;max-width:780px}}
.doc{font:${+S.size || 11}pt/1.45 ${f};color:#1a2b2e}.doc h1{font-size:2.1em;margin:0;color:${a}}.doc .t{font-size:1.1em;font-weight:bold;margin:2px 0}.doc .d{margin:2px 0;color:#456}
.dh{display:flex;gap:16px;align-items:center;border-bottom:3px solid ${a};padding-bottom:10px;margin-bottom:6px}.dh.center{flex-direction:column;text-align:center}
.doc .pic{width:92px;height:92px;border-radius:50%;object-fit:cover}.doc h2{color:${a};font-size:1.1em;border-bottom:1px solid #cfe3e1;margin:14px 0 4px;padding-bottom:2px}
.doc ul{margin:2px 0;padding-left:18px}.doc p{margin:4px 0}.doc .eh{margin:8px 0 0}.doc .hint{color:#8aa;font-style:italic}`;
}
function inner() {
  const i = S.info, cover = S.tpl === 'cover';
  const pic = S.show.photo && S.photo ? `<img class="pic" src="${S.photo}" alt="Photo of ${esc(i.name)}">` : '';
  const head = `<div class="dh ${S.align}">${pic}<div><h1>${esc(i.name) || '<span class="hint">Your name</span>'}</h1>${S.show.title && i.title ? `<p class="t">${esc(i.title)}</p>` : ''}<p class="d">${details().map(k => esc(i[k])).join(' · ')}</p></div></div>`;
  if (cover) {
    const L = S.c.letter.trim();
    return `${head}<p style="margin-top:14px">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p><p>${[S.c.recipient, S.c.company].filter(Boolean).map(esc).join('<br>')}</p>` +
      (L ? L.split(/\n\s*\n/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('') : '<p class="hint">Write your letter, or add notes and press Improve with AI.</p>');
  }
  const secs = active().map(([id]) => `<section><h2>${title(id)}</h2>${id === 'summary' || id === 'skills' ? `<p>${esc(S.c[id])}</p>` : bl(S.c[id])}</section>`).join('');
  return head + (secs || '<p class="hint">Fill in a section on the left to see it here.</p>');
}
function draw() {
  $('#dcss').textContent = css();
  $('#pv').innerHTML = `<div class="doc">${inner()}</div>`;
  try { localStorage.setItem('tb-cv', JSON.stringify(S)) } catch (e) { }
}

/* ---------- exports ---------- */
const fname = () => ((S.info.name || 'document').trim().replace(/\s+/g, '-') + '-' + NAMES[S.tpl]).replace(/[^\w\-]+/g, '');
const page = word => `<!doctype html><html ${word ? 'xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"' : ''}><head><meta charset="utf-8"><title>${esc(fname())}</title><style>${css()}</style></head><body><div class="doc">${inner()}</div></body></html>`;
async function dl(name, mime, data) {
  if (window.claude) {   // claude.ai demo: the page may only save through the downloads capability
    const D = await window.claude.use('downloads');
    if (!D) return say('Downloads are not available in this view.');
    try { await D.save({ filename: name, data }) } catch (e) { if (e.code !== 'declined') say('Could not save: ' + (e.message || e.code)) }
    return;
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: mime })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function txt(md) {
  const i = S.info, o = [(md ? '# ' : '') + i.name];
  if (S.show.title && i.title) o.push(i.title);
  o.push(details().map(k => i[k]).join(' | '), '');
  if (S.tpl === 'cover') { o.push([S.c.recipient, S.c.company].filter(Boolean).join('\n'), '', S.c.letter); return o.join('\n') }
  active().forEach(([id]) => {
    o.push(md ? '## ' + title(id) : title(id).toUpperCase());
    if (id === 'summary' || id === 'skills') o.push(S.c[id]);
    else blocks(S.c[id]).forEach(b => { o.push(md ? '**' + b[0] + '**' : b[0]); b.slice(1).forEach(x => o.push('- ' + x)) });
    o.push('');
  });
  return o.join('\n');
}
function printPdf() {
  const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;width:0;height:0;border:0';
  document.body.appendChild(f); f.contentDocument.open(); f.contentDocument.write(page()); f.contentDocument.close();
  setTimeout(() => { f.contentWindow.focus(); f.contentWindow.print(); setTimeout(() => f.remove(), 3000) }, 400);
}
const X = {
  pdf: () => window.claude ? (say('Demo: saving as HTML. Open it and press Ctrl/Cmd+P to save as PDF.'), X.html()) : printPdf(),
  html: () => dl(fname() + '.html', 'text/html', page()),
  doc: () => window.claude ? say('Word (.doc) export works on the deployed site. In this demo, use HTML, Text or Markdown.') : dl(fname() + '.doc', 'application/msword', page(1)),
  txt: () => dl(fname() + '.txt', 'text/plain', txt()),
  md: () => dl(fname() + '.md', 'text/markdown', txt(1)),
  json: () => dl(fname() + '.json', 'application/json', JSON.stringify(S, null, 2)),
  load: () => $('#jl').click(),
  reset: () => { if (confirm('Clear everything you typed?')) { S = clone(DEF); ui(); draw() } },
  ex: () => { S = merge({ ...clone(DEF), info: EXAMPLE.info, c: EXAMPLE.c, tpl: S.tpl }); ui(); draw() }
};

/* ---------- photo (resized and kept in the browser only) ---------- */
function pickPhoto(file) {
  if (!file) return; const r = new FileReader();
  r.onload = () => { const im = new Image(); im.onload = () => {
    const c = document.createElement('canvas'), s = Math.min(im.width, im.height); c.width = c.height = 240;
    c.getContext('2d').drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, 240, 240);
    S.photo = c.toDataURL('image/jpeg', .85); S.show.photo = 1; ui(); draw();
  }; im.src = r.result }; r.readAsDataURL(file);
}

/* ---------- AI: n8n proxy on the deployed site; Claude's built-in sample() inside the claude.ai demo ---------- */
const TBC = window.TB || {};
const say = m => { const e = $('#st'); if (e) e.textContent = m };
async function runAI(prompt) {
  const demo = window.claude && await window.claude.use('sample');
  if (demo) return (await demo(prompt)).text;
  if (!TBC.AI_ENDPOINT) throw new Error('AI is not configured yet (see the README)');
  const r = await fetch(TBC.AI_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status);
  return j.text || '';
}
async function ai() {
  const st = $('#st');
  const keys = S.tpl === 'cover' ? ['letter'] : active().length ? S.order[S.tpl].filter(x => x[1]).map(x => x[0]) : [];
  const prompt = `You are a careful career coach for university students. Document: ${NAMES[S.tpl]}. Student notes (JSON): ${JSON.stringify({ role: S.info.title, name: S.info.name, ...S.c })}
Rules: use ONLY facts in the notes. Never invent employers, numbers, dates or skills. Fix grammar, use strong past-tense action verbs, keep bullets under 20 words.
Return ONLY a JSON object with string keys: ${keys.map(k => '"' + k + '"').join(', ')}. Experience/projects/education/activities are blocks: first line "Role, Organisation, dates", then one bullet per line, blank line between blocks. "skills" is comma separated. "letter" is a 3-4 paragraph cover letter for "${S.c.company || 'the company'}" starting with a greeting and ending with the student's name.`;
  st.textContent = 'Polishing your words...';
  try {
const t = await runAI(prompt), o = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
    keys.forEach(k => { if (typeof o[k] === 'string' && o[k].trim()) S.c[k] = o[k].trim() });
    ui(); draw(); $('#st').textContent = 'Done. Read it carefully and fix anything untrue.';
  } catch (e) { st.textContent = 'AI request failed: ' + e.message }
}

/* ---------- form ---------- */
function ui() {
  const f = $('#bform'), cv = S.tpl !== 'cover', L = S.order[S.tpl];
  const row = k => `<div class="ir"><label>${INFO[k]}<input data-i="${k}" value="${esc(S.info[k])}"></label>${k === 'name' ? '' : `<label class="ck"><input type="checkbox" data-s="${k}" ${S.show[k] ? 'checked' : ''}>show</label>`}</div>`;
  const field = id => id === 'skills' ? `<label>Skills (comma separated)<input data-c="skills" value="${esc(S.c.skills)}"></label>`
    : `<label>${title(id)}${HINT[id] ? `<small style="font-weight:400;display:block;color:var(--muted)">${HINT[id]}</small>` : ''}<textarea data-c="${id}" style="min-height:${id === 'summary' ? 80 : 130}px">${esc(S.c[id])}</textarea></label>`;
  f.innerHTML = `<div class="seg" role="group" aria-label="Template">${Object.entries(NAMES).map(([k, v]) => `<button type="button" data-a="tpl" data-v="${k}" class="${k === S.tpl ? 'on' : ''}">${v}</button>`).join('')}</div>
<div class="bx"><h3>Style</h3><div class="row3"><label>Accent<input type="color" data-st="accent" value="${S.accent}"></label><label>Font<select data-st="font"><option value="sans" ${S.font === 'sans' ? 'selected' : ''}>Arial (recommended)</option><option value="serif" ${S.font === 'serif' ? 'selected' : ''}>Georgia (serif)</option></select></label><label>Size<select data-st="size"><option value="11" ${S.size == 11 ? 'selected' : ''}>11 pt</option><option value="12" ${S.size == 12 ? 'selected' : ''}>12 pt</option></select></label><label>Header<select data-st="align"><option value="left" ${S.align === 'left' ? 'selected' : ''}>Left</option><option value="center" ${S.align === 'center' ? 'selected' : ''}>Centred</option></select></label></div></div>
<div class="bx"><h3>Personal information</h3>${Object.keys(INFO).map(row).join('')}
<h3>Photo</h3><label class="ck"><input type="checkbox" data-s="photo" ${S.show.photo ? 'checked' : ''}>Include my photo in the document</label>
<label>Upload a photo (stays in your browser)<input type="file" id="photo" accept="image/*"></label>${S.photo ? `<p><img src="${S.photo}" alt="" width="64" height="64" style="border-radius:50%;vertical-align:middle"> <button type="button" class="btn sm" data-a="rmphoto">Remove photo</button></p>` : ''}</div>
${cv ? `<div class="bx"><h3>Section order</h3><ul class="ol">${L.map(([id, on], n) => `<li><label class="ck"><input type="checkbox" data-o="${n}" ${on ? 'checked' : ''}>${title(id)}</label><span><button type="button" class="mv" data-a="up" data-n="${n}" aria-label="Move ${title(id)} up">↑</button> <button type="button" class="mv" data-a="dn" data-n="${n}" aria-label="Move ${title(id)} down">↓</button></span></li>`).join('')}</ul></div>
<div class="bx"><h3>Content</h3>${L.filter(x => x[1]).map(x => field(x[0])).join('')}</div>`
    : `<div class="bx"><h3>Letter</h3><label>Recipient (optional)<input data-c="recipient" value="${esc(S.c.recipient)}"></label><label>Company<input data-c="company" value="${esc(S.c.company)}"></label><label>Why this company, and your best proof (notes for the AI)<textarea data-c="why">${esc(S.c.why)}</textarea></label><label>Letter<textarea data-c="letter" style="min-height:190px">${esc(S.c.letter)}</textarea></label></div>`}
<div class="bx"><h3>Export</h3><div class="btns">${[['pdf', 'PDF (print)'], ['doc', 'Word (.doc)'], ['html', 'HTML'], ['txt', 'Text'], ['md', 'Markdown']].map(([a, t]) => `<button type="button" class="btn sm pri" data-a="${a}">${t}</button>`).join('')}</div>
<div class="btns"><button type="button" class="btn sm" data-a="json">Save project (.json)</button><button type="button" class="btn sm" data-a="load">Load project</button><input type="file" id="jl" accept=".json" hidden></div></div>
<div class="btns"><button type="button" class="btn pri" data-a="ai">Improve with AI</button><button type="button" class="btn" data-a="ex">Load example</button><button type="button" class="btn" data-a="reset">Clear</button></div>
<div class="status" id="st" role="status"></div>
<p style="font-size:.85rem;color:var(--muted)">The AI button sends your text to a free AI model. Leave out anything sensitive.</p>
`;
}
const f = $('#bform');
f.addEventListener('input', e => { const t = e.target, d = t.dataset; if (d.i) S.info[d.i] = t.value; else if (d.c) S.c[d.c] = t.value; else if (d.st) S[d.st] = t.value; else return; draw() });
f.addEventListener('change', e => {
  const t = e.target, d = t.dataset;
  if (d.s) { S.show[d.s] = t.checked ? 1 : 0; draw() }
  else if (d.o !== undefined) { S.order[S.tpl][d.o][1] = t.checked ? 1 : 0; ui(); draw() }
  else if (t.id === 'photo') pickPhoto(t.files[0]);
  else if (t.id === 'jl' && t.files[0]) t.files[0].text().then(s => { try { S = merge(JSON.parse(s)); ui(); draw() } catch (x) { $('#st').textContent = 'That file is not a valid project file.' } });
});
f.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; const d = b.dataset, n = +d.n, L = S.order[S.tpl];
  if (d.a === 'up' && n > 0) [L[n - 1], L[n]] = [L[n], L[n - 1]];
  else if (d.a === 'dn' && n < L.length - 1) [L[n + 1], L[n]] = [L[n], L[n + 1]];
  else if (d.a === 'tpl') S.tpl = d.v;
  else if (d.a === 'rmphoto') { S.photo = ''; S.show.photo = 0 }
  else if (d.a === 'ai') { ai(); return }
  else if (X[d.a]) { X[d.a](); return }
  else return;
  ui(); draw();
});
ui(); draw();
})();
