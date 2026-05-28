(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0;
  let height = 0;
  let dpr = 1;
  let points = [];
  let frame = 0;
  let raf = 0;

  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0.58';
  canvas.style.mixBlendMode = 'screen';
  canvas.style.contain = 'strict';
  document.body.prepend(canvas);

  function pointCount() {
    const area = window.innerWidth * window.innerHeight;
    if (window.innerWidth < 560) return 18;
    return Math.min(42, Math.max(24, Math.round(area / 42000)));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.8);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedPoints();
    draw(0);
  }

  function seedPoints() {
    const count = pointCount();
    points = Array.from({ length: count }, (_, index) => {
      const band = index / Math.max(1, count - 1);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.06,
        r: Math.random() * 0.9 + 0.55,
        phase: Math.random() * Math.PI * 2,
        tone: band < 0.34 ? 'cyan' : 'violet',
      };
    });
  }

  function movePoint(point) {
    point.x += point.vx;
    point.y += point.vy;
    if (point.x < -30) point.x = width + 30;
    if (point.x > width + 30) point.x = -30;
    if (point.y < -30) point.y = height + 30;
    if (point.y > height + 30) point.y = -30;
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    const maxDistance = width < 560 ? 118 : 165;
    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      if (!reduceMotion) movePoint(a);

      for (let j = i + 1; j < points.length; j += 1) {
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > maxDistance) continue;

        const strength = (1 - distance / maxDistance) * 0.17;
        const pulse = 0.72 + Math.sin(time * 0.00045 + a.phase + b.phase) * 0.28;
        ctx.strokeStyle = `rgba(126, 211, 232, ${strength * pulse})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const point of points) {
      const pulse = 0.72 + Math.sin(time * 0.00055 + point.phase) * 0.28;
      const color = point.tone === 'cyan' ? '26, 199, 213' : '179, 136, 251';
      ctx.fillStyle = `rgba(${color}, ${0.22 * pulse})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick(time) {
    draw(time);
    frame = (frame + 1) % 1000;
    raf = window.requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.cancelAnimationFrame(raf);
      raf = 0;
      return;
    }
    if (!reduceMotion && !raf) raf = window.requestAnimationFrame(tick);
  });

  if (!reduceMotion) raf = window.requestAnimationFrame(tick);
})();
