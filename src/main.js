import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountFooter } from './components/footer.js';

gsap.registerPlugin(ScrollTrigger);

/* ─── Footer ─────────────────────────────────────────── */
mountFooter();

/* ─── Smooth scroll (Lenis) ──────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

/* Share Lenis RAF with GSAP ticker — keeps ScrollTrigger in sync */
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ─── Hero — entrance ────────────────────────────────── */
gsap.fromTo(
  ['.hero__occupation-text', '.hero__location'],
  { opacity: 0, y: 16 },
  { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.4, stagger: 0.1 }
);

/* ─── Marquee — infinite LTR loop with scroll reactivity ── */
/*
  8 items = 2 identical sets of 4. GSAP animates the track from
  xPercent: -50 → 0, repeating seamlessly.
  timeScale is driven by ScrollTrigger velocity:
    scroll down  → accelerate forward (timeScale > 1)
    scroll up    → reverse + accelerate (timeScale < -1)
    scroll stops → ease back to timeScale 1
*/
const marqueeTween = gsap.fromTo(
  '.marquee__track',
  { xPercent: -50 },
  {
    xPercent: 0,
    ease: 'none',
    duration: 10,
    repeat: -1,
  }
);

ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate(self) {
    const v = self.getVelocity();
    let targetScale;

    if (v > 100) {
      targetScale = Math.min(6, 1 + v / 400);
    } else if (v < -100) {
      targetScale = Math.max(-6, v / 400 - 1);
    } else {
      return;
    }

    gsap.to(marqueeTween, {
      timeScale: targetScale,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: true,
    });
  },
});

ScrollTrigger.addEventListener('scrollEnd', () => {
  gsap.to(marqueeTween, {
    timeScale: 1,
    duration: 1.5,
    ease: 'power3.out',
    overwrite: true,
  });
});

/* ─── Intro — scroll reveal ──────────────────────────── */
gsap.from('.intro__text', {
  opacity: 0,
  y: 50,
  duration: 1.1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.intro',
    start: 'top 80%',
  },
});

/* ─── Projects header ────────────────────────────────── */
gsap.from('.projects__header', {
  opacity: 0,
  y: 20,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.projects',
    start: 'top 88%',
  },
});

/* ─── Project items — staggered child reveal ─────────── */
/*
  Top row → image → bottom row animate in sequence so the card
  feels like it assembles itself as it enters the viewport.
*/
gsap.utils.toArray('.project-item').forEach((item) => {
  const top    = item.querySelector('.project-item__top');
  const img    = item.querySelector('.project-img-wrap');
  const bottom = item.querySelector('.project-item__bottom');

  gsap.from([top, img, bottom], {
    opacity: 0,
    y: 55,
    duration: 1.05,
    ease: 'power3.out',
    stagger: 0.14,
    scrollTrigger: {
      trigger: item,
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
  });
});

/* ─── View All button ────────────────────────────────── */
gsap.from('.btn-view-all', {
  opacity: 0,
  y: 24,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.view-all-wrap',
    start: 'top 90%',
  },
});

/* ─── Footer CTA ─────────────────────────────────────── */
/* Runs after mountFooter() has appended the element to the DOM */
ScrollTrigger.create({
  trigger: '.site-footer',
  start: 'top 85%',
  onEnter: () => {
    gsap.from('.footer__cta p', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1,
    });
    gsap.from(['.footer__contacts', '.footer__social', '.footer__bottom'], {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      delay: 0.2,
    });
  },
  once: true,
});

/* ─── Nav active-indicator dot ─────────────────────────── */
/*
  A 5px circle that slides horizontally under whichever top-nav link
  is currently hovered. Position is computed live from getBoundingClientRect
  so it works at any viewport width.
*/
const heroLinksEl = document.querySelector('.hero__links');
const navLinks    = heroLinksEl.querySelectorAll('a');
const navDot      = heroLinksEl.querySelector('.nav-dot');
let   navDotVisible = false;

gsap.set(navDot, { opacity: 0 });

