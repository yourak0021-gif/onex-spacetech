'use client';

import { useRef, useEffect, useState } from 'react';

interface HeroProps {
  communityName: string;
  tagline: string;
  inspirational: {
    quote: string;
    author: string;
  };
}

function StaggerText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.unobserve(el); }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');
  let charIndex = 0;

  return (
    <span ref={ref} className={className}>
      {words.map((word, w) => {
        const chars = word.split('');
        const wordEl = (
          <span key={w} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {chars.map((char) => {
              const idx = charIndex++;
              return (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block',
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0) rotateX(0)' : 'translateY(30px) rotateX(-90deg)',
                    filter: inView ? 'blur(0px)' : 'blur(4px)',
                    transition: `all 0.5s ${delay + idx * 0.025}s cubic-bezier(0.22, 1, 0.36, 1)`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
        if (w < words.length - 1) {
          return (
            <span key={w} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {wordEl}
              <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
            </span>
          );
        }
        return wordEl;
      })}
    </span>
  );
}

export default function Hero({ communityName, tagline, inspirational }: HeroProps) {
  const scrollDown = () => {
    document.querySelector('#stats')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-space-dark z-[1]" />

      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[180px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24 md:pt-28">
        <div className="mb-6 animate-[fadeSlideUp_0.5s_0.1s_ease_forwards] opacity-0">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-[11px] text-white/30 uppercase tracking-[0.3em] font-light">
              Exclusive Private Community
            </span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-5 tracking-tight leading-[1.05]">
          <StaggerText text={communityName.replace(' Private', '')} />
          <br />
          <span className="text-white/[0.07] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.25em]">
            PRIVATE
          </span>
        </h1>

        <p className="text-sm md:text-base text-white/40 max-w-xl mx-auto mb-8 leading-relaxed font-light animate-[fadeSlideUp_0.7s_0.6s_ease_forwards] opacity-0">
          {tagline}
        </p>

        <div className="max-w-lg mx-auto mb-10 animate-[fadeSlideUp_0.7s_0.8s_ease_forwards] opacity-0">
          <div className="relative px-5 py-4">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 to-transparent" />
            <p className="text-white/25 text-xs italic leading-relaxed font-light">
              &ldquo;{inspirational.quote}&rdquo;
            </p>
            <p className="text-white/15 text-[11px] mt-2 tracking-wider font-light">&mdash; {inspirational.author}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[fadeSlideUp_0.7s_1s_ease_forwards] opacity-0">
          <a
            href="#stats"
            onClick={(e) => { e.preventDefault(); scrollDown(); }}
            className="btn-gradient px-7 py-2.5 rounded-full text-sm font-medium tracking-wider text-white inline-flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>Explore Our World</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          </a>
          <a
            href="#services"
            onClick={(e) => { e.preventDefault(); document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="btn-outline px-7 py-2.5 rounded-full text-sm font-medium tracking-wider text-white/50 hover:text-white/80 inline-flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Discover Capabilities
          </a>
        </div>

        <button
          onClick={scrollDown}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/10 hover:text-white/30 transition-colors animate-[fadeIn_1s_3s_ease_forwards] opacity-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[bounceY_2s_ease-in-out_infinite]"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-space-dark to-transparent z-[1]" />
    </section>
  );
}
