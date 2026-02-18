'use strict';

/* ─── CUSTOM CURSOR ──────────────────────────────────── */
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function lerpRing() {
  ringX += (mouseX - ringX) * 0.11;
  ringY += (mouseY - ringY) * 0.11;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(lerpRing);
})();

document.querySelectorAll('a, button, .cap-item, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hovering');
    cursorRing.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hovering');
    cursorRing.classList.remove('hovering');
  });
});

/* ─── SCROLL PROGRESS ────────────────────────────────── */
const scrollBar = document.getElementById('scrollBar');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docH      = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
}

/* ─── NAVIGATION ─────────────────────────────────────── */
const nav       = document.getElementById('nav');
let lastScrollY = 0;
let ticking     = false;

function updateNav() {
  const sy = window.scrollY;
  nav.classList.toggle('scrolled',    sy > 60);
  if (sy > lastScrollY + 8 && sy > 200) nav.classList.add('hidden-nav');
  else if (sy < lastScrollY - 8)         nav.classList.remove('hidden-nav');
  lastScrollY = sy;
  ticking = false;
}

window.addEventListener('scroll', () => {
  updateScrollProgress();
  if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
}, { passive: true });

/* ─── SMOOTH SCROLL ──────────────────────────────────── */
function closeMobileMenu() {
  navToggle.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      nav.classList.remove('hidden-nav');
      closeMobileMenu();
    }
  });
});

/* ─── MOBILE MENU ────────────────────────────────────── */
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* ─── SCROLL REVEAL ──────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ─── HERO MOUSE PARALLAX ────────────────────────────── */
const heroRadial = document.getElementById('heroRadial');
document.addEventListener('mousemove', (e) => {
  const xPct = (e.clientX / window.innerWidth  - 0.5) * 2;
  const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
  heroRadial.style.transform = `translate(${xPct * 20}px, ${yPct * 14}px)`;
});

/* ─── CONTACT FORM ───────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmsg').value.trim();

  if (!name || !email || !message) return;

  const subject = encodeURIComponent('Message from ' + name);
  const body    = encodeURIComponent(
    'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message
  );

  window.location.href =
    'mailto:contact@grayconsultingmanagement.com?subject=' + subject + '&body=' + body;

  const successEl = document.getElementById('formSuccess');
  successEl.classList.add('visible');
  requestAnimationFrame(() => requestAnimationFrame(() => successEl.classList.add('shown')));

  document.getElementById('contactForm').reset();

  setTimeout(() => {
    successEl.classList.remove('shown');
    setTimeout(() => successEl.classList.remove('visible'), 600);
  }, 6000);
}
