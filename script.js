// ValePan Website - Main JavaScript
(function () {
  'use strict';

  // ============================================
  // HEADER STICKY & SCROLL BEHAVIOR
  // ============================================
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTop');
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Add background to header when scrolled
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if (currentScroll > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
    
    lastScroll = currentScroll;
  }

  // Throttle scroll event for performance
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(handleScroll);
  });

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Ignore empty anchors
      if (href === '#' || href === '#!') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          menuToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
        
        // Calculate offset for fixed header
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // UPDATE ACTIVE NAV LINK
  // ============================================
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header-nav a');
    
    let current = '';
    const scrollPosition = window.pageYOffset + 200; // Offset for better UX
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', function() {
      const isOpen = item.classList.contains('active');
      
      // Close all other items (optional: comment out for multiple open)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      
      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ============================================
  // VIDEO LAZY LOADING WITH INTERSECTION OBSERVER
  // ============================================
  const videoObserverOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.25
  };

  const videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        
        // Load video sources if not loaded
        const sources = video.querySelectorAll('source[data-src]');
        sources.forEach(source => {
          source.src = source.dataset.src;
          source.removeAttribute('data-src');
        });
        
        // Play video
        if (video.paused) {
          video.play().catch(e => {
            // Autoplay prevented by browser, that's okay
            console.log('Video autoplay prevented:', e);
          });
        }
        
        // Stop observing this video
        observer.unobserve(video);
      }
    });
  }, videoObserverOptions);

  // Observe all videos with data-autoplay attribute
  document.querySelectorAll('video[data-autoplay]').forEach(video => {
    videoObserver.observe(video);
  });

  // For videos without data-autoplay, just observe for lazy loading
  document.querySelectorAll('video:not([data-autoplay])').forEach(video => {
    const sources = video.querySelectorAll('source[data-src]');
    if (sources.length > 0) {
      videoObserver.observe(video);
    }
  });

  // ============================================
  // FADE-IN ANIMATIONS ON SCROLL
  // ============================================
  const fadeObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
      }
    });
  }, fadeObserverOptions);

  // Observe elements with fade-in class
  document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
    fadeObserver.observe(el);
  });

  // ============================================
  // PRELOAD NEXT SECTION IMAGES
  // ============================================
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nextSection = entry.target.nextElementSibling;
        if (nextSection) {
          const images = nextSection.querySelectorAll('img[loading="lazy"]');
          images.forEach(img => {
            img.loading = 'eager';
          });
        }
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
  });

  // ============================================
  // FORM VALIDATION (if needed in future)
  // ============================================
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      const name = this.querySelector('[name="name"]');
      const email = this.querySelector('[name="email"]');
      const message = this.querySelector('[name="message"]');
      
      let isValid = true;
      
      if (!name.value.trim()) {
        showError(name, 'Por favor, insira seu nome');
        isValid = false;
      }
      
      if (!email.value.trim() || !isValidEmail(email.value)) {
        showError(email, 'Por favor, insira um email válido');
        isValid = false;
      }
      
      if (!message.value.trim()) {
        showError(message, 'Por favor, insira sua mensagem');
        isValid = false;
      }
      
      if (isValid) {
        // Here you would normally send the form data
        // For now, we'll just show a success message
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
      }
    });
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message') || document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
      formGroup.appendChild(error);
    }
    
    input.classList.add('error');
    
    // Remove error after 3 seconds
    setTimeout(() => {
      error.remove();
      input.classList.remove('error');
    }, 3000);
  }

  // ============================================
  // HANDLE EXTERNAL LINKS
  // ============================================
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    // Add rel="noopener noreferrer" for security if not present
    if (!link.getAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // ============================================
  // PERFORMANCE: REDUCE MOTION FOR USERS WHO PREFER
  // ============================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    // Disable smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'auto' });
        }
      });
    });
  }

  // ============================================
  // INITIALIZE
  // ============================================
  function init() {
    // Run scroll handler once on load
    handleScroll();
    
    // Set active nav link on load
    updateActiveNavLink();
    
    console.log('ValePan website initialized! 🍔');
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

