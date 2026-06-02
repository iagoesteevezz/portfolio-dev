import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountFooter } from './components/footer.js';

gsap.registerPlugin(ScrollTrigger);

/* ─── Footer (global) ────────────────────────────────── */
mountFooter();

/* ─── Smooth scroll — Lenis (global) ────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* Force recalc once fonts + images are fully painted — prevents ghost opacity:0 */
window.addEventListener('load', () => { ScrollTrigger.refresh(); });

/* ─── Floating menu button — vars (global) ───────────── */
const menuBtn  = document.getElementById('menuBtn');
const btnInner = menuBtn.querySelector('.menu-btn__inner');
let isBtnVisible = false;
let magnetActive  = false;

const MAGNET_R = 90;
const OUT_STR  = 0.28;
const IN_STR   = 0.14;

gsap.set(menuBtn, { autoAlpha: 0, scale: 0 });

/* ─── Magnetic effect — menu button (global) ─────────── */
function getBtnCenter() {
  const rect = menuBtn.getBoundingClientRect();
  const gx   = gsap.getProperty(menuBtn, 'x') || 0;
  const gy   = gsap.getProperty(menuBtn, 'y') || 0;
  return { x: rect.left + rect.width / 2 - gx, y: rect.top + rect.height / 2 - gy };
}

