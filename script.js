const root = document.documentElement;
const loader = document.getElementById('loader');
const cursorGlow = document.getElementById('cursorGlow');
const particles = document.getElementById('particles');
const themeToggle = document.getElementById('themeToggle');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const scrollTop = document.getElementById('scrollTop');
const typingText = document.getElementById('typingText');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const revealItems = document.querySelectorAll('.reveal');
const sectionRoots = document.querySelectorAll('.reveal-section');
const countTargets = document.querySelectorAll('[data-count]');
const magneticElements = document.querySelectorAll('.magnetic');
const rippleButtons = document.querySelectorAll('.ripple');
const navAnchors = document.querySelectorAll('.nav-link');

const typingWords = [
  'Computer Science Undergraduate',
  'Full Stack Developer',
  'UI/UX Designer',
  'Software Engineering Student',
];

let typingIndex = 0;
let typingChar = 0;
let typingDeleting = false;

function typeLoop() {
  const current = typingWords[typingIndex];
  typingChar += typingDeleting ? -1 : 1;
  typingText.textContent = current.slice(0, typingChar);

  if (!typingDeleting && typingChar === current.length) {
    typingDeleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (typingDeleting && typingChar === 0) {
    typingDeleting = false;
    typingIndex = (typingIndex + 1) % typingWords.length;
  }

  setTimeout(typeLoop, typingDeleting ? 34 : 62);
}

function createParticles() {
  const count = window.innerWidth < 700 ? 16 : 28;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const dot = document.createElement('span');
    dot.className = 'particle';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.opacity = `${0.2 + Math.random() * 0.45}`;
    dot.style.width = `${3 + Math.random() * 4}px`;
    dot.style.height = dot.style.width;
    dot.style.animationDuration = `${12 + Math.random() * 16}s`;
    dot.style.animationDelay = `${Math.random() * 12}s`;
    fragment.appendChild(dot);
  }

  particles.appendChild(fragment);
}

function updateTheme(nextTheme) {
  root.dataset.theme = nextTheme;
  localStorage.setItem('portfolio-theme', nextTheme);
  themeToggle.querySelector('.theme-icon').textContent = nextTheme === 'dark' ? '◐' : '◑';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', nextTheme === 'dark' ? '#0B1120' : '#eef4ff');
}

function setupTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  updateTheme(saved || (prefersLight ? 'light' : 'dark'));
}

function animateCounters() {
  countTargets.forEach((item) => {
    if (item.dataset.animated === 'true') return;
    const target = Number(item.dataset.count || 0);
    const suffix = item.dataset.suffix || '';
    const duration = 1200;
    const startedAt = performance.now();

    function tick(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const value = Math.round(target * progress);
      item.textContent = value + (progress === 1 ? suffix : '');
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        item.dataset.animated = 'true';
      }
    }

    requestAnimationFrame(tick);
  });
}

function revealSections() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('reveal-section')) {
            const bars = entry.target.querySelectorAll('.bar i');
            bars.forEach((bar) => bar.closest('.skills-grid')?.classList.add('skills-animate'));
          }
          const counters = entry.target.querySelectorAll('[data-count]');
          if (counters.length) {
            animateCounters();
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
  sectionRoots.forEach((section) => observer.observe(section));
}

function handleScrollState() {
  const scrollY = window.scrollY;
  scrollTop.classList.toggle('visible', scrollY > 500);

  let activeId = 'home';
  sectionRoots.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 160) {
      activeId = section.id;
    }
  });

  navAnchors.forEach((anchor) => {
    anchor.classList.toggle('active', anchor.getAttribute('href') === `#${activeId}`);
  });
}

function setupCursorGlow() {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.transform = `translate(${event.clientX - 110}px, ${event.clientY - 110}px)`;
  });
}

function setupMagneticButtons() {
  magneticElements.forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    element.addEventListener('pointerleave', () => {
      element.style.transform = 'translate(0, 0)';
    });
  });
}

function setupRipples() {
  rippleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.remove('ripple-active');
      void button.offsetWidth;
      button.classList.add('ripple-active');
      setTimeout(() => button.classList.remove('ripple-active'), 800);
    });
  });
}

function setupNav() {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupForm() {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(data.get('subject'));
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
    window.location.href = `mailto:chamathsathsara641@gmail.com?subject=${subject}&body=${body}`;
    formStatus.textContent = 'Opening your email client so you can send the message.';
  });
}

function setupLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 650);
  });
}

function setupScrollTop() {
  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupIntroAnimations() {
  createParticles();
  if (typingText) typeLoop();
  setupTheme();
  revealSections();
  setupCursorGlow();
  setupMagneticButtons();
  setupRipples();
  setupNav();
  setupForm();
  setupLoader();
  setupScrollTop();
  handleScrollState();
}

themeToggle.addEventListener('click', () => {
  updateTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

window.addEventListener('scroll', handleScrollState, { passive: true });
window.addEventListener('resize', () => {
  particles.innerHTML = '';
  createParticles();
});

setupIntroAnimations();
