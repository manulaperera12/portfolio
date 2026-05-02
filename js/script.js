// ── Cursor ──────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  }, 80);
});
document.querySelectorAll('a,button,.glass-card,.project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ── Particles ────────────────────────────────────────────
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let shootingStars = [];
let mouse = { x: null, y: null, lastX: null, lastY: null, vX: 0, vY: 0 };

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.size = Math.random() * 1.5 + .5;
    this.opacity = Math.random() * .4 + .1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108,99,255,${this.opacity})`;
    ctx.fill();
  }
}

class ShootingStar {
  constructor(x, y, vX, vY) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 2;
    // Move opposite to mouse direction with some randomness
    this.speedX = -vX * 0.5 + (Math.random() - 0.5);
    this.speedY = -vY * 0.5 + (Math.random() - 0.5);
    this.color = Math.random() > 0.5 ? '#6c63ff' : '#00d4ff';
    this.opacity = 1;
    this.history = [];
    this.maxHistory = 25; // Longer trails
  }
  update() {
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.maxHistory) this.history.shift();
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY -= 0.1; // Slight upward float like flames
    this.opacity -= 0.015;
  }
  draw() {
    if (this.history.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = this.opacity;
    
    ctx.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 1; i < this.history.length; i++) {
      ctx.lineTo(this.history[i].x, this.history[i].y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108,99,255,${.08 * (1 - d / 120)})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();

  shootingStars.forEach((star, index) => {
    star.update();
    star.draw();
    if (star.opacity <= 0) shootingStars.splice(index, 1);
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Typed.js for hero role ───────────────────────────────
new Typed('#typed-role', {
  strings: [
    'Mobile Apps',
    'Flutter Apps',
    'React Native Apps',
    'iOS & Android Apps',
    'Web Applications',
    'Software Solutions',
    'Kotlin Apps',
    'Swift Apps'
  ],
  typeSpeed: 60,
  backSpeed: 40,
  backDelay: 1800,
  loop: true,
  smartBackspace: true
});

// ── Header scroll ────────────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scroll-top').classList.toggle('show', window.scrollY > 400);
  // Active nav
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 200;
  sections.forEach(sec => {
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
});

// ── Mobile menu ──────────────────────────────────────────
const menuBtn = document.getElementById('menu-btn');
const navbar = document.getElementById('navbar');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  navbar.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  menuBtn.classList.remove('active');
  navbar.classList.remove('open');
}));

// ── 3D card tilt & Shooting Stars ──────────────────────
const card = document.getElementById('hero-card');

document.addEventListener('mousemove', e => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  if (mouse.lastX !== null) {
    mouse.vX = mouseX - mouse.lastX;
    mouse.vY = mouseY - mouse.lastY;
  }
  mouse.lastX = mouseX;
  mouse.lastY = mouseY;

  // Emit flame particles from cursor
  // Only if moving or periodically
  if (Math.abs(mouse.vX) > 1 || Math.abs(mouse.vY) > 1) {
    shootingStars.push(new ShootingStar(mouseX, mouseY, mouse.vX, mouse.vY));
  }

  // 3D card tilt - DISABLED as per user request to prevent flipping
  /*
  if (card) {
    const rect = card.getBoundingClientRect();
    const x = mouseX - rect.left - rect.width / 2;
    const y = mouseY - rect.top - rect.height / 2;
    card.querySelector('.card-inner').style.transform =
      `rotateY(${(x / rect.width) * 20}deg) rotateX(${-(y / rect.height) * 20}deg)`;
  }
  */
});

if (card) {
  card.addEventListener('mouseleave', () => {
    card.querySelector('.card-inner').style.transform = 'rotateY(0) rotateX(0)';
  });
}

// ── Scroll-to-top ────────────────────────────────────────
document.getElementById('scroll-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Intersection Observer ────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animated');
      e.target.querySelectorAll('.bar-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('[data-animate],.glass-card,.skill-category,.timeline-item,.edu-item').forEach(el => observer.observe(el));

// Skill bars separate observer
document.querySelectorAll('.bar-fill').forEach(bar => {
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) bar.style.width = bar.dataset.width + '%'; });
  }, { threshold: .3 });
  barObserver.observe(bar);
});

// ── About Image Carousel ─────────────────────────────────
const track = document.getElementById('carousel-track');
const dotsWrap = document.getElementById('carousel-dots');
const slides = track ? track.querySelectorAll('.carousel-slide') : [];
let currentSlide = 0;
let carouselTimer;

if (slides.length) {
  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  function goToSlide(n) {
    currentSlide = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    resetTimer();
  }

  function resetTimer() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => goToSlide(currentSlide + 1), 3500);
  }

  document.getElementById('carousel-prev').addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('carousel-next').addEventListener('click', () => goToSlide(currentSlide + 1));

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  });

  resetTimer();
}

// ── Show More: Experience ────────────────────────────────
const expBtn = document.getElementById('exp-show-more');
const expHidden = document.getElementById('timeline-hidden');
if (expBtn && expHidden) {
  expBtn.addEventListener('click', () => {
    const open = expHidden.classList.toggle('expanded');
    expBtn.classList.toggle('open', open);
    expBtn.querySelector('.show-more-label').textContent = open ? 'Show Less' : 'Show More Experience';
    if (open) {
      expHidden.querySelectorAll('[data-animate]').forEach(el => {
        setTimeout(() => el.classList.add('animated'), 100);
      });
    }
  });
}

// ── Show More: Education ─────────────────────────────────
const eduBtn = document.getElementById('edu-show-more');
const eduHidden = document.getElementById('edu-timeline-hidden');
if (eduBtn && eduHidden) {
  eduBtn.addEventListener('click', () => {
    const open = eduHidden.classList.toggle('expanded');
    eduBtn.classList.toggle('open', open);
    eduBtn.querySelector('.show-more-label').textContent = open ? 'Show Less' : 'Show More Education';
    if (open) {
      eduHidden.querySelectorAll('[data-animate]').forEach(el => {
        setTimeout(() => el.classList.add('animated'), 100);
      });
    }
  });
}

// ── Contact form ─────────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  const mailtoLink = `mailto:manulaperera1232@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
  btn.innerHTML = '<span>Opening Email...</span><i class="bx bx-check"></i>';
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
  setTimeout(() => { window.location.href = mailtoLink; }, 300);
  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span><i class="bx bx-send"></i>';
    btn.style.background = '';
  }, 3000);
});
