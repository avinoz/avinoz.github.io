/* Alvin Shiu — interactions & scroll choreography */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);

  /* ── Lenis ── */
  const lenis = new Lenis({ lerp: reduced ? 1 : 0.08 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ── Intro: SVG name → circle from i-dot reveals site ── */
  const intro = document.getElementById('intro');
  const introScaler = document.getElementById('intro-blob-scaler');
  const introLetters = document.getElementById('intro-letters');
  const introIDot = document.getElementById('intro-i-dot');
  const introBg = document.getElementById('intro-bg');
  let siteInitialized = false;

  function getRevealOrigin(dotEl, maskEl) {
    const dot = dotEl.getBoundingClientRect();
    const mask = maskEl
      ? maskEl.getBoundingClientRect()
      : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const dotX = dot.left + dot.width / 2;
    const dotY = dot.top + dot.height / 2;
    const x = dotX - mask.left;
    const y = dotY - mask.top;
    const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
    const baseRadius = 150 * vmin;
    const corners = [
      [mask.left, mask.top],
      [mask.left + mask.width, mask.top],
      [mask.left, mask.top + mask.height],
      [mask.left + mask.width, mask.top + mask.height],
    ];
    const coverScale = Math.max(
      ...corners.map(([cx, cy]) => Math.hypot(cx - dotX, cy - dotY) / baseRadius)
    );
    return {
      x,
      y,
      cxPct: (x / mask.width) * 100,
      cyPct: (y / mask.height) * 100,
      baseRadius,
      initialScale: (dot.width / 2) / baseRadius,
      coverScale,
      endRadiusPx: 0.5,
    };
  }

  function positionRevealBlob(origin) {
    introScaler.style.left = `${origin.x}px`;
    introScaler.style.top = `${origin.y}px`;
  }

  function setRevealMask(scale, origin, el) {
    const r = scale * 150;
    const mask = `radial-gradient(circle at ${origin.cxPct}% ${origin.cyPct}%, transparent ${r}vmin, #000 ${r}vmin)`;
    el.style.maskImage = mask;
    el.style.webkitMaskImage = mask;
  }

  function setShrinkMask(scale, origin, el) {
    const r = scale * 150;
    const mask = `radial-gradient(circle at ${origin.cxPct}% ${origin.cyPct}%, #000 ${r}vmin, transparent ${r}vmin)`;
    el.style.maskImage = mask;
    el.style.webkitMaskImage = mask;
  }

  function setShrinkMaskRadius(radiusPx, origin, el) {
    const mask = `radial-gradient(circle at ${origin.x}px ${origin.y}px, #000 ${radiusPx}px, transparent ${radiusPx}px)`;
    el.style.maskImage = mask;
    el.style.webkitMaskImage = mask;
  }

  function layoutLetterTrack(lettersRoot, iGroupId, iStemId, iDotId) {
    const y = '188';
    const group = document.getElementById(iGroupId);
    const stem = document.getElementById(iStemId);
    const dot = document.getElementById(iDotId);

    const measure = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    measure.setAttribute('class', 'intro-letter');
    measure.setAttribute('x', '0');
    measure.setAttribute('y', y);
    measure.setAttribute('visibility', 'hidden');
    measure.textContent = 'Alvin Shiu';
    lettersRoot.appendChild(measure);

    const charMap = [
      ['a', 'A', 0],
      ['l', 'l', 1],
      ['v', 'v', 2],
      ['i', null, 3],
      ['n', 'n', 4],
      ['s', 'S', 6],
      ['h', 'h', 7],
      ['i2', 'i', 8],
      ['u', 'u', 9],
    ];

    charMap.forEach(([key, char, index]) => {
      const startX = getCharStartX(measure, index);
      if (key === 'i') {
        layoutIntroIAt(stem, dot, group, startX, y);
        return;
      }
      const el = lettersRoot.querySelector(`[data-letter="${key}"] .intro-letter`);
      el.setAttribute('x', String(startX));
      el.setAttribute('y', y);
      if (char) el.textContent = char;
    });

    measure.remove();
  }

  function layoutSignatureName(svgId, lettersId, iGroupId, iStemId, iDotId) {
    const svg = document.getElementById(svgId);
    const letters = document.getElementById(lettersId);
    if (!svg || !letters) return;

    letters.removeAttribute('transform');
    layoutLetterTrack(letters, iGroupId, iStemId, iDotId);

    const box = letters.getBBox();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetW = vw * 0.55;
    const targetH = vh * 0.45;
    let scale = targetW / box.width;
    if (box.height * scale > targetH) {
      scale = targetH / box.height;
    }

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    letters.setAttribute(
      'transform',
      `translate(${vw / 2}, ${vh / 2}) scale(${scale}) translate(${-cx}, ${-cy})`
    );
  }

  function getCharStartX(textEl, index) {
    if (typeof textEl.getStartPositionOfChar === 'function') {
      return textEl.getStartPositionOfChar(index).x;
    }
    return textEl.getSubStringLength(0, index);
  }

  function layoutIntroIAt(stem, dot, group, startX, y) {
    stem.setAttribute('x', String(startX));
    stem.setAttribute('y', y);
    stem.textContent = '\u0131';

    const ref = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    ref.setAttribute('class', 'intro-letter');
    ref.setAttribute('x', String(startX));
    ref.setAttribute('y', y);
    ref.setAttribute('visibility', 'hidden');
    ref.textContent = 'i';
    group.appendChild(ref);

    const box = ref.getBBox();
    ref.remove();

    stem.setAttribute('x', String(box.x));
    const r = box.height * 0.078;
    dot.setAttribute('cx', String(box.x + box.width / 2));
    dot.setAttribute('cy', String(box.y + r * 1.05));
    dot.setAttribute('r', String(r));
  }

  function layoutIntroLetterTrack() {
    layoutLetterTrack(introLetters, 'intro-i-group', 'intro-i-stem', 'intro-i-dot');
  }

  function layoutIntroName() {
    const svg = document.getElementById('intro-svg');
    if (!svg || !introLetters) return { scale: 1, enterY: 52 };

    introLetters.removeAttribute('transform');
    layoutIntroLetterTrack();

    const box = introLetters.getBBox();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetW = vw * 0.6;
    const targetH = vh * 0.6;
    let scale = targetW / box.width;
    if (box.height * scale > targetH) {
      scale = targetH / box.height;
    }

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    introLetters.setAttribute(
      'transform',
      `translate(${vw / 2}, ${vh / 2}) scale(${scale}) translate(${-cx}, ${-cy})`
    );

    return { scale, enterY: box.height * scale * 0.35 };
  }

  function runIntro() {
    if (!siteInitialized) {
      initSite();
      siteInitialized = true;
    }

    if (reduced || !intro || !introScaler || !introLetters || !introIDot) {
      intro?.remove();
      lenis.start();
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    lenis.stop();

    const layout = layoutIntroName();

    const letterWraps = [...introLetters.querySelectorAll('.intro-letter-wrap')];
    const animLetters = letterWraps.filter((el) => el.id !== 'intro-i-group');
    const iStem = document.getElementById('intro-i-stem');
    const origin = getRevealOrigin(introIDot);

    positionRevealBlob(origin);

    gsap.set(animLetters, { y: layout.enterY, opacity: 0 });
    gsap.set(iStem, { y: layout.enterY, opacity: 0 });
    gsap.set(introIDot, { opacity: 1, y: 0, transformOrigin: 'center center' });
    gsap.set(introScaler, { scale: origin.initialScale, opacity: 0 });
    setRevealMask(0, origin, introBg);

    const finishIntro = () => {
      document.documentElement.style.overflow = '';
      intro.remove();
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    };

    const introBlob = introScaler.querySelector('.intro-blob');
    const reveal = { scale: origin.initialScale, opacity: 1 };

    const syncReveal = () => {
      gsap.set(introScaler, { scale: reveal.scale, opacity: reveal.opacity });
      setRevealMask(reveal.scale, origin, introBg);
    };

    const letterDelay = 0.35;
    const letterStagger = 0.04;
    const letterDur = 0.65;
    const vIndex = animLetters.findIndex((el) => el.dataset.letter === 'v');
    const iStemStart = letterDelay + vIndex * letterStagger + 0.2;

    gsap.timeline({ onComplete: finishIntro })
      .to({}, { duration: letterDelay })
      .to(animLetters, {
        y: 0,
        opacity: 1,
        duration: letterDur,
        ease: 'power3.out',
        stagger: letterStagger,
      })
      .to(iStem, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      }, iStemStart)
      .to({}, { duration: 0.5 })
      .to(reveal, {
        scale: origin.coverScale,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.inOut',
        onStart() {
          layoutIntroName();
          const fresh = getRevealOrigin(introIDot);
          Object.assign(origin, fresh);
          positionRevealBlob(origin);
          reveal.scale = fresh.initialScale;
          gsap.set(introIDot, { opacity: 0 });
          gsap.set(introScaler, { opacity: 1 });
          introBlob.classList.remove('is-revealing');
          syncReveal();
          gsap.delayedCall(0.08, () => introBlob.classList.add('is-revealing'));
        },
        onUpdate: syncReveal,
      })
      .to(letterWraps, {
        opacity: 0,
        duration: 0.85,
        ease: 'power3.inOut',
      }, '<');
  }

  /* ── Header scroll state ── */
  function initHeader() {
    const header = document.getElementById('site-header');
    ScrollTrigger.create({
      start: 0,
      onUpdate: (self) => header.classList.toggle('scrolled', self.scroll() > 0),
    });

    const toggle = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    toggle?.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      drawer.setAttribute('aria-hidden', !open);
      lenis.stop();
      if (!open) lenis.start();
    });
    drawer?.querySelectorAll('a:not([data-open-contact]):not([data-open-portfolio])').forEach((a) => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        lenis.start();
      });
    });
  }

  /* ── Contact modal ── */
  function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const dialog = document.getElementById('contact-modal-dialog');
    const backdrop = document.getElementById('contact-modal-backdrop');
    const closeBtn = document.getElementById('contact-modal-close');
    const form = document.getElementById('contact-form');
    const toggle = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const CONTACT_EMAIL = 'avinoz@gmail.com';
    let lastFocus = null;

    if (!modal || !form) return;

    function openModal() {
      lastFocus = document.activeElement;
      drawer?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      drawer?.setAttribute('aria-hidden', 'true');
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      lenis.stop();
      requestAnimationFrame(() => {
        document.getElementById('contact-name')?.focus();
      });
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      lenis.start();
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }

    document.querySelectorAll('[data-open-contact]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const message = form.message.value.trim();
      if (!name || !message) {
        form.reportValidity();
        return;
      }

      const subject = `Portfolio inquiry from ${name}`;
      const body = `${message}\n\n— ${name}`;
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      closeModal();
      form.reset();
    });

    dialog?.addEventListener('click', (e) => e.stopPropagation());
  }

  /* ── Portfolio download modal ── */
  function initPortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    const dialog = document.getElementById('portfolio-modal-dialog');
    const backdrop = document.getElementById('portfolio-modal-backdrop');
    const closeBtn = document.getElementById('portfolio-modal-close');
    const form = document.getElementById('portfolio-form');
    const passwordInput = document.getElementById('portfolio-password');
    const errorEl = document.getElementById('portfolio-error');
    const requestBtn = document.getElementById('portfolio-request-access');
    const toggle = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const CONTACT_EMAIL = 'avinoz@gmail.com';
    const PORTFOLIO_PDF = 'assets/Alvin-Shiu-Portfolio.pdf';
    // Change this to your portfolio download password
    const PORTFOLIO_PASSWORD = 'rain2026';
    let lastFocus = null;

    if (!modal || !form) return;

    function requestAccess() {
      const subject = 'Portfolio access request';
      const body =
        'Hi Alvin,\n\n' +
        "I'd like to request access to download your portfolio PDF. Please share the password when you have a moment.\n\n" +
        'Thank you!';
      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    function downloadPortfolio() {
      const link = document.createElement('a');
      link.href = PORTFOLIO_PDF;
      link.download = 'Alvin-Shiu-Portfolio.pdf';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    function openModal() {
      lastFocus = document.activeElement;
      drawer?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      drawer?.setAttribute('aria-hidden', 'true');
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      if (errorEl) errorEl.hidden = true;
      form.reset();
      lenis.stop();
      requestAnimationFrame(() => passwordInput?.focus());
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      lenis.start();
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }

    document.querySelectorAll('[data-open-portfolio]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
    requestBtn?.addEventListener('click', requestAccess);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = form.password.value;
      if (!password) {
        form.reportValidity();
        return;
      }
      if (password !== PORTFOLIO_PASSWORD) {
        if (errorEl) errorEl.hidden = false;
        passwordInput?.focus();
        return;
      }
      if (errorEl) errorEl.hidden = true;
      downloadPortfolio();
      closeModal();
      form.reset();
    });

    dialog?.addEventListener('click', (e) => e.stopPropagation());
  }

  /* ── Hero entrance ── */
  function initHero() {
    window.HeroCanvas?.start();

    document.querySelectorAll('.hero-line').forEach((line) => {
      const inner = document.createElement('span');
      inner.className = 'hero-line-inner';
      inner.innerHTML = line.innerHTML;
      line.innerHTML = '';
      line.appendChild(inner);
    });

    const tl = gsap.timeline({ delay: reduced ? 0 : 0.3 });
    tl.to('.hero-eyebrow', { opacity: 1, duration: 0.6, ease: 'power2.out' })
      .to('.hero-line-inner', {
        y: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.12,
      }, '-=0.2')
      .to('.hero-desc', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .to('.hero-scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.4');
  }

  /* ── Manifesto word highlight on scroll ── */
  function initManifesto() {
    const words = document.querySelectorAll('.m-word');
    ScrollTrigger.create({
      trigger: '#manifesto',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate(self) {
        const total = words.length;
        words.forEach((w, i) => {
          const threshold = i / total;
          w.style.opacity = self.progress > threshold ? 1 : 0.15;
        });
        gsap.set('#manifesto-rule', { width: self.progress * 120 + 'px' });
      },
    });
    ScrollTrigger.create({
      trigger: '#manifesto',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#manifesto-pin',
    });
  }

  /* ── Studio stats counter + reveal ── */
  function initStudio() {
    gsap.from('.studio-copy > *', {
      scrollTrigger: { trigger: '#studio', start: 'top 75%' },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });
    gsap.from('.studio-frame', {
      scrollTrigger: { trigger: '#studio-visual', start: 'top 80%' },
      scale: 0.92,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = +el.dataset.count;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter() {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(this.targets()[0].val); },
          });
        },
      });
    });
  }

  /* ── Snaking case studies (mirrored direction) ── */
  function initWork() {
    const items = document.querySelectorAll('.proj-item');
    const card = document.getElementById('proj-card');
    const cover = document.getElementById('proj-cover');
    const dateEl = document.getElementById('proj-date');
    const descEl = document.getElementById('proj-desc');
    const preview = document.getElementById('proj-preview');
    const projCursor = document.getElementById('proj-cursor');
    const linePath = document.getElementById('fluid-line');
    const isMobile = navigator.maxTouchPoints > 1;

    if (!items.length || !card || !linePath) return;

    let currentIdx = -1;
    let projectsVisible = false;
    let currentUrl = '';
    gsap.set(card, { opacity: 0 });

    items.forEach((item) => {
      const img = new Image();
      img.src = item.dataset.img;
    });

    ScrollTrigger.create({
      trigger: '#projects',
      start: 'top 35%',
      end: 'bottom 75%',
      onEnter: () => { preview.classList.add('visible'); projectsVisible = true; },
      onLeave: () => { preview.classList.remove('visible'); projectsVisible = false; },
      onEnterBack: () => { preview.classList.add('visible'); projectsVisible = true; },
      onLeaveBack: () => { preview.classList.remove('visible'); projectsVisible = false; },
    });

    /* Stroke draws top → bottom along the path */
    const lineLen = linePath.getTotalLength();
    gsap.set(linePath, { strokeDasharray: lineLen, strokeDashoffset: lineLen });
    gsap.to(linePath, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 70%',
        end: 'bottom 20%',
        scrub: 1,
      },
    });

    /* Item parallax — shifts LEFT (original shifted right +80) */
    const itemQuickX = [...items].map((item) =>
      gsap.quickTo(item, 'x', { duration: 0.6, ease: 'power2.out' })
    );

    function deactivateAll() {
      if (currentIdx >= 0) items[currentIdx].classList.remove('active');
      currentIdx = -1;
      gsap.to(card, { opacity: 0, duration: 0.25, ease: 'power2.in' });
    }

    function activateProject(i) {
      if (i === currentIdx) return;
      if (currentIdx >= 0) items[currentIdx].classList.remove('active');
      items[i].classList.add('active');

      const setMeta = () => {
        cover.src = items[i].dataset.img;
        dateEl.textContent = items[i].dataset.date;
        if (descEl) descEl.textContent = items[i].dataset.desc || '';
        currentUrl = items[i].dataset.url || '';
        card.classList.toggle('has-link', Boolean(currentUrl));
        projCursor.textContent = currentUrl ? 'View site' : 'View project';
      };

      if (currentIdx === -1) {
        setMeta();
        gsap.to(card, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(card, {
          opacity: 0,
          duration: 0.18,
          ease: 'power2.in',
          onComplete: () => {
            setMeta();
            gsap.to(card, { opacity: 1, duration: 0.3, ease: 'power2.out' });
          },
        });
      }
      currentIdx = i;
    }

    function onProjectsScroll() {
      if (!projectsVisible) {
        if (currentIdx >= 0) deactivateAll();
        return;
      }
      const cy = window.innerHeight / 2;
      const halfH = window.innerHeight / 2;
      let closestIdx = -1;
      let closestDist = Infinity;

      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const itemCy = rect.top + rect.height / 2;
        const dist = Math.abs(itemCy - cy);
        if (!isMobile) {
          itemQuickX[i](-Math.min(dist / halfH, 1) * 80);
        } else {
          itemQuickX[i](0);
        }
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });

      if (closestIdx >= 0 && closestDist < window.innerHeight * 0.24) {
        activateProject(closestIdx);
      } else {
        deactivateAll();
      }
    }

    lenis.on('scroll', onProjectsScroll);
    onProjectsScroll();

    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        activateProject(i);
        let docTop = 0;
        let el = item;
        while (el) {
          docTop += el.offsetTop;
          el = el.offsetParent;
        }
        lenis.scrollTo(docTop - window.innerHeight / 2 + item.offsetHeight / 2, { duration: 1.2 });
      });
    });

    if (isMobile || reduced) return;

    const qCursorX = gsap.quickTo(projCursor, 'left', { duration: 0.35, ease: 'power3.out' });
    const qCursorY = gsap.quickTo(projCursor, 'top', { duration: 0.35, ease: 'power3.out' });
    let tiltTargetRY = 0;
    let tiltTargetRX = 0;
    let tiltRY = 0;
    let tiltRX = 0;

    cover.addEventListener('mouseenter', () => projCursor.classList.add('active'));
    cover.addEventListener('mouseleave', () => projCursor.classList.remove('active'));
    card.addEventListener('click', () => {
      if (currentUrl) window.open(currentUrl, '_blank', 'noopener,noreferrer');
    });

    document.addEventListener('mousemove', (e) => {
      if (projectsVisible) {
        qCursorX(e.clientX);
        qCursorY(e.clientY);
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const ry = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
        const rx = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
        tiltTargetRY = ry * 6;
        tiltTargetRX = -rx * 5;
      }
    });

    gsap.ticker.add(() => {
      if (!projectsVisible) return;
      tiltRY += (tiltTargetRY - tiltRY) * 0.12;
      tiltRX += (tiltTargetRX - tiltRX) * 0.12;
      card.style.transform =
        'rotateY(' + tiltRY.toFixed(2) + 'deg) rotateX(' + tiltRX.toFixed(2) + 'deg)';
    });

    items.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 52%',
        end: 'bottom 48%',
        onEnter: () => { lenis.options.lerp = 0.04; },
        onLeave: () => { lenis.options.lerp = 0.08; },
        onEnterBack: () => { lenis.options.lerp = 0.04; },
        onLeaveBack: () => { lenis.options.lerp = 0.08; },
      });
    });
  }

  /* ── App Store cards ── */
  function initApps() {
    gsap.from('.app-card', {
      scrollTrigger: { trigger: '#apps', start: 'top 75%' },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }

  /* ── Process orbit ── */
  function initProcess() {
    const nodes = document.querySelectorAll('.orbit-node');
    const ringWrap = document.getElementById('orbit-ring-wrap');
    const baseTilt = -32;

    if (ringWrap) {
      gsap.set(ringWrap, { rotation: baseTilt, transformOrigin: '50% 50%' });
    }

    ScrollTrigger.create({
      trigger: '#process',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#process-pin',
      scrub: 1,
      onUpdate(self) {
        const step = Math.min(3, Math.floor(self.progress * 4));
        nodes.forEach((n, i) => n.classList.toggle('active', i === step));
        if (ringWrap) {
          gsap.set(ringWrap, { rotation: baseTilt + self.progress * 90 });
        }
      },
    });
  }

  /* ── Stack manifesto scroll ── */
  function initStack() {
    const categories = [
      { id: 'design', label: 'Design' },
      { id: 'frontend', label: 'Frontend' },
      { id: 'motion', label: 'Motion' },
      { id: 'mobile', label: 'Mobile' },
      { id: 'backend', label: 'Backend' },
      { id: 'ai', label: 'AI' },
    ];
    const catEl = document.getElementById('stack-cat');
    const words = document.querySelectorAll('.s-word');
    const tags = document.querySelectorAll('.stack-tag');
    if (!catEl || !words.length) return;

    let activeIdx = -1;

    function setCategory(idx) {
      if (idx === activeIdx) return;
      activeIdx = idx;
      const { id, label } = categories[idx];
      catEl.textContent = label;
      words.forEach((w) => w.classList.toggle('active', w.dataset.cat === id));
      tags.forEach((t) => {
        const match = t.dataset.cat === id;
        t.classList.toggle('active', match);
        t.classList.toggle('dimmed', !match);
      });
    }

    ScrollTrigger.create({
      trigger: '#stack',
      start: 'top top',
      end: 'bottom bottom',
      pin: '#stack-pin',
    });

    ScrollTrigger.create({
      trigger: '#stack',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      onUpdate(self) {
        const idx = Math.min(
          categories.length - 1,
          Math.floor(self.progress * categories.length)
        );
        setCategory(idx);
      },
    });

    setCategory(0);
  }

  /* ── Finale: reverse intro — Alvin Shiu end state ── */
  function initContact() {
    const section = document.getElementById('contact');
    const pin = document.getElementById('finale-pin');
    const entranceBg = document.getElementById('finale-entrance-bg');
    const signature = document.getElementById('finale-signature');
    const finaleDot = document.getElementById('finale-i-dot');

    if (!section || !pin) return;

    let finaleOrigin = null;

    function layoutFinale() {
      layoutSignatureName(
        'finale-svg',
        'finale-letters',
        'finale-i-group',
        'finale-i-stem',
        'finale-i-dot'
      );
      if (finaleDot) {
        finaleOrigin = getRevealOrigin(finaleDot, entranceBg);
      }
    }

    function updateEntrance(p) {
      if (!entranceBg || !finaleOrigin) return;

      const coverRadiusPx = finaleOrigin.coverScale * finaleOrigin.baseRadius;
      const radiusPx =
        coverRadiusPx * (1 - p) + finaleOrigin.endRadiusPx * p;
      setShrinkMaskRadius(radiusPx, finaleOrigin, entranceBg);

      if (signature) {
        signature.style.opacity = String(Math.min(1, p * 1.35));
      }
    }

    if (!reduced) {
      layoutFinale();
      updateEntrance(0);

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: pin,
        onRefresh: layoutFinale,
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.55,
        onRefresh: layoutFinale,
        onUpdate(self) {
          if (finaleDot) finaleOrigin = getRevealOrigin(finaleDot, entranceBg);
          updateEntrance(self.progress);
        },
      });

      window.addEventListener('resize', layoutFinale);
    } else {
      layoutFinale();
      if (entranceBg && finaleOrigin) {
        setShrinkMaskRadius(finaleOrigin.endRadiusPx, finaleOrigin, entranceBg);
      }
      if (signature) signature.style.opacity = '1';
    }
  }

  /* ── Footer back to top ── */
  function initFooter() {
    document.querySelector('.footer-top')?.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.5 });
    });
  }

  function initSite() {
    initHeader();
    initHero();
    initManifesto();
    initStudio();
    initWork();
    initApps();
    initProcess();
    initStack();
    initContact();
    initContactModal();
    initPortfolioModal();
    initFooter();
    ScrollTrigger.refresh();
  }

  function startIntro() {
    if (document.fonts?.ready) {
      document.fonts.ready.then(runIntro);
    } else {
      runIntro();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startIntro);
  } else {
    startIntro();
  }
})();
