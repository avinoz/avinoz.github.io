/* portfolio26 — hero + contact canvas effects */
(function () {
  'use strict';

  function createParticleCanvas(canvas, options = {}) {
    const ctx = canvas.getContext('2d');
    const drops = [];
    const count = options.count ?? 120;
    const color = options.color ?? 'rgba(255, 20, 96, 0.58)';
    const speed = options.speed ?? 1;
    let w = 0;
    let h = 0;
    let running = false;
    let raf = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initDrops() {
      drops.length = 0;
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          len: 8 + Math.random() * 22,
          vy: (2 + Math.random() * 4) * speed,
          opacity: 0.1 + Math.random() * 0.5,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      drops.forEach((d) => {
        ctx.beginPath();
        ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${d.opacity})`);
        ctx.lineWidth = 1.2;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.len);
        ctx.stroke();
        d.y += d.vy;
        d.x -= 0.3;
        if (d.y > h + d.len) {
          d.y = -d.len;
          d.x = Math.random() * w;
        }
      });
    }

    function loop() {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    }

    return {
      start() {
        if (running) return;
        running = true;
        resize();
        initDrops();
        loop();
      },
      stop() {
        running = false;
        cancelAnimationFrame(raf);
      },
      resize() {
        resize();
        initDrops();
      },
    };
  }

  /* Hero: particles + soft gradient wash */
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const heroCtx = heroCanvas.getContext('2d');
    const particles = createParticleCanvas(heroCanvas, { count: 90, speed: 0.8 });
    let mx = 0.5;
    let my = 0.5;

    function drawHeroBg() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = heroCanvas.clientWidth;
      const h = heroCanvas.clientHeight;
      heroCanvas.width = w * dpr;
      heroCanvas.height = h * dpr;
      heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const grad = heroCtx.createRadialGradient(
        w * mx, h * my, 0,
        w * mx, h * my, w * 0.7
      );
      grad.addColorStop(0, 'rgba(0, 168, 232, 0.38)');
      grad.addColorStop(0.4, 'rgba(255, 20, 96, 0.24)');
      grad.addColorStop(0.7, 'rgba(84, 32, 255, 0.2)');
      grad.addColorStop(1, 'rgba(255, 240, 245, 0)');
      heroCtx.fillStyle = '#fff0f5';
      heroCtx.fillRect(0, 0, w, h);
      heroCtx.fillStyle = grad;
      heroCtx.fillRect(0, 0, w, h);
    }

    window.addEventListener('mousemove', (e) => {
      mx += (e.clientX / window.innerWidth - mx) * 0.04;
      my += (e.clientY / window.innerHeight - my) * 0.04;
    }, { passive: true });

    window.HeroCanvas = {
      start() {
        drawHeroBg();
        particles.start();
        const tick = () => {
          drawHeroBg();
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      resize() {
        drawHeroBg();
        particles.resize();
      },
    };
    window.addEventListener('resize', () => window.HeroCanvas.resize());
  }
})();
