'use client';

import { useEffect, useRef } from 'react';

/**
 * CursorGlow — a smooth, cursor-following radial glow effect.
 *
 * Technique:
 *  - Mouse position is captured on `mousemove` and stored in a ref (no re-renders).
 *  - A `requestAnimationFrame` loop lerps the displayed position toward the target,
 *    producing butter-smooth lag that makes the glow feel "weighted".
 *  - A second raf loop detects whether the cursor sits over an interactive element
 *    and lerps the glow size between a base radius and an expanded radius.
 *  - All DOM mutations happen via direct style writes — zero React state updates.
 *
 * Performance:
 *  - Single raf loop, runs only while mounted.
 *  - `pointer-events: none` — never blocks clicks or hover on other elements.
 *  - `will-change: transform` on the glow div hints the compositor to keep it on GPU.
 *  - Opacity is 0 until the first mouse move so it never flashes on page load.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Live mouse target (raw)
  const targetX = useRef(-1000);
  const targetY = useRef(-1000);

  // Smoothed position (lerped)
  const currentX = useRef(-1000);
  const currentY = useRef(-1000);

  // Glow size lerp  (base ↔ expanded)
  const currentSize = useRef(480);
  const targetSize = useRef(480);

  const BASE_SIZE = 480;
  const EXPANDED_SIZE = 700;
  const LERP_POS = 0.08;   // position smoothing (lower = more lag = dreamier)
  const LERP_SIZE = 0.06;  // size smoothing

  // Interactive element detector
  function isInteractive(el: Element | null): boolean {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (['a', 'button', 'input', 'select', 'textarea', 'label'].includes(tag)) return true;
    if (el.getAttribute('role') === 'button') return true;
    if ((el as HTMLElement).style?.cursor === 'pointer') return true;
    return false;
  }

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    // Avoid flashing before any mouse event
    glow.style.opacity = '0';

    let hasMoused = false;

    function onMouseMove(e: MouseEvent) {
      targetX.current = e.clientX;
      targetY.current = e.clientY;

      // Detect interactive element
      const el = document.elementFromPoint(e.clientX, e.clientY);
      let node: Element | null = el;
      let found = false;
      for (let i = 0; i < 4 && node; i++) {
        if (isInteractive(node)) { found = true; break; }
        node = node.parentElement;
      }
      targetSize.current = found ? EXPANDED_SIZE : BASE_SIZE;

      if (!hasMoused) {
        hasMoused = true;
        currentX.current = e.clientX;
        currentY.current = e.clientY;
        if (glow) glow.style.opacity = '1';
      }
    }

    function onMouseLeave() {
      // Fade out when cursor leaves window
      if (glow) glow.style.opacity = '0';
    }

    function onMouseEnter() {
      if (glow && hasMoused) glow.style.opacity = '1';
    }

    function loop() {
      // Lerp position
      currentX.current += (targetX.current - currentX.current) * LERP_POS;
      currentY.current += (targetY.current - currentY.current) * LERP_POS;

      // Lerp size
      currentSize.current += (targetSize.current - currentSize.current) * LERP_SIZE;

      if (glow) {
        const scale = currentSize.current / 1000;
        glow.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0) scale(${scale})`;
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="fixed pointer-events-none z-[9999] will-change-transform transition-opacity duration-700 top-0 left-0"
      style={{
        width: '1000px',
        height: '1000px',
        marginLeft: '-500px',
        marginTop: '-500px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(34,211,238,0.055) 0%, rgba(59,130,246,0.035) 40%, transparent 72%)',
        mixBlendMode: 'screen',
        opacity: 0,
        transform: 'translate3d(-1000px, -1000px, 0) scale(0.48)',
      }}
    />
  );
}
