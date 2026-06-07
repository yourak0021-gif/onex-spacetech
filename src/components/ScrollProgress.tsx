'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-[2px]">
      <div
        className="h-full transition-[width] duration-100 ease-out"
        style={{
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #6B4CE6, #C9A84C, #6B4CE6)',
          backgroundSize: '200% 100%',
          boxShadow: '0 0 12px rgba(107,76,230,0.4)',
        }}
      />
    </div>
  );
}