document.addEventListener('mousemove', (e) => {
  if (!isBtnVisible) return;
  const c    = getBtnCenter();
  const dx   = e.clientX - c.x;
  const dy   = e.clientY - c.y;
  const dist = Math.hypot(dx, dy);

  if (dist < MAGNET_R) {
    magnetActive = true;
    gsap.to(menuBtn,  { x: dx * OUT_STR, y: dy * OUT_STR, duration: 0.5,  ease: 'power2.out', overwrite: 'auto' });
    gsap.to(btnInner, { x: dx * IN_STR,  y: dy * IN_STR,  duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
  } else if (magnetActive) {
    magnetActive = false;
    gsap.to(menuBtn,  { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    gsap.to(btnInner, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
  }
});

/* ─── Sidebar panel (global) ─────────────────────────── */
gsap.set('#sidebar',        { xPercent: 100 });
gsap.set('#sidebarOverlay', { autoAlpha: 0  });

const sidebarTl = gsap.timeline({ paused: true })
  .to('#sidebar',        { xPercent: 0, duration: 0.65, ease: 'power4.inOut' })
  .to('#sidebarOverlay', { autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, 0)
  .to(menuBtn,           { backgroundColor: '#3B82F6', duration: 0.25, ease: 'power2.inOut' }, 0)
  .to('.menu-btn__line:first-child', { y:  4, rotate:  45, duration: 0.25, ease: 'power2.inOut' }, 0)
  .to('.menu-btn__line:last-child',  { y: -4, rotate: -45, duration: 0.25, ease: 'power2.inOut' }, 0)
  .fromTo('.sidebar__link',
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

menuBtn.addEventListener('click', () => { isSidebarOpen ? closeSidebar() : openSidebar(); });
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
document.querySelectorAll('.sidebar__link').forEach((l) => l.addEventListener('click', closeSidebar));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isSidebarOpen) closeSidebar(); });

/* ─── Footer — curve + clock + reveals + magnetic ────── */

/* SVG arch flattens as footer scrolls into view (scrub) */
const curvePath = document.querySelector('.footer-curve__path');
if (curvePath) {
  ScrollTrigger.create({
    trigger: '.site-footer',
    start: 'top bottom',
    end: 'top center',
    scrub: 1.5,
    onUpdate(self) {
      const cy = gsap.utils.interpolate(300, 0, self.progress);
      curvePath.setAttribute('d', `M 0 0 Q 50 ${cy} 100 0 L 100 0 L 0 0 Z`);
    },
  });
}

/* Real-time clock — Canary Islands timezone */
function updateLocalTime() {
  const el = document.getElementById('local-time');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('en-US', {
    timeZone: 'Atlantic/Canary',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}
updateLocalTime();
setInterval(updateLocalTime, 1_000);

/* CTA block scroll reveals */
ScrollTrigger.create({
  trigger: '.site-footer',
  start: 'top 85%',
  onEnter: () => {
    gsap.from('.footer__cta-block',   { opacity: 0, y: 50,    duration: 1.1, ease: 'power3.out' });
    gsap.from('.footer__contact-btn', { opacity: 0, scale: 0, duration: 0.7, ease: 'back.out(1.7)', delay: 0.25 });
    gsap.from('.footer__bottom',      { opacity: 0, y: 20,    duration: 0.7, ease: 'power3.out', delay: 0.4 });
  },
  once: true,
});

/* "Get in touch" — magnetic effect (same physics as About me) */
const footerContactBtn = document.querySelector('.footer__contact-btn');
if (footerContactBtn) {
  let footerBtnMagnet = false;
  const FOOTER_R   = 120;
  const FOOTER_STR = 0.28;

  document.addEventListener('mousemove', (e) => {
    const rect = footerContactBtn.getBoundingClientRect();
    const gx   = gsap.getProperty(footerContactBtn, 'x') || 0;
    const gy   = gsap.getProperty(footerContactBtn, 'y') || 0;
    const cx   = rect.left + rect.width  / 2 - gx;
    const cy2  = rect.top  + rect.height / 2 - gy;
    const dx   = e.clientX - cx;
    const dy   = e.clientY - cy2;
    const dist = Math.hypot(dx, dy);

    if (dist < FOOTER_R) {
      footerBtnMagnet = true;
      gsap.to(footerContactBtn, { x: dx * FOOTER_STR, y: dy * FOOTER_STR, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    } else if (footerBtnMagnet) {
      footerBtnMagnet = false;
      gsap.to(footerContactBtn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    }
  });
}

/* ════════════════════════════════════════════════════════
   HERO PAGE — guard: only runs when .hero exists
   ════════════════════════════════════════════════════════ */
if (document.querySelector('.hero')) {

  /* ── Hero entrance ── */
  gsap.fromTo(
    ['.hero__occupation-text', '.hero__location'],
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.4, stagger: 0.1 }
  );

  /* ── Marquee with scroll-velocity reactivity ── */
  const marqueeTween = gsap.fromTo(
    '.marquee__track',
    { xPercent: -50 },
    { xPercent: 0, ease: 'none', duration: 10, repeat: -1 }
  );

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const v = self.getVelocity();
      if (Math.abs(v) <= 100) return;
      const ts = v > 0 ? Math.min(6, 1 + v / 400) : Math.max(-6, v / 400 - 1);
      gsap.to(marqueeTween, { timeScale: ts, duration: 0.5, ease: 'power2.out', overwrite: true });
    },
  });

  ScrollTrigger.addEventListener('scrollEnd', () => {
    gsap.to(marqueeTween, { timeScale: 1, duration: 1.5, ease: 'power3.out', overwrite: true });
  });

  /* ── Intro scroll reveal ── */
  gsap.from(['.intro__text', '.intro__about-btn'], {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: { trigger: '.intro', start: 'top 78%' },
  });

  /* ── Projects header ── */
  gsap.from('.projects__header', {
    opacity: 0, y: 20, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.projects', start: 'top 90%' },
  });

  /* ── Project rows — staggered reveal ── */
  gsap.from(gsap.utils.toArray('.project-row'), {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.projects__list',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });

  gsap.from('.btn-view-all', {
    opacity: 0, y: 24, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.view-all-wrap', start: 'top 90%' },
  });

  /* ── Nav active-indicator dot ── */
  const heroLinksEl = document.querySelector('.hero__links');
  const navLinks    = heroLinksEl.querySelectorAll('a');
  const navDot      = heroLinksEl.querySelector('.nav-dot');
  let   navDotVis   = false;

  gsap.set(navDot, { opacity: 0 });

  navLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const lR = link.getBoundingClientRect();
      const nR = heroLinksEl.getBoundingClientRect();
      const tx = lR.left - nR.left + lR.width / 2 - navDot.offsetWidth / 2;
      if (navDotVis) {
        gsap.to(navDot, { x: tx, opacity: 1, duration: 0.55, ease: 'expo.out' });
      } else {
        navDotVis = true;
        gsap.set(navDot, { x: tx });
        gsap.to(navDot,  { opacity: 1, duration: 0.35, ease: 'power2.out' });
      }
    });
  });

  heroLinksEl.addEventListener('mouseleave', () => {
    navDotVis = false;
    gsap.to(navDot, { opacity: 0, duration: 0.3, ease: 'power2.out' });
  });

  /* ── Brand logo — hover animation + magnetic ── */
  const brandEl     = document.querySelector('.hero__brand');
  const brandSymbol = brandEl.querySelector('.hero__brand-symbol');
  const brandTextA  = brandEl.querySelector('.hero__brand-text--a');
  const brandTextB  = brandEl.querySelector('.hero__brand-text--b');

  brandEl.addEventListener('mouseenter', () => {
    gsap.to(brandSymbol,              { rotation: 360, duration: 0.65, ease: 'power2.inOut', overwrite: true });
    gsap.to([brandTextA, brandTextB], { yPercent: -100, duration: 0.4, ease: 'power3.out',  overwrite: true });
  });

  brandEl.addEventListener('mouseleave', () => {
    gsap.set(brandSymbol, { rotation: 0 });
    gsap.to([brandTextA, brandTextB], { yPercent: 0, duration: 0.45, ease: 'power3.out', overwrite: true });
  });

  let   brandMagnetActive = false;
  const BRAND_R   = 80;
  const BRAND_STR = 0.15;

  document.addEventListener('mousemove', (e) => {
    const rect = brandEl.getBoundingClientRect();
    const gx   = gsap.getProperty(brandEl, 'x') || 0;
    const gy   = gsap.getProperty(brandEl, 'y') || 0;
    const cx   = rect.left + rect.width  / 2 - gx;
    const cy   = rect.top  + rect.height / 2 - gy;
    const dx   = e.clientX - cx;
    const dy   = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < BRAND_R) {
      brandMagnetActive = true;
      gsap.to(brandEl, { x: dx * BRAND_STR, y: dy * BRAND_STR, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    } else if (brandMagnetActive) {
      brandMagnetActive = false;
      gsap.to(brandEl, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    }
  });

  /* ── About me button — magnetic (same math, single element) ── */
  const aboutBtn = document.getElementById('aboutBtn');
  if (aboutBtn) {
    let   aboutMagnetActive = false;
    const ABOUT_R   = 110;
    const ABOUT_STR = 0.28;

    document.addEventListener('mousemove', (e) => {
      const rect = aboutBtn.getBoundingClientRect();
      const gx   = gsap.getProperty(aboutBtn, 'x') || 0;
      const gy   = gsap.getProperty(aboutBtn, 'y') || 0;
      const cx   = rect.left + rect.width  / 2 - gx;
      const cy   = rect.top  + rect.height / 2 - gy;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < ABOUT_R) {
        aboutMagnetActive = true;
        gsap.to(aboutBtn, { x: dx * ABOUT_STR, y: dy * ABOUT_STR, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
      } else if (aboutMagnetActive) {
        aboutMagnetActive = false;
        gsap.to(aboutBtn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
      }
    });
  }

  /* ── Cursor portfolio — strip-slider image reveal ── */
  const cursorPortfolio = document.querySelector('.cursor-portfolio');
  const cursorImgStrip  = document.querySelector('.cursor-img-strip');
  const projectRows     = document.querySelectorAll('.project-row');

  if (cursorPortfolio && cursorImgStrip && projectRows.length) {

    gsap.set(cursorPortfolio, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

    const xTo = gsap.quickTo(cursorPortfolio, 'x', { duration: 0.3, ease: 'power3' });
    const yTo = gsap.quickTo(cursorPortfolio, 'y', { duration: 0.3, ease: 'power3' });

    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    projectRows.forEach((row, index) => {
      row.addEventListener('mouseenter', () => {
        gsap.to(cursorImgStrip,  { yPercent: -100 * index, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(cursorPortfolio, { scale: 1, opacity: 1,   duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
      });

      row.addEventListener('mouseleave', () => {
        gsap.to(cursorPortfolio, { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      });
    });
  }

  /* ── Menu button — appears when hero leaves viewport ── */
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom 5%',
    onEnter: () => {
      isBtnVisible = true;
      gsap.to(menuBtn, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
    },
    onLeaveBack: () => {
      isBtnVisible = false;
      magnetActive  = false;
      gsap.to(menuBtn, { autoAlpha: 0, scale: 0, duration: 0.3, ease: 'power2.in' });
      gsap.set([menuBtn, btnInner], { x: 0, y: 0 });
    },
  });

} else {
  /* No hero — show menu button immediately (works.html + future pages) */
  isBtnVisible = true;
  gsap.to(menuBtn, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.3 });
}

/* ════════════════════════════════════════════════════════
   WORKS PAGE — guard: only runs when .works-page exists
   ════════════════════════════════════════════════════════ */
if (document.querySelector('.works-page')) {

  gsap.from('.works-title', {
    opacity: 0, y: 50, duration: 1.1, ease: 'power3.out', delay: 0.2,
  });

  gsap.utils.toArray('.work-item').forEach((item) => {
    const head  = item.querySelector('.work-item__head');
    const name  = item.querySelector('.work-name');
    const stack = item.querySelector('.work-stack');
    const img   = item.querySelector('.work-img-wrap');

    gsap.from([head, name, stack, img].filter(Boolean), {
      opacity: 0, y: 60, duration: 1.1, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: item, start: 'top 82%', toggleActions: 'play none none none' },
    });
  });
}
