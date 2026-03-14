// ── Animated background: floating code symbols + pulsing dots ──

const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

const SYMS = [
  '{  }', '( )', '[ ]', '=>',  '//',  '&&',  '**',
  '</>', '++',  '===', 'def', 'let', 'async','await',
  'import','return','class','for','try','λ','∑','∞','01','10'
];

const COLS = [
  'rgba(201,168,76,',   // gold
  'rgba(184,169,255,',  // lavender
  'rgba(126,232,200,',  // mint
  'rgba(126,200,227,',  // sky
  'rgba(255,255,255,'   // white
];

let W, H, parts = [], dots = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function mkParticle() {
  const c = COLS[Math.random() * COLS.length | 0];
  return {
    x:  Math.random() * W,
    y:  H + 20,
    sym: SYMS[Math.random() * SYMS.length | 0],
    vy: 0.18 + Math.random() * 0.38,
    vx: (Math.random() - 0.5) * 0.22,
    a:  0,
    ma: 0.06 + Math.random() * 0.1,
    sz: 9 + Math.random() * 7,
    c
  };
}

function mkDot() {
  const c = COLS[Math.random() * COLS.length | 0];
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: 1 + Math.random() * 2.2,
    a: Math.random() * 0.2,
    p: 0.003 + Math.random() * 0.005,
    d: 1,
    c
  };
}

function init() {
  resize();
  for (let i = 0; i < 40; i++) {
    const p = mkParticle();
    p.y = Math.random() * H;
    p.a = p.ma;
    parts.push(p);
  }
  for (let i = 0; i < 60; i++) {
    dots.push(mkDot());
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Pulsing dots
  dots.forEach(d => {
    d.a += d.p * d.d;
    if (d.a > 0.24 || d.a < 0.015) d.d *= -1;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = d.c + d.a + ')';
    ctx.fill();
  });

  // Floating code symbols
  parts.forEach((p, i) => {
    p.y -= p.vy;
    p.x += p.vx;
    if (p.y < -25) { parts[i] = mkParticle(); return; }
    p.a = Math.min(p.a + 0.002, p.ma);
    ctx.save();
    ctx.globalAlpha = p.a;
    ctx.font = `${p.sz}px 'DM Mono', monospace`;
    ctx.fillStyle = p.c + '1)';
    ctx.fillText(p.sym, p.x, p.y);
    ctx.restore();
  });

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
init();
draw();
