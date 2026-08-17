/* ═══════════════════════════════════════════════════
   JASIR PORTFOLIO — script.js
   Splash Screen · Particle Canvas · Typing Effect · Scroll Animations
═══════════════════════════════════════════════════ */

// ─── Splash Screen (Cross-Browser Compatible) ───
let splashInterval = null;

function runSplashScreen() {
  const splashScreen = document.getElementById('splashScreen');
  const splashFill = document.getElementById('splashProgressFill');
  const splashStatusText = document.getElementById('splashStatusText');
  const splashPercentText = document.getElementById('splashPercentText');

  if (!splashScreen) return;

  if (splashInterval) clearInterval(splashInterval);

  // Force splash screen to be visible in all browsers
  splashScreen.style.display = 'flex';
  splashScreen.style.opacity = '1';
  splashScreen.style.visibility = 'visible';
  splashScreen.classList.remove('splash-hide');
  document.body.classList.add('splash-active');

  if (splashFill) splashFill.style.width = '0%';
  if (splashPercentText) splashPercentText.textContent = '0%';
  if (splashStatusText) splashStatusText.textContent = 'Loading Portfolio...';

  const steps = [
    { target: 35, text: 'Loading Portfolio...' },
    { target: 70, text: 'Initializing Components...' },
    { target: 100, text: 'Welcome!' }
  ];

  let currentPercent = 0;
  let currentStep = 0;

  splashInterval = setInterval(() => {
    currentPercent += Math.floor(Math.random() * 3) + 2;
    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(splashInterval);
    }

    if (splashFill) splashFill.style.width = currentPercent + '%';
    if (splashPercentText) splashPercentText.textContent = currentPercent + '%';

    if (currentStep < steps.length - 1 && currentPercent >= steps[currentStep].target) {
      currentStep++;
      if (splashStatusText) splashStatusText.textContent = steps[currentStep].text;
    }

    if (currentPercent >= 100) {
      setTimeout(() => {
        splashScreen.classList.add('splash-hide');
        document.body.classList.remove('splash-active');
        setTimeout(() => {
          splashScreen.style.display = 'none';
        }, 500);
      }, 350);
    }
  }, 30);
}

// Run immediately and listen to DOMContentLoaded + pageshow for all browsers/caches
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runSplashScreen);
} else {
  runSplashScreen();
}

window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    runSplashScreen();
  }
});

// ─── Cursor Glow ───
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ─── Particle Canvas (Hero Section Only - Circular) ───
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const heroSection = document.getElementById('home');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };
  let heroRect, centerX, centerY, radius;

  const COLORS = ['#d97706', '#b45309', '#71717a', '#a1a1aa'];
  const COUNT = 60;

  function resize() {
    heroRect = heroSection.getBoundingClientRect();
    W = canvas.width = heroRect.width;
    H = canvas.height = heroRect.height;
    centerX = W / 2;
    centerY = H / 2;
    radius = Math.min(W, H) * 0.4;
  }
  resize();
  window.addEventListener('resize', resize);

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroSection.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      // Generate random position within circle
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      this.x = centerX + r * Math.cos(angle);
      this.y = centerY + r * Math.sin(angle);
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 2 + 0.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.vx += dx / dist * 0.2;
          this.vy += dy / dist * 0.2;
        }
      }
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;

      // Keep within circle
      const dx = this.x - centerX;
      const dy = this.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#d97706';
          ctx.globalAlpha = (1 - dist / 100) * 0.15;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
})();

// ─── Particle Canvas (Experience Section - Circular) ───
(function initExperienceParticles() {
  const canvas = document.getElementById('experienceCanvas');
  const experienceSection = document.getElementById('experience');
  if (!canvas || !experienceSection) return;
  
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };
  let sectionRect, centerX, centerY, radius;

  const COLORS = ['#d97706', '#b45309', '#71717a', '#a1a1aa'];
  const COUNT = 50;

  function resize() {
    sectionRect = experienceSection.getBoundingClientRect();
    W = canvas.width = sectionRect.width;
    H = canvas.height = sectionRect.height;
    centerX = W / 2;
    centerY = H / 2;
    radius = Math.min(W, H) * 0.35;
  }
  resize();
  window.addEventListener('resize', resize);

  experienceSection.addEventListener('mousemove', (e) => {
    const rect = experienceSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  experienceSection.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      this.x = centerX + r * Math.cos(angle);
      this.y = centerY + r * Math.sin(angle);
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.size = Math.random() * 1.8 + 0.4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          this.vx += dx / dist * 0.15;
          this.vy += dy / dist * 0.15;
        }
      }
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;

      const dx = this.x - centerX;
      const dy = this.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#d97706';
          ctx.globalAlpha = (1 - dist / 80) * 0.12;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
})();


// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});


// ─── Hamburger Menu ───
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
// Close on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


// ─── Active Nav Link Tracking ───
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
  });
  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});


// ─── Typing Animation ───
(function initTyping() {
  const phrases = [
    'Beautiful Flutter Apps',
    'Cross-Platform Solutions',
    'REST API Integrations',
    'Play Store Apps',
    'Seamless UI/UX',
  ];
  let pIdx = 0, cIdx = 0, deleting = false;
  const el = document.getElementById('typingText');

  function type() {
    const word = phrases[pIdx];
    if (!deleting) {
      el.textContent = word.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 75);
    } else {
      el.textContent = word.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }
  type();
})();


// ─── Scroll Reveal (IntersectionObserver) ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('visible'), parseInt(delay));
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.skill-card, .project-card, .timeline-card, .reveal')
  .forEach(el => revealObserver.observe(el));








// ─── Contact Form (Formspree submission) ───
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending...';

  // Form will submit to Formspree naturally
  // Success message will be shown by Formspree redirect
});


// ─── Smooth anchor scroll offset (for fixed navbar) ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});


// ─── Section entrance reveal (additional) ───
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.about-text-col, .about-photo-col').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  sectionObserver.observe(el);
});
