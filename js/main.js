/**
 * ============================================================
 * MAIN.JS — Đỗ Hoàng Khải | Premium Engineering Portfolio
 * Author  : Senior Front-end Implementation
 * Version : 1.0.0
 * ============================================================
 *
 * TABLE OF CONTENTS:
 *  1. Preloader
 *  2. Navigation — Scroll behavior, Active link, Mobile menu
 *  3. Reading Progress Bar
 *  4. Typing Effect (Hero)
 *  5. Scroll Animations (IntersectionObserver)
 *  6. Animated Counters
 *  7. Skill Bars Animation
 *  8. Contact Form Handler
 *  9. Scroll To Top Button
 * 10. Smooth Scroll for anchor links
 * 11. Initialise Everything
 * ============================================================
 */

'use strict';

/* ────────────────────────────────────────────────────────────
   1. PRELOADER
   ──────────────────────────────────────────────────────────── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Hide preloader after page fully loaded (min 1.6s for animation)
  const minDuration = 1600;
  const start = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minDuration - elapsed);

    setTimeout(() => {
      preloader.classList.add('hidden');
      // Remove from DOM after transition completes
      preloader.addEventListener('transitionend', () => {
        preloader.remove();
      }, { once: true });
    }, remaining);
  });
}


/* ────────────────────────────────────────────────────────────
   2. NAVIGATION
   ──────────────────────────────────────────────────────────── */
