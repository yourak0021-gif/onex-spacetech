'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  hue: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 4000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.2,
        opacity: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.03 + 0.005,
        hue: Math.random() > 0.85 ? (Math.random() > 0.5 ? 260 : 42) : 0,
      }));
    };

    const spawnShootingStar = () => {
      if (shootingStars.length > 2) return;
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.3,
        vx: (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.random() * 2 + 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const twinkle = Math.sin(Date.now() * 0.001 * star.speed * 8) * 0.3 + 0.7;
        const opacity = star.opacity * twinkle;

        if (star.hue > 0) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
          const hueColor = star.hue === 260 ? '107, 76, 230' : '201, 168, 76';
          ctx.fillStyle = `rgba(${hueColor}, ${opacity * 0.3})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        const brightness = star.hue > 0 ? 255 : 255;
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${opacity})`;
        ctx.fill();
      });

      shootingStars = shootingStars.filter((s) => {
        s.life++;
        if (s.life >= s.maxLife) return false;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        const tailX = s.x - s.vx * (s.life / s.maxLife) * 8;
        const tailY = s.y - s.vy * (s.life / s.maxLife) * 8;
        ctx.lineTo(tailX, tailY);
        const alpha = (1 - s.life / s.maxLife) * 0.8;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        s.x += s.vx;
        s.y += s.vy;
        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    initStars();

    const shootingInterval = setInterval(() => {
      if (Math.random() > 0.6) spawnShootingStar();
    }, 3000);

    draw();

    window.addEventListener('resize', () => {
      resize();
      initStars();
    });

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(shootingInterval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
