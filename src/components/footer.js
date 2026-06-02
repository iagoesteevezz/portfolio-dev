export function mountFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';

  footer.innerHTML = `
    <div class="footer-curve" aria-hidden="true">
      <svg viewBox="0 0 100 300" preserveAspectRatio="none">
        <path class="footer-curve__path" fill="#0a0a0a"
              d="M 0 0 Q 50 300 100 0 L 100 0 L 0 0 Z"/>
      </svg>
    </div>

    <div class="footer__inner">

      <div class="footer__main">
        <div class="footer__cta-block">
          <h2 class="footer__cta-text">
            <div class="footer__title-row">
              <img src="/assets/iago-cara.png" class="footer__avatar" alt="Iago">
              <span>Let's work</span>
            </div>
            <div>together</div>
          </h2>
          <div class="footer__pills">
            <a href="mailto:iagoesteevezz@gmail.com" class="footer__pill">
              <span>iagoesteevezz@gmail.com</span>
            </a>
            <a href="tel:+34660552864" class="footer__pill">
              <span>+34 660 552 864</span>
            </a>
          </div>
        </div>
        <div class="footer__cta-right">
          <svg class="footer__arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                  d="M17 7L7 17M7 17H17M7 17V7"/>
          </svg>
          <a href="contact.html" class="footer__contact-btn" aria-label="Get in touch">
            <span class="footer__contact-btn-text">Get in<br>touch</span>
          </a>
        </div>
      </div>

      <div class="footer__bottom">
        <div class="footer__bottom-left">
          <div class="footer__bottom-item">
            <span class="footer__bottom-label">VERSION</span>
            <span class="footer__bottom-value">2026 © Edition</span>
          </div>
          <div class="footer__bottom-item">
            <span class="footer__bottom-label">LOCAL TIME</span>
            <span class="footer__bottom-value" id="local-time">--:--</span>
          </div>
        </div>
        <div class="footer__bottom-item">
          <span class="footer__bottom-label">SOCIALS</span>
          <div class="footer__social-links">
            <a href="https://linkedin.com/in/iagoestevez" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/iagoesteevezz" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(footer);
}
