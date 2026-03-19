/* ── Preloader ──────────────────────────────────────── */
let prog = 0;
const progEl = document.getElementById('progress');
const preloader = document.getElementById('preloader');

const ticker = setInterval(() => {
  prog += Math.random() * 18;
  if (prog >= 100) {
    prog = 100;
    clearInterval(ticker);
    progEl.textContent = '100%';
    setTimeout(showSite, 400);
  } else {
    progEl.textContent = Math.floor(prog) + '%';
  }
}, 80);

function showSite() {
  preloader.classList.add('out');
  document.body.classList.remove('no-scroll');
  splitAndAnimate();
  animAllCounters();
}

/* ── Character split & animate ─────────────────────── */
function splitAndAnimate() {
  const title = document.getElementById('hello-title');
  if(!title) return;
  title.querySelectorAll('span:not(.font-sec)').forEach(span => {
    const txt = span.textContent;
    span.innerHTML = txt.split('').map((c, i) =>
      `<span class="char" style="animation-delay:${.35 + i * .045}s">${c}</span>`
    ).join('');
  });
  const serif = title.querySelector('.font-sec');
  const stxt = serif.textContent;
  serif.innerHTML = stxt.split('').map((c, i) =>
    `<span class="char" style="animation-delay:${.15 + i * .045}s">${c}</span>`
  ).join('');
  title.classList.add('go');
}

/* ── Menu toggle ────────────────────────────────────── */
const menu = document.getElementById('menu');
const menuMobile = document.getElementById('menu-mobile');
const burger = document.getElementById('burger');
const toggle = document.getElementById('menu-toggle');

function openMenu() {
  const isMobile = window.innerWidth < 640;
  if (isMobile) menuMobile.classList.add('open');
  else menu.classList.add('open');
  document.body.classList.add('menu-open', 'no-scroll');
}
function closeMenu() {
  menu.classList.remove('open');
  menuMobile.classList.remove('open');
  document.body.classList.remove('menu-open', 'no-scroll');
}

toggle.addEventListener('click', () => {
  menu.classList.contains('open') || menuMobile.classList.contains('open')
    ? closeMenu() : openMenu();
});
burger.addEventListener('click', () => {
  menuMobile.classList.contains('open') ? closeMenu() : openMenu();
});

/* ── Menu links: transition overlay + close ─────────── */
const transition = document.getElementById('transition');
const tLabel = document.getElementById('t-label');

document.querySelectorAll('.menu-link[data-label], .mm-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const label = link.dataset.label || link.textContent.trim();
    const href = link.getAttribute('href');
    closeMenu();
    tLabel.innerHTML = `<span class="si">${label[0]}</span>${label.slice(1)}`;
    transition.classList.add('show');
    setTimeout(() => {
      transition.classList.remove('show');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 700);
  });
});

/* ── Scroll reveal ──────────────────────────────────── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.id === 'tri') animCounters(e.target);
    obs.unobserve(e.target);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.r').forEach(el => obs.observe(el));

/* ── Project expand on click ────────────────────────── */
document.querySelectorAll('.pi').forEach(row => {
  row.addEventListener('click', () => row.classList.toggle('open'));
});

/* ── Filter ─────────────────────────────────────────── */
document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.f;
    document.querySelectorAll('.pi').forEach(row => {
      const match = f === 'all' || row.dataset.tags.split(',').includes(f);
      row.style.display = match ? '' : 'none';
    });
  });
});

/* ── Triathlon Counters Animation ───────────────────── */
function animAllCounters() {
  document.querySelectorAll('.bc-tri-v[data-count]').forEach(el => {
    runCount(el);
  });
}

function animCounters(parent) {
  parent.querySelectorAll('[data-count]').forEach(el => {
    runCount(el);
  });
}

function runCount(el) {
  const target = +el.dataset.count;
  const duration = 2000;
  const startTime = performance.now();
  
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * ease);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}