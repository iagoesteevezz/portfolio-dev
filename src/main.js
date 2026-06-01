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
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ─── Hero — entrance ────────────────────────────────── */
/* Role text fades in over the background photo */
gsap.fromTo(
  '.hero__role-text',
  { opacity: 0, y: 16 },
  { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 }
);

/* ─── Marquee — infinite LTR loop ───────────────────── */
/*
  8 items = 2 identical sets of 4. GSAP animates the track from
  xPercent: -50 (second set visible) → xPercent: 0 (first set visible).
  On repeat, GSAP snaps back to -50% invisibly, creating a seamless loop.
  Direction: text enters from the left, exits to the right (LTR).
*/
gsap.fromTo(
  '.marquee__track',
  { xPercent: -50 },
  {
    xPercent: 0,
    ease: 'none',
    duration: 24,
    repeat: -1,
  }
);

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
