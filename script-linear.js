// Linear iridescence controller (diagonal-aware)
// Moves a linear gradient mask across the page along the gradient axis (CSS --angle)

(() => {
  const root = document.documentElement;
  let rafId = 0;
  let pos = 50; // percentage along the gradient axis
  let px = window.innerWidth * 0.5;
  let py = window.innerHeight * 0.5;

  const apply = () => {
    rafId = 0;

    // Read angle from CSS custom property, fallback 45deg
    const cs = getComputedStyle(root);
    const angleStr = cs.getPropertyValue('--angle').trim() || '45deg';
    const match = angleStr.match(/(-?\d+(?:\.\d+)?)deg/);
    const angleDeg = match ? parseFloat(match[1]) : 45;
    const a = (angleDeg * Math.PI) / 180;

    // CSS angle: 0deg is up, 90deg is right. Convert to screen vector (x right, y down)
    const ux = Math.sin(a);
    const uy = -Math.cos(a);

    const W = Math.max(1, window.innerWidth);
    const H = Math.max(1, window.innerHeight);

    // Project pointer onto axis and normalize to [0,1] across the rectangle
    const s = px * ux + py * uy; // current projection
    const sMin = Math.min(0, W * ux) + Math.min(0, H * uy);
    const sMax = Math.max(0, W * ux) + Math.max(0, H * uy);
    const denom = Math.max(1e-6, sMax - sMin);
    const t = (s - sMin) / denom;

    pos = Math.max(0, Math.min(100, t * 100));
    root.style.setProperty('--pos', pos.toFixed(2) + '%');
  };

  const schedule = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(apply);
  };

  const onPointerMove = (e) => {
    if (e.touches && e.touches[0]) {
      px = e.touches[0].clientX;
      py = e.touches[0].clientY;
    } else {
      px = e.clientX;
      py = e.clientY;
    }
    schedule();
  };

  const center = () => {
    px = window.innerWidth * 0.5;
    py = window.innerHeight * 0.5;
    schedule();
  };

  // Init
  center();

  // Mouse / pointer
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // Touch
  window.addEventListener('touchstart', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  // Recalculate on resize (axis length changes)
  window.addEventListener('resize', center);
})();
