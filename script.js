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

// ─── Antigravity Canvas Engine (Hero Section) ───
(function initAntigravityParticles() {
  const canvas = document.getElementById('particleCanvas');
  const heroSection = document.getElementById('home');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let particles =   [];
  let mouse = { x: null, y: null };
  let time = 0;

  // Antigravity Configuration Parameters
  const CONFIG = {
    count: 700,
    magnetRadius: 22,
    ringRadius: 13,
    waveSpeed: 2,
    waveAmplitude: 0.80,
    particleSize: 1,
    lerpSpeed: 0.10,
    color: '#e38646',
    particleVariance: 1,
    rotationSpeed: 0,
    depthFactor: 0.6,
    pulseSpeed: 3,
    particleShape: 'capsule',
    fieldStrength: 7
  };
 
  class AntigravityParticle {
    constructor(index) {
      this.index = index;
      this.init();
    }

    init() {
      // Hollow circular ring distribution matching ringRadius (13) and count (700)
      const baseRadius = Math.min(W, H) * 0.30; // Inner boundary of hollow center
      const ringThickness = Math.min(W, H) * 0.12; // Ring band thickness
      
      // Evenly space around circle with subtle organic jitter
      const angle = (this.index / CONFIG.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
      
      // Radial ring thickness dispersion based on ringRadius (13)
      const bandPos = Math.pow(Math.random(), 0.8); // Concentrated slightly toward center of ring band
      const r = baseRadius + bandPos * ringThickness + (Math.random() - 0.5) * 10 * CONFIG.particleVariance;
      
      this.angle = angle;
      this.r = r;
      this.baseX = W / 2 + Math.cos(angle) * r;
      this.baseY = H / 2 + Math.sin(angle) * r;

      this.x = this.baseX;
      this.y = this.baseY;

      // 3D Depth factor (0.6)
      this.z = Math.random() * CONFIG.depthFactor + (1 - CONFIG.depthFactor); // Depth range ~0.4 to 1.0
      this.phase = Math.random() * Math.PI * 2;
      this.baseWidth = (Math.random() * 1.5 + 1.2) * CONFIG.particleSize * this.z;
      this.baseLength = this.baseWidth * (Math.random() * 2.5 + 3.2); // Capsule shape ratio
      
      // Tangential / Radial orientation along ring curve (as shown in image)
      this.baseRotation = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.35;
      this.rotation = this.baseRotation;
    }

    update() {
      // 1. Organic Radial Floating Motion along ring
      const floatRad = Math.sin(time * 0.02 * CONFIG.waveSpeed + this.phase) * (8 * CONFIG.waveAmplitude * this.z);
      const floatAngle = Math.cos(time * 0.015 * CONFIG.waveSpeed + this.phase * 1.2) * (0.02 * CONFIG.waveAmplitude);

      const currentR = this.r + floatRad;
      const currentAngle = this.angle + floatAngle;

      // Center with subtle mouse parallax shift
      const ringCenterX = W / 2 + (mouse.x !== null ? (mouse.x - W / 2) * 0.06 * this.z : 0);
      const ringCenterY = H / 2 + (mouse.y !== null ? (mouse.y - H / 2) * 0.06 * this.z : 0);

      let targetX = ringCenterX + Math.cos(currentAngle) * currentR;
      let targetY = ringCenterY + Math.sin(currentAngle) * currentR;

      // 2. Opposite Magnetic Repulsion Interaction (magnetRadius: 22, fieldStrength: 7)
      if (mouse.x !== null) {
        const dx = this.x - mouse.x; // Vector pointing AWAY from mouse cursor
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = CONFIG.magnetRadius * 12; // ~264px active interaction radius

        if (dist < maxDist && dist > 0) {
          const normDist = 1 - dist / maxDist;
          const force = Math.pow(normDist, 1.5) * CONFIG.fieldStrength * 6 * this.z;
          const pushAngle = Math.atan2(dy, dx); // Angle pointing away from cursor

          // Push particles in OPPOSITE direction away from mouse cursor
          targetX += Math.cos(pushAngle) * force * 10;
          targetY += Math.sin(pushAngle) * force * 10;

          // Rotate capsules smoothly to align with repulsion push direction
          this.rotation += (pushAngle + Math.PI / 2 - this.rotation) * 0.15;
        } else {
          this.rotation += (this.baseRotation - this.rotation) * 0.05;
        }
      } else {
        this.rotation += (this.baseRotation - this.rotation) * 0.05;
      }

      // 3. Smooth Lerp Motion (lerpSpeed: 0.1)
      this.x += (targetX - this.x) * CONFIG.lerpSpeed;
      this.y += (targetY - this.y) * CONFIG.lerpSpeed;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // Pulse modulation
      const pulse = Math.sin(time * 0.03 * CONFIG.pulseSpeed + this.phase) * 0.2 + 0.8;
      const alpha = (0.25 + 0.55 * this.z) * pulse;
      const width = this.baseWidth * pulse;
      const length = this.baseLength * pulse;

      ctx.fillStyle = CONFIG.color;
      ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

      // Draw Capsule (rounded pill)
      ctx.beginPath();
      const radius = width / 2;
      const halfLen = length / 2;

      ctx.arc(0, -halfLen + radius, radius, Math.PI, 0);
      ctx.lineTo(radius, halfLen - radius);
      ctx.arc(0, halfLen - radius, radius, 0, Math.PI);
      ctx.lineTo(-radius, -halfLen + radius);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(new AntigravityParticle(i));
    }
  }

  function resize() {
    const rect = heroSection.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height;
    createParticles();
  }

  // Track mouse globally across window so hovering anywhere moves particles
  window.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  window.addEventListener('resize', resize);

  function animate() {
    time += 1;
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
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