navLinks.forEach((link) => {
  link.addEventListener('mouseenter', () => {
    const lRect   = link.getBoundingClientRect();
    const nRect   = heroLinksEl.getBoundingClientRect();
    const targetX = lRect.left - nRect.left + lRect.width / 2 - navDot.offsetWidth / 2;

    if (navDotVisible) {
      // Subsequent hovers: slide with expo ease
      gsap.to(navDot, { x: targetX, opacity: 1, duration: 0.55, ease: 'expo.out' });
    } else {
      // First appearance: snap to position then fade in (no fly-in from left)
      navDotVisible = true;
      gsap.set(navDot, { x: targetX });
      gsap.to(navDot, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
  });
});

heroLinksEl.addEventListener('mouseleave', () => {
  navDotVisible = false;
  gsap.to(navDot, { opacity: 0, duration: 0.3, ease: 'power2.out' });
});

/* ─── Floating menu button ─────────────────────────────── */
const menuBtn  = document.getElementById('menuBtn');
const btnInner = menuBtn.querySelector('.menu-btn__inner');

let isBtnVisible = false;
let magnetActive = false;

const MAGNET_R = 90;    // attraction zone radius in px
const OUT_STR  = 0.28;  // outer circle follows at 28% of cursor offset
const IN_STR   = 0.14;  // inner icon moves 14% relative to its parent
                         // → at 90px dx: outer=25px, inner=12.6px from btn centre (radius≈30px)

gsap.set(menuBtn, { autoAlpha: 0, scale: 0 });

ScrollTrigger.create({
  trigger: '.hero',
  start: 'bottom 5%',
  onEnter: () => {
    isBtnVisible = true;
    gsap.to(menuBtn, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
  },
  onLeaveBack: () => {
    isBtnVisible = false;
    magnetActive = false;
    gsap.to(menuBtn, { autoAlpha: 0, scale: 0, duration: 0.3, ease: 'power2.in' });
    // Reset magnetic offsets instantly so button re-appears clean next time
    gsap.set([menuBtn, btnInner], { x: 0, y: 0 });
  },
});

/* ─── Magnetic button effect ───────────────────────────── */
/*
  The button's natural (un-transformed) center is derived by subtracting
  GSAP's current x/y transform from getBoundingClientRect(), so the
  attraction zone always refers to where the button visually "lives",
  not where GSAP has dragged it to.
*/
function getBtnCenter() {
  const rect = menuBtn.getBoundingClientRect();
  const gx   = gsap.getProperty(menuBtn, 'x') || 0;
  const gy   = gsap.getProperty(menuBtn, 'y') || 0;
  return {
    x: rect.left + rect.width  / 2 - gx,
    y: rect.top  + rect.height / 2 - gy,
  };
}

document.addEventListener('mousemove', (e) => {
  if (!isBtnVisible) return;

  const c    = getBtnCenter();
  const dx   = e.clientX - c.x;
  const dy   = e.clientY - c.y;
  const dist = Math.hypot(dx, dy);

  if (dist < MAGNET_R) {
    magnetActive = true;

    // Outer circle — slow, gentle follow
    gsap.to(menuBtn, {
      x: dx * OUT_STR,
      y: dy * OUT_STR,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    // Inner icon — faster, goes further — creates the 3-D parallax feel
    gsap.to(btnInner, {
      x: dx * IN_STR,
      y: dy * IN_STR,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  } else if (magnetActive) {
    magnetActive = false;

    // Elastic snap-back when cursor leaves the attraction zone
    gsap.to(menuBtn, {
      x: 0, y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
    gsap.to(btnInner, {
      x: 0, y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  }
});

/* ─── Sidebar panel ────────────────────────────────────── */
/*
  sidebarTl animates:
    - sidebar xPercent (slide)
    - overlay opacity
    - menuBtn backgroundColor  → outer circle only, no x/y conflict
    - .menu-btn__line rotate + y → individual lines only, no conflict with
      .menu-btn__inner x/y from magnetic effect
  All three interactions live on separate elements / properties.
*/
gsap.set('#sidebar', { xPercent: 100 });
gsap.set('#sidebarOverlay', { autoAlpha: 0 });

const sidebarTl = gsap.timeline({ paused: true })
  .to('#sidebar', { xPercent: 0, duration: 0.65, ease: 'power4.inOut' })
  .to('#sidebarOverlay', { autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, 0)
  .to(menuBtn, { backgroundColor: '#3B82F6', duration: 0.25, ease: 'power2.inOut' }, 0)
  .to('.menu-btn__line:first-child', { y: 4, rotate: 45, duration: 0.25, ease: 'power2.inOut' }, 0)
  .to('.menu-btn__line:last-child',  { y: -4, rotate: -45, duration: 0.25, ease: 'power2.inOut' }, 0)
  .fromTo(
    '.sidebar__link',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
    '-=0.2'
  );

let isSidebarOpen = false;

function openSidebar() {
  isSidebarOpen = true;
  lenis.stop();
  sidebarTl.play();
  document.getElementById('sidebar').setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn.setAttribute('aria-label', 'Close menu');
}

function closeSidebar() {
  isSidebarOpen = false;
  lenis.start();
  sidebarTl.reverse();
  document.getElementById('sidebar').setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
}

menuBtn.addEventListener('click', () => {
  isSidebarOpen ? closeSidebar() : openSidebar();
});
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
document.querySelectorAll('.sidebar__link').forEach((link) => {
  link.addEventListener('click', closeSidebar);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isSidebarOpen) closeSidebar();
});
