// ── GSAP + ScrollTrigger loaded via CDN in HTML ───────────────────
gsap.registerPlugin(ScrollTrigger);

// ── PROGRESS BAR ─────────────────────────────────────────────────
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
}, { passive: true });

// ── HERO ENTRANCE ─────────────────────────────────────────────────
function initHero() {
  // Split tagline into word spans for stagger
  const tagline = document.querySelector('.hero__tagline');
  if (tagline) {
    tagline.innerHTML = tagline.textContent.trim().split(' ')
      .map(w => `<span class="hero__word">${w}</span>`).join(' ');
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 1 — Logo materialises: desblur + rise + scale
  tl.to('.hero__logo', {
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
      duration: 1.3, delay: 0.5, ease: 'power2.out',
    })
    // 2 — Line grows from center
    .to('.hero__line', {
      scaleX: 1, duration: 0.9, ease: 'power2.inOut',
    }, '-=0.5')
    // 3 — Words drop in with stagger
    .to('.hero__word', {
      opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out',
    }, '-=0.4')
    // 4 — Scroll hint appears
    .to('.scroll-hint', { opacity: 0.45, duration: 0.6 }, '-=0.1');

  // Subtle continuous breath on the line (barely perceptible)
  gsap.to('.hero__line', {
    scaleX: 1.1,
    duration: 3,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: 2.8,
  });

  // Fade out scroll hint on first scroll
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      gsap.to(scrollHint, { opacity: 0, duration: 0.4, onComplete: () => scrollHint.remove() });
    }, { passive: true, once: true });
  }
}

// ── SECTION 2: INSIGHT CARDS ──────────────────────────────────────
function initInsight() {
  const cards = document.querySelectorAll('.insight-card');
  cards.forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      delay: i * 0.12,
    });
  });

  // Headline pins while cards scroll into view — only on desktop
  if (window.innerWidth > 900) {
    ScrollTrigger.create({
      trigger: '#section-insight',
      start: 'top top',
      end: 'bottom bottom',
      pin: '.insight-left',
      pinSpacing: false,
    });
  }
}

// ── SECTION 3: ANIMATED COUNTERS ─────────────────────────────────
function animateCounter(el, targetStr, duration = 1600) {
  // parse prefix/suffix from strings like "~60", "1h+", "0"
  const raw = targetStr.trim();
  let prefix = '', suffix = '', numStr = raw;

  if (raw.startsWith('~')) { prefix = '~'; numStr = raw.slice(1); }
  if (raw.startsWith('+')) { prefix = '+'; numStr = raw.slice(1); }
  if (numStr.endsWith('%')) { suffix = '%'; numStr = numStr.slice(0, -1); }
  if (numStr.endsWith('+')) { suffix = '+'; numStr = numStr.slice(0, -1); }
  if (numStr.endsWith('h')) { suffix = 'h' + suffix; numStr = numStr.slice(0, -1); }

  const target = parseFloat(numStr) || 0;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(eased * target);
    el.textContent = prefix + val + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = raw;
  };
  requestAnimationFrame(tick);
}

function initCounters() {
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    const numEl = card.querySelector('.stat-card__number');
    if (!numEl) return;
    const target = numEl.dataset.target;
    let triggered = false;
    ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      onEnter: () => {
        if (!triggered) { triggered = true; animateCounter(numEl, target); }
      },
    });
  });
}

// ── SECTION 4: QUESTION POINTS ───────────────────────────────────
function initQuestion() {
  const points = document.querySelectorAll('.question-point');
  points.forEach((pt, i) => {
    ScrollTrigger.create({
      trigger: pt,
      start: 'top 85%',
      onEnter: () => {
        setTimeout(() => pt.classList.add('visible'), i * 180);
      },
    });
  });

  // Headline entrance
  gsap.from('#section-question .question-headline', {
    opacity: 0, y: 30, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '#section-question', start: 'top 70%' },
  });
}

// ── SECTION 5: DEMO — Teams screenshot scroll ─────────────────────
function initDemo() {
  // Scenario items stagger in
  const items = document.querySelectorAll('.scenario-item');
  items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: '#section-demo',
      start: 'top 60%',
      onEnter: () => {
        setTimeout(() => item.classList.add('visible'), i * 200);
      },
    });
  });

  // Scroll the Teams screenshot image slowly as user scrolls
  const screen = document.querySelector('.teams-mockup__screen');
  const img = screen?.querySelector('img');
  if (screen && img) {
    ScrollTrigger.create({
      trigger: '#section-demo',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const offset = self.progress * (img.offsetHeight - screen.offsetHeight) * 0.7;
        img.style.transform = `translateY(-${Math.max(0, offset)}px)`;
      },
    });
  }
}

// ── SECTION 6: GOVERNANCE CARDS ──────────────────────────────────
function initGovernance() {
  const cards = document.querySelectorAll('.pillar-card');
  cards.forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      x: i % 2 === 0 ? -30 : 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 82%' },
    });
  });
}

// ── SECTION 7: EXPERIMENT COUNTERS ───────────────────────────────
function initExperiment() {
  const expCards = document.querySelectorAll('.exp-card');
  expCards.forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 40, duration: 0.7, ease: 'power2.out',
      delay: i * 0.15,
      scrollTrigger: { trigger: '#section-experiment', start: 'top 72%' },
    });

    const numEl = card.querySelector('.exp-card__num');
    if (!numEl) return;
    const target = numEl.dataset.target;
    let triggered = false;
    ScrollTrigger.create({
      trigger: card,
      start: 'top 78%',
      onEnter: () => {
        if (!triggered) { triggered = true; animateCounter(numEl, target, 1200); }
      },
    });
  });
}

// ── SECTION 8: DECISION ───────────────────────────────────────────
function initDecision() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-decision',
      start: 'top 60%',
      toggleActions: 'play none none none',
    },
  });
  tl.from('.decision-left__headline', { opacity: 0, y: 30, duration: 0.9, ease: 'power2.out' })
    .from('.decision-left__sub', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
    .from('.decision-right__ask', { opacity: 0, y: 20, duration: 0.7 }, '-=0.6')
    .from('.criteria-item', { opacity: 0, x: 20, duration: 0.5, stagger: 0.15 }, '-=0.4')
    .from('.decision-cta', { opacity: 0, y: 15, duration: 0.6 }, '-=0.2');
}

// ── SECTION 9: CLOSE ─────────────────────────────────────────────
function initClose() {
  // Pin the close section and fade in
  gsap.from('#section-close .close-tagline', {
    opacity: 0, y: 40, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '#section-close', start: 'top 65%' },
  });
  gsap.from('#section-close .close-meta', {
    opacity: 0, duration: 0.8, delay: 0.4,
    scrollTrigger: { trigger: '#section-close', start: 'top 65%' },
  });
}

// ── INIT ALL ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initInsight();
  initCounters();
  initQuestion();
  initDemo();
  initGovernance();
  initExperiment();
  initDecision();
  initClose();
});
