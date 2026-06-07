'use client';

import { useEffect, useRef } from 'react';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
    const isMobile = window.innerWidth < 768;
    const isLowEnd = !matchMedia('(min-resolution: 1.5dppx)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SKIP = isMobile ? 3 : (isLowEnd ? 2 : 1);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      const maxStars = isMobile ? 25 : (isLowEnd ? 40 : 100);
      const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / (isMobile ? 12000 : 6000)), maxStars);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.0 + 0.2,
        opacity: Math.random() * 0.3 + 0.05,
        speed: Math.random() * 0.012 + 0.002,
      }));
    };

    let frameCount = 0;
    const draw = (timestamp: number) => {
      frameCount++;
      if (frameCount % SKIP !== 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = performance.now();
      stars.forEach((star) => {
        const twinkle = Math.sin(time * 0.001 * star.speed * 8) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };

    resize();
    initStars();

    const startTimer = setTimeout(() => {
      animationId = requestAnimationFrame(draw);
      window.addEventListener('resize', () => { resize(); initStars(); });
    }, 200);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(startTimer);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ willChange: 'transform' }}
    />
  );
}