function initNavigation() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  if (!navbar) return;

  /* ── Scroll: Add .scrolled class ── */
  function onNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll(); // run on init

  /* ── Active Nav Link based on scroll position ── */
  function updateActiveLink() {
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── Mobile Menu Toggle ── */
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      navMobile.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navMobile.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    navMobile.addEventListener('click', (e) => {
      if (e.target === navMobile) {
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}


/* ────────────────────────────────────────────────────────────
   3. READING PROGRESS BAR
   ──────────────────────────────────────────────────────────── */
function initProgressBar() {
  const bar = document.getElementById('navProgress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
}


/* ────────────────────────────────────────────────────────────
   4. TYPING EFFECT (HERO)
   ──────────────────────────────────────────────────────────── */
function initTypingEffect() {
  const target = document.getElementById('typingText');
  if (!target) return;

  const phrases = [
    'Kỹ Sư Xây Dựng',
    'Chuyên Gia Quản Lý Dự Án',
    'Giảng Viên Xây Dựng',
    'Kỹ Sư Giám Sát Công Trình'
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPausing   = false;

  const typeSpeed    = 80;   // ms per character when typing
  const deleteSpeed  = 40;   // ms per character when deleting
  const pauseAfter   = 1800; // ms pause after full word typed
  const pauseBefore  = 300;  // ms pause before typing next word

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (isPausing) return;

    if (!isDeleting) {
      // Typing forward
      charIndex++;
      target.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === currentPhrase.length) {
        // Word fully typed — pause before deleting
        isPausing = true;
        setTimeout(() => {
          isPausing = false;
          isDeleting = true;
          setTimeout(tick, deleteSpeed);
        }, pauseAfter);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      // Deleting
      charIndex--;
      target.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === 0) {
        // Word fully deleted — move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        isPausing = true;
        setTimeout(() => {
          isPausing = false;
          setTimeout(tick, typeSpeed);
        }, pauseBefore);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  // Start after short delay
  setTimeout(tick, 800);
}


/* ────────────────────────────────────────────────────────────
   5. SCROLL ANIMATIONS (IntersectionObserver)
   ──────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll(
    '.fade-in-up, .fade-in-left, .fade-in-right'
  );

  if (!animatedEls.length) return;

  // Fallback for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    animatedEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedEls.forEach(el => observer.observe(el));
}


/* ────────────────────────────────────────────────────────────
   6. ANIMATED COUNTERS
   ──────────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 2000; // ms
    const fps      = 60;
    const steps    = (duration / 1000) * fps;
    const increment = target / steps;
    let current    = 0;

    // Use requestAnimationFrame for smooth animation
    function step() {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(el => animateCounter(el));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


/* ────────────────────────────────────────────────────────────
   7. SKILL BARS ANIMATION
   ──────────────────────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
  if (!bars.length) return;

  if (!('IntersectionObserver' in window)) {
    bars.forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') + '%';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        // Small delay for stagger effect
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}


/* ────────────────────────────────────────────────────────────
   8. CONTACT FORM HANDLER
   ──────────────────────────────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  // Simple client-side validation
  function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Vui lòng nhập họ tên (tối thiểu 2 ký tự).');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email.trim())) {
      errors.push('Vui lòng nhập địa chỉ email hợp lệ.');
    }

    if (!data.subject || data.subject.trim().length < 3) {
      errors.push('Vui lòng nhập chủ đề (tối thiểu 3 ký tự).');
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push('Vui lòng nhập nội dung (tối thiểu 10 ký tự).');
    }

    return errors;
  }

  function showFieldError(inputEl, msg) {
    inputEl.style.borderColor = 'var(--clr-accent)';
    let errorEl = inputEl.parentElement.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      errorEl.style.cssText = 'display:block;font-size:0.75rem;color:var(--clr-accent);margin-top:0.3rem;';
      inputEl.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = msg;
  }

  function clearFieldErrors() {
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.form-control').forEach(el => {
      el.style.borderColor = '';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFieldErrors();

    const formData = {
      name   : form.querySelector('#inputName').value,
      email  : form.querySelector('#inputEmail').value,
      subject: form.querySelector('#inputSubject').value,
      message: form.querySelector('#inputMessage').value
    };

    const errors = validateForm(formData);

    if (errors.length > 0) {
      // Show inline errors
      if (!formData.name || formData.name.trim().length < 2) {
        showFieldError(form.querySelector('#inputName'), 'Vui lòng nhập họ tên hợp lệ.');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email.trim())) {
        showFieldError(form.querySelector('#inputEmail'), 'Vui lòng nhập email hợp lệ.');
      }
      if (!formData.subject || formData.subject.trim().length < 3) {
        showFieldError(form.querySelector('#inputSubject'), 'Vui lòng nhập chủ đề.');
      }
      if (!formData.message || formData.message.trim().length < 10) {
        showFieldError(form.querySelector('#inputMessage'), 'Nội dung quá ngắn.');
      }
      return;
    }

    // Simulate sending (static site — no real backend)
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      form.reset();

      if (success) {
        success.style.display = 'block';
        setTimeout(() => { success.style.display = 'none'; }, 5000);
      }
    }, 1200);
  });

  // Live validation on blur
  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = '';
      const errorEl = input.parentElement.querySelector('.field-error');
      if (errorEl) errorEl.remove();
    });
  });
}


/* ────────────────────────────────────────────────────────────
   9. SCROLL TO TOP BUTTON
   ──────────────────────────────────────────────────────────── */
function initScrollToTop() {
  const btn = document.getElementById('scrollToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ────────────────────────────────────────────────────────────
   10. SMOOTH SCROLL FOR ANCHOR LINKS
   ──────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}


/* ────────────────────────────────────────────────────────────
   11. HERO SCROLL INDICATOR
   ──────────────────────────────────────────────────────────── */
function initHeroScroll() {
  const indicator = document.getElementById('heroScroll');
  if (!indicator) return;

  indicator.addEventListener('click', () => {
    const about = document.getElementById('about');
    if (about) {
      const navH = document.getElementById('navbar')?.offsetHeight || 72;
      window.scrollTo({
        top: about.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth'
      });
    }
  });
}


/* ────────────────────────────────────────────────────────────
   12. GALLERY LIGHTBOX (Simple)
   ──────────────────────────────────────────────────────────── */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox DOM
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9000;
    background:rgba(0,0,0,0.92); align-items:center;
    justify-content:center; cursor:zoom-out;
  `;

  const img = document.createElement('img');
  img.style.cssText = `
    max-width:90vw; max-height:90vh; border-radius:8px;
    box-shadow:0 24px 80px rgba(0,0,0,0.5);
    animation: lbFadeIn 0.25s ease;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position:absolute; top:1.5rem; right:1.5rem; background:rgba(217,4,41,0.9);
    color:#fff; border:none; width:44px; height:44px; border-radius:8px;
    font-size:1.2rem; cursor:pointer; font-weight:bold;
    transition: background 0.2s;
  `;

  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = `@keyframes lbFadeIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }`;
  document.head.appendChild(style);

  lightbox.appendChild(img);
  lightbox.appendChild(closeBtn);
  document.body.appendChild(lightbox);

  // Open lightbox
  galleryItems.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      const alt = item.querySelector('img')?.alt || '';
      if (!src) return;
      img.src = src;
      img.alt = alt;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}


/* ────────────────────────────────────────────────────────────
   13. NAVBAR LINK CLOSE AFTER CLICK (Desktop smooth)
   ──────────────────────────────────────────────────────────── */
function initNavLinkHighlight() {
  // Highlight current section nav link with data-section matching
  const allSections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('#navbar .nav-link, #navMobile .nav-link');

  const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -40% 0px'
  });

  allSections.forEach(s => highlightObserver.observe(s));
}


/* ────────────────────────────────────────────────────────────
   INITIALISE ALL MODULES
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavigation();
  initProgressBar();
  initTypingEffect();
  initScrollAnimations();
  initCounters();
  initSkillBars();
  initContactForm();
  initScrollToTop();
  initSmoothScroll();
  initHeroScroll();
  initGalleryLightbox();
  initNavLinkHighlight();

  // Log version info (dev friendly)
  console.log('%c ĐỖ HOÀNG KHẢI — Portfolio v1.0.0 ', 'background:#0b2545;color:#fff;padding:4px 12px;border-radius:4px;font-weight:bold;');
  console.log('%c Engineering Excellence × Pedagogical Mastery ', 'background:#d90429;color:#fff;padding:4px 12px;border-radius:4px;');
});
