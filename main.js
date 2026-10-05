/**
 * ZestPop - Dopamine Citrus Pop & Sparkling Fruit Soda
 * Main JavaScript (Mobile Responsive, Touch-Optimized & Production-Polished)
 * 
 * Key Features:
 * 1. Selective Lenis Smooth Scroll (Disabled on touch devices & mobile for 60fps native momentum scroll)
 * 2. Rapid Preloader (~1s duration with liquid can rise & colored wipe reveal)
 * 3. Hide-on-scroll-down, show-on-scroll-up compact sticky navbar
 * 4. Full-screen colorful mobile navigation drawer with stagger animation, focus trap & scroll lock
 * 5. gsap.matchMedia() responsive animation sets:
 *    - (max-width: 767px): Mobile hero entrance, gentle idle float, vertical process step cards
 *    - (min-width: 768px): Desktop 3D cursor tilt, ambient floating doodles, magnetic buttons,
 *                          pinned horizontal flavors scroll (>=900px), SVG process line draw (>=1040px)
 *    - (prefers-reduced-motion: reduce): Instant display, zero animations, accessibility fallback
 * 6. Responsive Velocity Marquee (slower on mobile, pauses when tab is hidden)
 * 7. Page Visibility API integration to pause offscreen tickers when tab is hidden
 * 8. Native CSS Scroll-Snap Swipe Carousel with active dot indicator syncing & click navigation
 * 9. Story line reveals & animated stat number counters
 * 10. Accessible keyboard-operable FAQ Accordion (ARIA managed)
 * 11. Secret 404 Easter Egg Modal ("The Secret Lab")
 * 12. Floating Back-to-Top button (safe-area aware)
 * 13. Fruit doodle confetti burst & animated cart count badge
 * 14. Subscription join form with email validation & iOS-safe focus
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const isTouchDevice = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const backToTopBtn = document.getElementById('btn-back-to-top');

  // Refresh ScrollTrigger once fonts and images are ready to ensure perfect scroll coordinates
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  }
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  // ------------------------------------------------------------------------
  // 1. SELECTIVE LENIS SMOOTH SCROLL
  //    (Disabled on touch devices / mobile so users have native 60fps scroll)
  // ------------------------------------------------------------------------
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !isTouchDevice && window.innerWidth >= 980) {
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } catch (e) {
      console.warn('Lenis smooth scroll setup warning:', e);
    }
  }

  // Set up GSAP MatchMedia for accessible responsive motion
  const mm = gsap.matchMedia();

  // ------------------------------------------------------------------------
  // 2. RAPID PRELOADER (~1s duration with liquid fill & wipe reveal)
  // ------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const preloaderLiquid = document.getElementById('preloader-liquid');
  const preloaderStatus = document.getElementById('preloader-status');
  const wipeTangerine = document.getElementById('wipe-tangerine');
  const wipeSunshine = document.getElementById('wipe-sunshine');

  function initPreloader(onCompleteCallback) {
    if (!preloader || !preloaderLiquid) {
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    const tl = gsap.timeline();

    // Fast, crisp liquid rise animation (~0.65s)
    tl.to(preloaderLiquid, {
      y: 0,
      duration: 0.65,
      ease: 'power2.inOut',
      onUpdate: function () {
        const progress = this.progress();
        if (progress > 0.4 && progress < 0.75) {
          if (preloaderStatus) preloaderStatus.textContent = 'Infusing prebiotic sunshine...';
        } else if (progress >= 0.75) {
          if (preloaderStatus) preloaderStatus.textContent = 'Uncapping the dopamine fizz!';
        }
      }
    })
    // Quick colored wipe reveal curtains (~0.35s)
    .to(wipeTangerine, {
      yPercent: -100,
      duration: 0.38,
      ease: 'power3.inOut'
    }, '+=0.04')
    .to(wipeSunshine, {
      yPercent: -100,
      duration: 0.42,
      ease: 'power3.inOut'
    }, '<0.05')
    .set(preloader, {
      display: 'none',
      onComplete: () => {
        ScrollTrigger.refresh();
        if (onCompleteCallback) onCompleteCallback();
      }
    });

    // Safety fallback timeout
    setTimeout(() => {
      if (preloader && preloader.style.display !== 'none') {
        preloader.style.display = 'none';
        ScrollTrigger.refresh();
        if (onCompleteCallback) onCompleteCallback();
      }
    }, 1800);
  }

  // ------------------------------------------------------------------------
  // 3. HIDE-ON-SCROLL-DOWN, SHOW-ON-SCROLL-UP STICKY NAVBAR
  // ------------------------------------------------------------------------
  let lastScrollY = window.scrollY;
  let isMenuOpen = false;
  const siteHeader = document.getElementById('site-header');

  window.addEventListener('scroll', () => {
    if (isMenuOpen || !siteHeader) return;
    const currentScrollY = window.scrollY;

    if (currentScrollY > 85 && currentScrollY > lastScrollY + 6) {
      // Scrolling down: hide header
      siteHeader.classList.add('nav-hidden');
    } else if (currentScrollY < lastScrollY - 6 || currentScrollY < 40) {
      // Scrolling up or near top: show header
      siteHeader.classList.remove('nav-hidden');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 4. FULL-SCREEN COLORFUL MOBILE NAVIGATION DRAWER
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const btnMenuClose = document.getElementById('btn-menu-close');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const btnMobileShop = document.getElementById('btn-mobile-shop');
  const btnMobileSecret = document.getElementById('btn-mobile-secret');

  function openMobileMenu() {
    if (!mobileMenuOverlay) return;
    isMenuOpen = true;
    mobileMenuOverlay.removeAttribute('hidden');
    void mobileMenuOverlay.offsetWidth; // Force reflow
    mobileMenuOverlay.classList.add('open');
    document.body.classList.add('menu-open');

    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.classList.add('active');
    }
    if (siteHeader) {
      siteHeader.classList.remove('nav-hidden');
    }

    // Stagger in links with bouncy entrance
    gsap.fromTo('.mobile-nav-item', 
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
    );
    gsap.fromTo('.mobile-menu-footer',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, delay: 0.25, ease: 'power2.out' }
    );

    // Set initial focus to close button
    if (btnMenuClose) btnMenuClose.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenuOverlay) return;
    isMenuOpen = false;
    mobileMenuOverlay.classList.remove('open');
    document.body.classList.remove('menu-open');

    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.classList.remove('active');
    }

    setTimeout(() => {
      if (!isMenuOpen) {
        mobileMenuOverlay.setAttribute('hidden', '');
      }
    }, 380);

    if (mobileToggle) mobileToggle.focus();
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (isMenuOpen) closeMobileMenu();
      else openMobileMenu();
    });
  }

  if (btnMenuClose) {
    btnMenuClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer on navigation link click
  mobileNavItems.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  if (btnMobileShop) {
    btnMobileShop.addEventListener('click', closeMobileMenu);
  }

  // Accessibility: Close on Escape key & Focus Trap inside mobile menu
  document.addEventListener('keydown', (e) => {
    if (!isMenuOpen) return;

    if (e.key === 'Escape') {
      closeMobileMenu();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = mobileMenuOverlay.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  });

  // ------------------------------------------------------------------------
  // 5. FLAVORS MOBILE SWIPE CAROUSEL & DOT INDICATORS SYNC
  // ------------------------------------------------------------------------
  const flavorsWrapper = document.getElementById('flavors-wrapper');
  const carouselDots = document.getElementById('carousel-dots');
  const flavorCards = document.querySelectorAll('.flavor-card');

  if (flavorsWrapper && carouselDots && flavorCards.length > 0) {
    const dots = carouselDots.querySelectorAll('.dot');

    // Sync active dot & centered card on native scroll-snap
    const updateActiveDot = () => {
      const scrollLeft = flavorsWrapper.scrollLeft;
      const cardWidth = flavorCards[0].offsetWidth + 16;
      const activeIndex = Math.min(
        dots.length - 1,
        Math.max(0, Math.round(scrollLeft / cardWidth))
      );

      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.removeAttribute('aria-current');
        }
      });

      // Synchronize centered highlight state on mobile cards
      flavorCards.forEach((card, idx) => {
        card.classList.toggle('is-centered', idx === activeIndex);
      });
    };

    flavorsWrapper.addEventListener('scroll', updateActiveDot, { passive: true });

    // Click dot to smoothly center card
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index') || '0', 10);
        if (flavorCards[index]) {
          const cardLeft = flavorCards[index].offsetLeft;
          const wrapperCenter = flavorsWrapper.offsetWidth / 2;
          const cardCenter = flavorCards[index].offsetWidth / 2;
          flavorsWrapper.scrollTo({
            left: cardLeft - wrapperCenter + cardCenter,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6. RESPONSIVE VELOCITY & DIRECTION MARQUEE
  // ------------------------------------------------------------------------
  const marqueeTrack1 = document.getElementById('marquee-track');
  const marqueeTrack2 = document.getElementById('marquee-track-2');

  function setupResponsiveMarquee(trackEl, baseDirection = -1) {
    if (!trackEl) return;

    let direction = baseDirection;
    let currentX = 0;
    const isMobile = window.innerWidth < 768;
    const defaultSpeed = isMobile ? 0.6 : 1.2;
    let speed = defaultSpeed;

    // Continuous ticker loop
    const marqueeTicker = () => {
      currentX += speed * direction;
      const halfWidth = trackEl.scrollWidth / 2;
      if (currentX <= -halfWidth) {
        currentX = 0;
      } else if (currentX >= 0) {
        currentX = -halfWidth;
      }
      trackEl.style.transform = `translateX(${currentX}px)`;
    };

    gsap.ticker.add(marqueeTicker);

    // Velocity acceleration on scroll
    ScrollTrigger.create({
      onUpdate: (self) => {
        if (self.direction === 1) {
          direction = -1;
        } else if (self.direction === -1) {
          direction = 1;
        }

        const velocity = Math.abs(self.getVelocity());
        const maxBoost = isMobile ? 3 : 6;
        const targetSpeed = defaultSpeed + Math.min(velocity * 0.005, maxBoost);
        gsap.to({ val: speed }, {
          val: targetSpeed,
          duration: 0.15,
          onUpdate: function () {
            speed = this.targets()[0].val;
          },
          onComplete: () => {
            gsap.to({ val: speed }, {
              val: defaultSpeed,
              duration: 0.5,
              ease: 'power2.out',
              onUpdate: function () {
                speed = this.targets()[0].val;
              }
            });
          }
        });
      }
    });
  }

  setupResponsiveMarquee(marqueeTrack1, -1);
  setupResponsiveMarquee(marqueeTrack2, 1);

  // Page Visibility API: pause/resume animations when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      gsap.ticker.sleep();
    } else {
      gsap.ticker.wake();
    }
  });

  // ------------------------------------------------------------------------
  // 7. COLOR-BLOCK SCROLL STORY (Contrast Adaptive Nav Theme)
  // ------------------------------------------------------------------------
  const themedSections = document.querySelectorAll('[data-theme]');
  themedSections.forEach((sec) => {
    const theme = sec.getAttribute('data-theme');
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => document.body.setAttribute('data-current-theme', theme),
      onEnterBack: () => document.body.setAttribute('data-current-theme', theme),
    });
  });

  // ------------------------------------------------------------------------
  // 8. STORY: MASKED LINE REVEALS & NUMBER COUNTERS
  // ------------------------------------------------------------------------
  gsap.to('.story-mask-line span', {
    y: '0%',
    opacity: 1,
    duration: 0.75,
    stagger: 0.14,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.story-content',
      start: 'top 75%'
    }
  });

  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach((card) => {
    const numEl = card.querySelector('.stat-number');
    if (!numEl) return;

    const target = parseFloat(numEl.getAttribute('data-target') || '0');
    const suffix = numEl.getAttribute('data-suffix') || '';

    const counterObj = { val: 0 };
    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counterObj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            numEl.textContent = Math.round(counterObj.val) + suffix;
          }
        });
      }
    });
  });

  // ------------------------------------------------------------------------
  // 9. ANIMATION SET 1: DESKTOP & TABLET (>=768px)
  // ------------------------------------------------------------------------
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    // Desktop Hero entrance
    const heroTl = gsap.timeline();
    heroTl.from('.hero-word', {
      y: 65,
      rotation: (i) => (i % 2 === 0 ? 5 : -4),
      opacity: 0,
      duration: 0.85,
      stagger: 0.07,
      ease: 'power3.out',
      clearProps: 'transform'
    })
    .from('#hero-product-slot', {
      y: 110,
      scale: 0.75,
      opacity: 0,
      duration: 1.3,
      ease: 'elastic.out(1, 0.45)',
    }, '-=0.5')
    .from('.hero-badge-wrap, .hero-desc, .hero-cta-group, .hero-trust-list', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'all'
    }, '-=0.8');

    // Ambient floating doodles around hero (Desktop only)
    gsap.to('.doodle-citrus-hero', {
      y: '-=16',
      rotation: '+=14',
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.doodle-star-hero', {
      rotation: 360,
      duration: 14,
      repeat: -1,
      ease: 'none'
    });

    gsap.to('.doodle-bubbles-hero', {
      y: '+=15',
      x: '-=8',
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.doodle-arrow-hero', {
      y: '-=10',
      rotation: '-=6',
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Hero 3D cursor tilt on can showcase (Desktop mouse only)
    const heroVisual = document.getElementById('hero-visual');
    const heroProductSlot = document.getElementById('hero-product-slot');
    if (heroVisual && heroProductSlot && !isTouchDevice) {
      heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        gsap.to(heroProductSlot, {
          rotateY: x * 14,
          rotateX: -y * 14,
          x: x * 16,
          y: y * 16,
          duration: 0.35,
          ease: 'power2.out',
          transformPerspective: 800
        });
      });

      heroVisual.addEventListener('mouseleave', () => {
        gsap.to(heroProductSlot, {
          rotateY: 0,
          rotateX: 0,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    }

    // Custom Magnetic Cursor & Magnetic Target pull (Desktop mouse only)
    const cursor = document.getElementById('custom-cursor');
    const cursorText = document.getElementById('cursor-text');

    if (cursor && cursorText && !isTouchDevice) {
      window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.12,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      const cursorTriggers = document.querySelectorAll('[data-cursor]');
      cursorTriggers.forEach((trigger) => {
        trigger.addEventListener('mouseenter', () => {
          const text = trigger.getAttribute('data-cursor') || 'Pop!';
          cursorText.textContent = text;
          cursor.classList.add('grow');
        });
        trigger.addEventListener('mouseleave', () => {
          cursor.classList.remove('grow');
          cursorText.textContent = '';
        });
      });

      const magneticTargets = document.querySelectorAll('.magnetic-target');
      magneticTargets.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);

          gsap.to(btn, {
            x: dx * 0.28,
            y: dy * 0.28,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto'
          });
        });
      });
    }

    // Pinned Horizontal Scroll on Flavors (Desktop/Tablet >= 768px)
    const flavorsSection = document.getElementById('flavors');
    const flavorsTrack = document.getElementById('flavors-track');
    const cards = document.querySelectorAll('.flavor-card');

    if (flavorsSection && flavorsTrack && cards.length > 0) {
      // Horizontal scroll distance: track.scrollWidth - window.innerWidth
      const scrollDistance = () => flavorsTrack.scrollWidth - window.innerWidth;

      // Set initial card centering state
      cards.forEach((card, idx) => card.classList.toggle('is-centered', idx === 0));

      gsap.to(flavorsTrack, {
        x: () => -scrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: flavorsSection,
          start: 'top top',
          end: () => `+=${scrollDistance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / (cards.length - 1),
            duration: { min: 0.2, max: 0.4 },
            ease: 'power1.inOut'
          },
          onUpdate: (self) => {
            const activeIdx = Math.round(self.progress * (cards.length - 1));
            cards.forEach((c, idx) => {
              c.classList.toggle('is-centered', idx === activeIdx);
            });
          },
          onToggle: (self) => {
            if (backToTopBtn) {
              backToTopBtn.classList.toggle('hide-pinned', self.isActive);
            }
          }
        }
      });

      // Desktop parallax doodles in flavors track
      gsap.to('.p-doodle-1', { x: -340, rotation: 120, ease: 'none', scrollTrigger: { trigger: flavorsSection, scrub: 1.4 } });
      gsap.to('.p-doodle-2', { x: 420, rotation: -90, ease: 'none', scrollTrigger: { trigger: flavorsSection, scrub: 2 } });
      gsap.to('.p-doodle-3', { x: -260, y: -40, ease: 'none', scrollTrigger: { trigger: flavorsSection, scrub: 1.2 } });
      gsap.to('.p-doodle-4', { x: 320, ease: 'none', scrollTrigger: { trigger: flavorsSection, scrub: 1.8 } });
      gsap.to('.p-doodle-5', { x: -180, rotation: 60, ease: 'none', scrollTrigger: { trigger: flavorsSection, scrub: 1.5 } });
    }

    // Process Timeline: SVG Connecting Line Drawing (>=1040px)
    const processLine = document.getElementById('process-draw-line');
    if (processLine && window.innerWidth >= 1040) {
      const pathLength = processLine.getTotalLength();
      gsap.set(processLine, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

      gsap.to(processLine, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.process-timeline',
          start: 'top 75%',
          end: 'bottom 80%',
          scrub: 1
        }
      });
    }

    // Process Step Cards bounce-in
    gsap.from('.process-step-card', {
      scale: 0.8,
      rotation: (i) => (i % 2 === 0 ? -5 : 5),
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.8)',
      scrollTrigger: {
        trigger: '.process-timeline',
        start: 'top 75%'
      }
    });

    // 3D Card Tilt on .tilt-card (Desktop mouse only)
    if (!isTouchDevice) {
      const tiltCards = document.querySelectorAll('.tilt-card');
      tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
          const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

          gsap.to(card, {
            rotateY: x * 8,
            rotateX: -y * 8,
            transformPerspective: 800,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        });
      });
    }
  });

  // ------------------------------------------------------------------------
  // 10. ANIMATION SET 2: MOBILE (<768px)
  // ------------------------------------------------------------------------
  mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
    // Mobile Hero entrance: clean split lines & pop
    const mobileHeroTl = gsap.timeline();
    mobileHeroTl.from('.hero-word', {
      y: 45,
      opacity: 0,
      duration: 0.65,
      stagger: 0.05,
      ease: 'power3.out',
      clearProps: 'transform'
    })
    .from('#hero-product-slot', {
      y: 70,
      scale: 0.85,
      opacity: 0,
      duration: 0.9,
      ease: 'back.out(1.6)',
    }, '-=0.35')
    .from('.hero-badge-wrap, .hero-desc, .hero-cta-group, .hero-trust-list', {
      y: 18,
      opacity: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: 'power2.out',
      clearProps: 'all'
    }, '-=0.5');

    // Idle float on flagship can (Replaces cursor tracking on touch devices)
    gsap.to('#hero-product-slot', {
      y: -8,
      rotation: 1.2,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Gentle drift on single remaining hero doodle (rest hidden)
    gsap.to('.doodle-citrus-hero', {
      y: '-=10',
      rotation: '+=8',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Vertical Timeline: Step Cards reveal as user scrolls down
    gsap.from('.process-step-card', {
      opacity: 0,
      x: -20,
      duration: 0.55,
      stagger: 0.14,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.process-timeline',
        start: 'top 80%'
      }
    });
  });

  // ------------------------------------------------------------------------
  // 11. ACCESSIBILITY SET: PREFERS REDUCED MOTION
  // ------------------------------------------------------------------------
  mm.add('(prefers-reduced-motion: reduce)', () => {
    if (preloader) {
      preloader.style.display = 'none';
    }
    gsap.set('.hero-word, .story-mask-line span, .process-step-card, #hero-product-slot', {
      opacity: 1,
      y: 0,
      x: 0,
      rotation: 0,
      scale: 1
    });

    document.querySelectorAll('.stat-card .stat-number').forEach((numEl) => {
      const target = numEl.getAttribute('data-target') || '0';
      const suffix = numEl.getAttribute('data-suffix') || '';
      numEl.textContent = target + suffix;
    });
  });

  // Launch Preloader
  initPreloader();

  // ------------------------------------------------------------------------
  // 12. ACCESSIBLE FAQ ACCORDION
  // ------------------------------------------------------------------------
  const faqButtons = document.querySelectorAll('.faq-question');
  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answerEl = document.getElementById(answerId);

      // Close all other accordion items for clean focus
      faqButtons.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherAns = document.getElementById(otherBtn.getAttribute('aria-controls'));
          if (otherAns) otherAns.hidden = true;
        }
      });

      // Toggle clicked item
      btn.setAttribute('aria-expanded', String(!isExpanded));
      if (answerEl) {
        answerEl.hidden = isExpanded;
      }
    });
  });

  // ------------------------------------------------------------------------
  // 13. 404 EASTER EGG MODAL ("SECRET TEST LAB")
  // ------------------------------------------------------------------------
  const easterModal = document.getElementById('easter-modal');
  const btnSecretDrop = document.getElementById('btn-secret-drop');
  const btnFooterSecret = document.getElementById('btn-footer-secret');
  const btnModalClose = document.getElementById('btn-modal-close');
  const btnModalShop = document.getElementById('btn-modal-shop');

  function openEasterModal() {
    if (!easterModal) return;
    if (typeof easterModal.showModal === 'function') {
      easterModal.showModal();
    } else {
      easterModal.setAttribute('open', '');
    }
    triggerFruitConfetti(window.innerWidth / 2, window.innerHeight / 2);
  }

  function closeEasterModal() {
    if (!easterModal) return;
    if (typeof easterModal.close === 'function') {
      easterModal.close();
    } else {
      easterModal.removeAttribute('open');
    }
  }

  if (btnSecretDrop) btnSecretDrop.addEventListener('click', openEasterModal);
  if (btnMobileSecret) btnMobileSecret.addEventListener('click', openEasterModal);
  if (btnFooterSecret) btnFooterSecret.addEventListener('click', openEasterModal);
  if (btnModalClose) btnModalClose.addEventListener('click', closeEasterModal);
  if (btnModalShop) btnModalShop.addEventListener('click', closeEasterModal);

  // Close modal when clicking outside dialog backdrop
  if (easterModal) {
    easterModal.addEventListener('click', (e) => {
      const rect = easterModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeEasterModal();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 14. FLOATING "BACK TO TOP" BUTTON (Touch-Sized & Safe-Area Positioned)
  // ------------------------------------------------------------------------
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 420) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ------------------------------------------------------------------------
  // 15. INTERACTIVE CART DRAWER & STATE CONTROLLER
  // ------------------------------------------------------------------------
  const confettiContainer = document.getElementById('confetti-container');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const btnCart = document.getElementById('btn-cart');
  const btnCartClose = document.getElementById('btn-cart-close');
  const cartCountEl = document.getElementById('cart-count');
  const cartItemsPill = document.getElementById('cart-items-pill');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotalPrice = document.getElementById('cart-subtotal-price');
  const btnCheckout = document.getElementById('btn-checkout');
  const toastNotice = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');

  let toastTimeout = null;
  let isCartOpen = false;

  // Cart state: map of productName => { name, image, price, count }
  const cartState = {};

  function showToast(message, emoji = '🎉') {
    if (!toastNotice || !toastText) return;
    toastText.textContent = message;
    const emojiEl = toastNotice.querySelector('.toast-emoji');
    if (emojiEl) emojiEl.textContent = emoji;

    toastNotice.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2800);
  }

  // Fruit Doodle Confetti Burst generator
  function triggerFruitConfetti(originX, originY) {
    if (!confettiContainer) return;

    const doodleTypes = [
      'assets/citrus-slice.svg',
      'assets/star-burst.svg',
      'assets/bubble.svg',
      'assets/sparkle.svg'
    ];

    const particleCount = 14;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('img');
      const randomAsset = doodleTypes[Math.floor(Math.random() * doodleTypes.length)];
      particle.src = randomAsset;
      particle.className = 'confetti-particle';
      particle.alt = '';
      particle.setAttribute('aria-hidden', 'true');

      const size = Math.floor(Math.random() * 18) + 16;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;

      confettiContainer.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 85 + 35;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance + 30;
      const rotation = Math.random() * 360 - 180;

      gsap.to(particle, {
        x: targetX,
        y: targetY,
        rotation: rotation,
        scale: Math.random() * 0.4 + 0.6,
        opacity: 0,
        duration: Math.random() * 0.35 + 0.55,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        }
      });
    }
  }

  function getCartTotals() {
    let totalPacks = 0;
    let totalPrice = 0;
    Object.values(cartState).forEach((item) => {
      totalPacks += item.count;
      totalPrice += item.count * item.price;
    });
    return { totalPacks, totalCans: totalPacks * 12, totalPrice };
  }

  function renderCart() {
    const { totalPacks, totalCans, totalPrice } = getCartTotals();

    // Update cart badge in header
    if (cartCountEl) {
      cartCountEl.textContent = totalCans;
    }
    if (btnCart) {
      btnCart.setAttribute('aria-label', `Shopping Cart containing ${totalCans} cans`);
    }

    // Update items badge in drawer header
    if (cartItemsPill) {
      cartItemsPill.textContent = totalCans > 0 ? `${totalCans} Cans (${totalPacks} Packs)` : '0 Cans';
    }

    // Update subtotal
    if (cartSubtotalPrice) {
      cartSubtotalPrice.textContent = `$${totalPrice}`;
    }

    // Render items or empty state
    if (!cartItemsList) return;

    const items = Object.values(cartState);
    if (items.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state" id="cart-empty-state">
          <img src="assets/citrus-slice.svg" alt="" width="56" height="56" class="cart-empty-icon" aria-hidden="true">
          <p class="cart-empty-title">Your box is looking thirsty!</p>
          <p class="cart-empty-sub">Add any 12-pack of our cold-crushed dopamine sodas to start sipping.</p>
          <a href="#flavors" class="btn btn-primary btn-sm btn-empty-shop" id="btn-empty-shop">Browse Flavors ✦</a>
        </div>
      `;
      const newEmptyBtn = document.getElementById('btn-empty-shop');
      if (newEmptyBtn) {
        newEmptyBtn.addEventListener('click', () => {
          closeCart();
        });
      }
      if (btnCheckout) {
        btnCheckout.disabled = true;
        btnCheckout.style.opacity = '0.5';
        btnCheckout.style.cursor = 'not-allowed';
      }
    } else {
      if (btnCheckout) {
        btnCheckout.disabled = false;
        btnCheckout.style.opacity = '1';
        btnCheckout.style.cursor = 'pointer';
      }

      const itemsHtml = items.map((item) => `
        <div class="cart-item" data-product="${item.name}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-sub">12-Pack Cans • $${item.price} each</div>
            <div class="cart-item-price">$${item.count * item.price}</div>
            <div class="cart-qty-ctrl">
              <button type="button" class="cart-qty-btn btn-qty-minus" data-product="${item.name}" aria-label="Decrease quantity of ${item.name}">−</button>
              <span class="cart-qty-count" aria-live="polite">${item.count}</span>
              <button type="button" class="cart-qty-btn btn-qty-plus" data-product="${item.name}" aria-label="Increase quantity of ${item.name}">+</button>
            </div>
          </div>
          <button type="button" class="cart-item-remove" data-product="${item.name}" aria-label="Remove ${item.name} from box">✕</button>
        </div>
      `).join('');

      cartItemsList.innerHTML = itemsHtml;
    }
  }

  function addItemToCart(productName, image = 'assets/can-tangerine.svg', price = 36) {
    if (cartState[productName]) {
      cartState[productName].count += 1;
    } else {
      cartState[productName] = {
        name: productName,
        image: image,
        price: Number(price) || 36,
        count: 1
      };
    }

    renderCart();

    // Elastic bounce on cart counter
    if (cartCountEl) {
      gsap.fromTo(cartCountEl,
        { scale: 1.8 },
        { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.3)' }
      );
    }
  }

  function openCart() {
    if (!cartDrawer) return;
    isCartOpen = true;
    cartDrawer.removeAttribute('hidden');
    void cartDrawer.offsetWidth; // Force reflow
    cartDrawer.classList.add('open');
    document.body.classList.add('cart-open');

    if (btnCartClose) {
      btnCartClose.focus();
    }
  }

  function closeCart() {
    if (!cartDrawer) return;
    isCartOpen = false;
    cartDrawer.classList.remove('open');
    document.body.classList.remove('cart-open');

    setTimeout(() => {
      if (!isCartOpen) {
        cartDrawer.setAttribute('hidden', '');
      }
    }, 350);

    if (btnCart) {
      btnCart.focus();
    }
  }

  // Cart Button Opens Cart Drawer
  if (btnCart) {
    btnCart.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  }

  if (btnCartClose) {
    btnCartClose.addEventListener('click', closeCart);
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', closeCart);
  }

  // Event delegation on cart items list for quantity +/- and remove
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const plusBtn = e.target.closest('.btn-qty-plus');
      const minusBtn = e.target.closest('.btn-qty-minus');
      const removeBtn = e.target.closest('.cart-item-remove');

      if (plusBtn) {
        const prod = plusBtn.getAttribute('data-product');
        if (prod && cartState[prod]) {
          cartState[prod].count += 1;
          renderCart();
        }
      } else if (minusBtn) {
        const prod = minusBtn.getAttribute('data-product');
        if (prod && cartState[prod]) {
          if (cartState[prod].count > 1) {
            cartState[prod].count -= 1;
          } else {
            delete cartState[prod];
            showToast(`Removed ${prod} from your box.`, '🗑️');
          }
          renderCart();
        }
      } else if (removeBtn) {
        const prod = removeBtn.getAttribute('data-product');
        if (prod && cartState[prod]) {
          delete cartState[prod];
          renderCart();
          showToast(`Removed ${prod} from your box.`, '🗑️');
        }
      }
    });
  }

  // Checkout button inside cart drawer
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      const { totalCans, totalPrice } = getCartTotals();
      if (totalCans === 0) {
        showToast('Your box is empty! Add a pack first.', '📦');
        return;
      }
      triggerFruitConfetti(window.innerWidth / 2, window.innerHeight / 2);
      showToast(`Order Placed for $${totalPrice}! 100% Free 2-Day Shipping ✦`, '🎉');
      // Clear cart
      for (const k of Object.keys(cartState)) delete cartState[k];
      renderCart();
      setTimeout(closeCart, 1600);
    });
  }

  // Hook all "Add to Box" buttons with event delegation & direct binding
  // Works reliably for cards on-screen or off-screen!
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-cart, .btn-card-add');
    if (!addBtn) return;

    e.preventDefault();
    const rect = addBtn.getBoundingClientRect();
    const clickX = e.clientX || rect.left + rect.width / 2;
    const clickY = e.clientY || rect.top + rect.height / 2;

    // Confetti burst
    triggerFruitConfetti(clickX, clickY);

    const productName = addBtn.getAttribute('data-product') || 'Electric Tangerine';
    const productImage = addBtn.getAttribute('data-image') || 'assets/can-tangerine.svg';
    const productPrice = parseFloat(addBtn.getAttribute('data-price') || '36');

    addItemToCart(productName, productImage, productPrice);
    showToast(`Added ${productName} (12 Cans) to your box!`, '🍊');
  });

  // Keyboard trap and Escape listener for Cart Drawer
  document.addEventListener('keydown', (e) => {
    if (!isCartOpen) return;

    if (e.key === 'Escape') {
      closeCart();
      return;
    }

    if (e.key === 'Tab') {
      const focusableEls = cartDrawer.querySelectorAll(
        'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  });

  // ------------------------------------------------------------------------
  // 16. SUBSCRIPTION / JOIN FORM HANDLER
  // ------------------------------------------------------------------------
  const joinForm = document.getElementById('join-form');
  const joinEmail = document.getElementById('join-email');
  if (joinForm && joinEmail) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = joinEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showToast('Please enter a valid email address (e.g. hello@zestpop.com)!', '⚠️');
        joinEmail.focus();
        return;
      }
      showToast('Welcome to the VIP Zest Club! 15% discount code sent 🍋', '✦');
      triggerFruitConfetti(window.innerWidth / 2, window.innerHeight / 2);
      joinEmail.value = '';
    });
  }

  // ------------------------------------------------------------------------
  // 17. SMOOTH ANCHOR NAVIGATION (Responsive Offset)
  // ------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = window.innerWidth < 768 ? 64 : 74;

        if (lenis) {
          lenis.scrollTo(targetElement, { offset: -headerOffset, duration: 1.1 });
        } else {
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  console.log('⚡ ZestPop Fully Mobile-Responsive Site Initialized.');
});
