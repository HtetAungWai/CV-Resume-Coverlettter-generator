/* Starfield with a hyperspace jump on tab change, scroll reveals and a scroll-progress saber */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  // scroll progress
  const prog = () => root.style.setProperty('--sp', Math.min(1, scrollY / Math.max(1, root.scrollHeight - innerHeight)).toFixed(3));
  addEventListener('scroll', prog, { passive: true }); prog();
  // reveal on scroll (classes are added by JS, so content is never hidden without it)
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }), { threshold: .12 });
    document.querySelectorAll('.card,.do,.dont,.acc details,.tw,.callout,.toc li,.meter,.crawl,.paper:not(#pv)').forEach(el => { el.classList.add('rv'); io.observe(el) });
    addEventListener('hashchange', () => document.querySelectorAll('.rv.in').forEach(el => el.classList.remove('in')));
  }
  // starfield
  const c = document.getElementById('stars'), x = c && c.getContext && c.getContext('2d');
  if (!x) return;
  let W, H, S = [], warp = 0, mx = 0, my = 0, run = false;
  const init = () => { W = c.width = innerWidth; H = c.height = innerHeight; S = Array.from({ length: Math.round(W * H / 8500) }, () => ({ x: Math.random() * W - W / 2, y: Math.random() * H - H / 2, z: Math.random() * .9 + .1 })); if (!run) frame() };
  addEventListener('resize', init);
  addEventListener('pointermove', e => { mx = e.clientX / W - .5; my = e.clientY / H - .5 }, { passive: true });
  window.hyperspace = () => { if (reduce) return; warp = 1; if (!run) frame() };
  function frame() {
    run = true; x.clearRect(0, 0, W, H);
    for (const s of S) {
      const k = s.z, px = s.x + W / 2 - mx * 28 * k, py = s.y + H / 2 - my * 28 * k;
      if (warp > .03) { const a = Math.atan2(s.y, s.x), L = warp * 130 * k; x.strokeStyle = `rgba(170,215,255,${.25 + .6 * k})`; x.lineWidth = k * 1.7; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * L, py + Math.sin(a) * L); x.stroke() }
      else { x.fillStyle = `rgba(255,255,255,${.25 + .75 * k})`; x.fillRect(px, py, k * 2.1, k * 2.1) }
      if (!reduce) { s.y += k * .05; if (s.y > H / 2) s.y = -H / 2 }
    }
    warp *= .94;
    if (!reduce || warp > .03) requestAnimationFrame(frame); else run = false;
  }
  init();
})();
