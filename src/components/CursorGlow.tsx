'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = ref.current;
    if (!glow) return;

    let mouseX = -200;
    let mouseY = -200;
    let currentX = -200;
    let currentY = -200;
    let rafId: number;

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;
      glow.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouse);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[9999] opacity-30 transition-opacity duration-1000 hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(107,76,230,0.15) 0%, rgba(201,168,76,0.05) 40%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
  );
}
