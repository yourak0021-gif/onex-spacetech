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
      {words.map((word, w) => (
        <span key={w} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char) => {
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
      )).reduce((acc: React.ReactNode[], el, i) => i === 0 ? [el] : [...acc, <span key={`s${i}`} style={{ display: 'inline-block', width: '0.3em' }}>{'\u00A0'}</span>, el], [])}
    </span>
  );
}

export default function Hero({ communityName, tagline, inspirational }: HeroProps) {
  const scrollDown = () => {
    document.querySelector('#stats')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40 z-[1]" />

      {/* Aurora glow */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 z-0 animate-aurora">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/[0.08] via-secondary/[0.04] to-accent/[0.03] blur-[120px]" />
      </div>
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] z-0 animate-float-drift" style={{ animationDelay: '-2s' }}>
        <div className="w-full h-full rounded-full bg-gradient-to-bl from-secondary/[0.04] via-transparent to-transparent blur-[100px]" />
      </div>
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] z-0 animate-float-drift" style={{ animationDelay: '-5s' }}>
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-accent/[0.03] via-transparent to-transparent blur-[80px]" />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-[15%] left-[10%] z-[1] animate-float-drift" style={{ animationDelay: '0s' }}>
        <div className="w-4 h-4 border border-primary/20 rounded-full animate-morph" />
      </div>
      <div className="absolute top-[25%] right-[15%] z-[1] animate-float-drift" style={{ animationDelay: '-3s' }}>
        <div className="w-3 h-3 bg-primary/10 rotate-45" />
      </div>
      <div className="absolute bottom-[30%] left-[20%] z-[1] animate-float-drift" style={{ animationDelay: '-6s' }}>
        <div className="w-5 h-5 border border-white/10 rounded-full" />
      </div>
      <div className="absolute top-[40%] right-[8%] z-[1] animate-float-drift" style={{ animationDelay: '-1s' }}>
        <div className="w-2 h-2 bg-secondary/20 rounded-full" />
      </div>
      <div className="absolute bottom-[20%] right-[25%] z-[1] animate-float-drift" style={{ animationDelay: '-4s' }}>
        <div className="w-3 h-3 border border-accent/20 rotate-12" />
      </div>

      {/* Orbiting rings - desktop only */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] animate-orbit" style={{ width: 0, height: 0 }}>
        <div className="w-3 h-3 rounded-full bg-primary/20 blur-[1px]" />
      </div>
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] animate-orbit-reverse" style={{ width: 0, height: 0 }}>
        <div className="w-2 h-2 rounded-full bg-secondary/15" />
      </div>

      {/* Gradient fades */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-space-dark z-[2]" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-space-dark to-transparent z-[2]" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24 md:pt-28">
        <div className="mb-6 animate-[fadeSlideUp_0.5s_0.1s_ease_forwards] opacity-0">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-[11px] text-white/30 uppercase tracking-[0.3em] font-light">
              Exclusive Private Community
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-5 tracking-tight leading-[1.05]">
          <StaggerText text={communityName.replace(' Private', '')} />
          <br />
          <span className="text-white/[0.07] text-lg sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.25em]">
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
    </section>
  );
}
