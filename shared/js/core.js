/* ── PROGRESS BAR ────────────────────────────────────────────────── */
export function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });
}

/* ── ANIMATED COUNTER ────────────────────────────────────────────── */
export function animateCounter(el, target, duration = 1800, prefix = '', suffix = '') {
  const isApprox = prefix.includes('~');
  const cleanPrefix = prefix.replace('~', '');
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = (isApprox ? '~' : '') + cleanPrefix + value + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target + suffix;
  };
  requestAnimationFrame(update);
}

/* ── INTERSECTION OBSERVER HELPER ────────────────────────────────── */
export function onEnterViewport(selector, callback, options = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        if (!options.repeat) observer.unobserve(entry.target);
      }
    });
  }, { threshold: options.threshold || 0.3, ...options });
  els.forEach(el => observer.observe(el));
}

/* ── STAGGER CHILDREN ────────────────────────────────────────────── */
export function staggerReveal(parentSelector, childSelector, delay = 150) {
  onEnterViewport(parentSelector, (parent) => {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, i) => {
      setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, i * delay);
    });
  });
}
