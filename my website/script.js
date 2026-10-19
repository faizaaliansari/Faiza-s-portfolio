/* ========== THEME TOGGLE ========== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  if (isDark) {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
});

/* ========== MOBILE MENU ========== */
const menuIcon = document.getElementById('menuIcon');
const navLinks = document.getElementById('navLinks');

menuIcon.addEventListener('click', () => navLinks.classList.toggle('active'));
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

/* ========== TYPING EFFECT ========== */
const roles = ['IT Trainer', 'Excel Expert', 'Web Developer', 'Designer & Developer'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.querySelector('.typing');

function typeEffect() {
  const current = roles[roleIndex];
  typingEl.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  if (!isDeleting && charIndex === current.length + 1) {
    isDeleting = true;
    setTimeout(typeEffect, 1500);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(typeEffect, isDeleting ? 60 : 120);
}
typeEffect();

/* ========== CONTACT FORM ========== */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.querySelector('input[type="text"]').value;
  alert(`Thank you ${name}! Your message has been received.\n\nDirect contact: ansarifaiza975@gmail.com`);
  e.target.reset();
});

/* ========== SCROLL ANIMATION ========== */
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.skill-card, .service-card, .project-card, .timeline-item, .edu-card, .hobby-card, .skill-subtitle'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

/* ========== 3D TILT ON HERO IMAGE ========== */
const heroImg = document.querySelector('.hero-img');
if (heroImg && window.innerWidth > 900) {
  heroImg.addEventListener('mousemove', (e) => {
    const rect = heroImg.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroImg.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) scale(1.05)`;
  });
  heroImg.addEventListener('mouseleave', () => { heroImg.style.transform = ''; });
}

/* ========== BACK TO TOP ========== */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));