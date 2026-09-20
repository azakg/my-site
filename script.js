const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const year = document.querySelector('#year');

year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Lightweight animated network background. Decorative only.
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let nodes = [];
let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.max(28, Math.min(74, Math.floor(width / 24)));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - .5) * .14,
    vy: (Math.random() - .5) * .14,
    r: Math.random() * 1.15 + .45
  }));
}

function frame() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    if (!reduceMotion) {
      a.x += a.vx; a.y += a.vy;
      if (a.x < -20 || a.x > width + 20) a.vx *= -1;
      if (a.y < -20 || a.y > height + 20) a.vy *= -1;
    }
    ctx.beginPath();
    ctx.fillStyle = 'rgba(129, 220, 211, .34)';
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    ctx.fill();
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 145) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(102, 162, 168, ${0.08 * (1 - dist / 145)})`;
        ctx.lineWidth = .7;
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }
  if (!reduceMotion) requestAnimationFrame(frame);
}

window.addEventListener('resize', resize);
resize();
frame();
