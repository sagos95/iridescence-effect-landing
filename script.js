// Interactive iridescence mask controller
// Updates CSS variables --mx and --my to move the radial mask with pointer

(() => {
  const root = document.documentElement;
  let rafId = 0;
  let px = window.innerWidth * 0.5;
  let py = window.innerHeight * 0.5;

  const apply = () => {
    rafId = 0;
    root.style.setProperty('--mx', px + 'px');
    root.style.setProperty('--my', py + 'px');
  };

  const schedule = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(apply);
  };

  const updateFromPointer = (x, y) => {
    px = Math.max(0, Math.min(window.innerWidth, x));
    py = Math.max(0, Math.min(window.innerHeight, y));
    schedule();
  };

  const onPointerMove = (e) => {
    if (e.touches && e.touches[0]) {
      const t = e.touches[0];
      updateFromPointer(t.clientX, t.clientY);
    } else {
      updateFromPointer(e.clientX, e.clientY);
    }
  };

  const centerMask = () => {
    updateFromPointer(window.innerWidth * 0.5, window.innerHeight * 0.5);
  };

  // Init
  centerMask();

  // Mouse / pointer
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // Touch
  window.addEventListener('touchstart', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  // Resize keeps mask centered when viewport changes
  window.addEventListener('resize', centerMask);
})();
