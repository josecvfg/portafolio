// ==========================================================================
// JOSE VILLARREAL — PORTFOLIO — comportamiento compartido
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-enter');

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = (i % 4) * 70;
    io.observe(el);
  });

  /* ---------- magnetismo en botones ---------- */
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
  });

  /* ---------- reloj en vivo (hora de México) ---------- */
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const tick = () => {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Hermosillo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      clock.textContent = fmt.format(now) + ' MST';
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- contadores numéricos ---------- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const dur = 1200;
          const start = performance.now();
          const step = (t) => {
            const p = Math.min((t - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target < 10 && target % 1 !== 0 ? (target * eased).toFixed(1) : Math.floor(target * eased);
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          counterIO.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counterIO.observe(el);
  });

  /* ---------- transición entre páginas internas ---------- */
  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  document.body.appendChild(curtain);
  document.querySelectorAll('a[data-transition]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank') return;
      e.preventDefault();
      curtain.classList.add('leaving');
      setTimeout(() => { window.location.href = href; }, 460);
    });
  });

  /* ---------- efecto de escritura (boot sequence) ---------- */
  document.querySelectorAll('[data-typewriter]').forEach((el) => {
    const lines = JSON.parse(el.dataset.typewriter);
    el.innerHTML = '';
    let li = 0;
    function typeLine() {
      if (li >= lines.length) { el.classList.add('done'); return; }
      const lineEl = document.createElement('div');
      lineEl.className = 'boot-line';
      el.appendChild(lineEl);
      const text = lines[li];
      let ci = 0;
      const speed = 18;
      (function typeChar() {
        if (ci <= text.length) {
          lineEl.textContent = text.slice(0, ci);
          ci++;
          setTimeout(typeChar, speed);
        } else {
          li++;
          setTimeout(typeLine, 220);
        }
      })();
    }
    typeLine();
  });
});
