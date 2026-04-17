document.addEventListener('DOMContentLoaded', function() {
  const alignTabsWithHeaderTitle = () => {
    const title = document.querySelector('.md-header__title .md-header__topic:first-child .md-ellipsis')
      || document.querySelector('.md-header__title .md-ellipsis');
    const firstTab = document.querySelector('.md-tabs__item:first-child');

    if (!title || !firstTab) {
      return;
    }

    const titleLeft = title.getBoundingClientRect().left;
    const firstTabPadding = Number.parseFloat(window.getComputedStyle(firstTab).paddingLeft) || 0;
    const offset = Math.max(0, titleLeft - firstTabPadding);
    document.documentElement.style.setProperty('--mesh-tabs-offset', `${offset.toFixed(2)}px`);
  };

  alignTabsWithHeaderTitle();
  window.addEventListener('resize', alignTabsWithHeaderTitle, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignTabsWithHeaderTitle);
  }

  let particleFrame = 0;
  const particleCanvas = document.querySelector('[data-particle-field]');
  if (particleCanvas) {
    const context = particleCanvas.getContext('2d');
    if (!context) {
      return;
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;

    const readCssVariable = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const getParticlePalette = () => ({
      particles: [
        readCssVariable('--mesh-particle-primary') || '#087669',
        readCssVariable('--mesh-particle-secondary') || '#cf3f51',
        readCssVariable('--mesh-particle-tertiary') || '#d4b106',
        readCssVariable('--mesh-particle-quaternary') || '#267f93'
      ],
      link: readCssVariable('--mesh-particle-primary') || '#087669',
      orbit: readCssVariable('--mesh-particle-orbit') || '#101513'
    });

    const particles = Array.from({ length: 68 }, (_, index) => {
      const lane = index % 7;
      return {
        angle: index * 0.52,
        radius: 44 + lane * 28 + (index % 5) * 7,
        speed: 0.00007 + (lane + 1) * 0.000012,
        size: 1 + (index % 4) * 0.34,
        drift: (index % 9) * 0.18,
        colorIndex: index % 3
      };
    });

    const flowParticles = Array.from({ length: 28 }, (_, index) => ({
      phase: index / 28,
      speed: 0.00007 + (index % 6) * 0.00001,
      band: (index % 9 - 4) * 20,
      size: 1 + (index % 4) * 0.26,
      length: 14 + (index % 5) * 3,
      colorIndex: index % 4
    }));

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = particleCanvas.clientWidth;
      height = particleCanvas.clientHeight;
      particleCanvas.width = Math.floor(width * ratio);
      particleCanvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = timestamp => {
      context.clearRect(0, 0, width, height);

      const palette = getParticlePalette();
      const centerX = width * 0.72;
      const centerY = height * 0.52;
      const field = particles.map(particle => {
        const angle = particle.angle + timestamp * particle.speed;
        const pulse = Math.sin(timestamp * 0.00035 + particle.drift) * 13;
        return {
          x: centerX + Math.cos(angle) * (particle.radius * 1.75 + pulse),
          y: centerY + Math.sin(angle * 1.18) * (particle.radius + pulse * 0.5),
          size: particle.size,
          color: palette.particles[particle.colorIndex]
        };
      });

      context.save();
      context.globalAlpha = 0.18;
      context.lineWidth = 0.95;
      field.forEach((point, pointIndex) => {
        for (let nextIndex = pointIndex + 1; nextIndex < field.length; nextIndex += 1) {
          const next = field[nextIndex];
          const distance = Math.hypot(point.x - next.x, point.y - next.y);
          if (distance < 92) {
            context.strokeStyle = palette.link;
            context.globalAlpha = (92 - distance) / 420;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(next.x, next.y);
            context.stroke();
          }
        }
      });
      context.restore();

      context.save();
      context.lineCap = 'round';
      flowParticles.forEach(flow => {
        const progress = (flow.phase + timestamp * flow.speed) % 1;
        const trail = [];

        for (let step = 0; step < flow.length; step += 1) {
          const t = progress - step * 0.008;
          if (t < 0 || t > 1) {
            continue;
          }

          const x = width * 0.36 + t * width * 0.76;
          const y = centerY + flow.band + Math.sin(t * Math.PI * 2 + flow.phase * 7) * 30 + Math.cos(t * Math.PI * 4) * 8;
          trail.push({ x, y, alpha: 1 - step / flow.length });
        }

        if (trail.length > 1) {
          context.strokeStyle = palette.particles[flow.colorIndex];
          context.lineWidth = flow.size;
          context.globalAlpha = 0.22;
          context.beginPath();
          context.moveTo(trail[0].x, trail[0].y);
          trail.slice(1).forEach(point => context.lineTo(point.x, point.y));
          context.stroke();
        }

        if (trail[0]) {
          context.fillStyle = palette.particles[flow.colorIndex];
          context.globalAlpha = 0.56;
          context.beginPath();
          context.arc(trail[0].x, trail[0].y, flow.size + 0.55, 0, Math.PI * 2);
          context.fill();
        }
      });
      context.restore();

      context.save();
      context.lineWidth = 1.2;
      context.globalAlpha = 0.1;
      context.strokeStyle = palette.orbit;
      context.beginPath();
      context.ellipse(centerX, centerY, 260, 150, -0.22, timestamp * 0.00012, Math.PI * 1.55 + timestamp * 0.00012);
      context.stroke();
      context.restore();

      field.forEach(point => {
        context.fillStyle = point.color;
        context.globalAlpha = 0.54;
        context.beginPath();
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fill();
      });

      if (reducedMotion) {
        return;
      }

      particleFrame = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    draw(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const target = href && href.length > 1 ? document.querySelector(href) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    block.style.backgroundColor = '#000000';
    block.style.color = '#ffffff';
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  window.addEventListener('beforeunload', function() {
    if (particleFrame) {
      window.cancelAnimationFrame(particleFrame);
    }
  });
});
