'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import type { GalleryItem } from '@/types/content';

export default function Gallery({ images }: { images: GalleryItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [current, setCurrent] = useState(0);
  const [noTransition, setNoTransition] = useState(true);
  const [offsets, setOffsets] = useState<number[]>([]);

  const total = images.length;
  const itemsPerView = 3;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerView));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.unobserve(el); }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const slides = [images[total - 1], ...images, images[0]];

  useLayoutEffect(() => {
    if (!inView) return;
    const container = containerRef.current;
    if (!container) return;
    const children = container.querySelectorAll(':scope > div > div');
    if (!children.length) return;
    const computed: number[] = [];
    children.forEach((child) => computed.push((child as HTMLElement).offsetLeft));
    setOffsets(computed);
    setNoTransition(false);
    setCurrent(1);
  }, [inView]);

  const goTo = useCallback((target: number) => {
    setNoTransition(false);
    setCurrent(target);
  }, []);

  const next = useCallback(() => {
    const nextIdx = current + 1;
    if (nextIdx >= slides.length - 1) {
      setNoTransition(false);
      setCurrent(nextIdx);
      setTimeout(() => {
        setNoTransition(true);
        setCurrent(1);
      }, 500);
    } else {
      setNoTransition(false);
      setCurrent(nextIdx);
    }
  }, [current, slides.length]);

  const prev = useCallback(() => {
    const prevIdx = current - 1;
    if (prevIdx <= 0) {
      setNoTransition(false);
      setCurrent(prevIdx);
      setTimeout(() => {
        setNoTransition(true);
        setCurrent(slides.length - 2);
      }, 500);
    } else {
      setNoTransition(false);
      setCurrent(prevIdx);
    }
  }, [current, slides.length]);

  useEffect(() => {
    if (!inView || total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [inView, total, next]);

  if (!images || images.length === 0) return null;

  const page = Math.floor(((current - 1 + total) % total) / itemsPerView);
  const offsetX = offsets[current] ?? 0;

  return (
    <section id="gallery" className="section-padding relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.01] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-8 md:mb-12 transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[15px]'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/25 uppercase tracking-[0.3em] font-light mb-5">
            Explore
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Mission <span className="text-gradient">Log</span>
          </h2>
          <p className="text-white/30 max-w-xl mx-auto text-sm font-light">
            Capturing milestones across our journey
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div ref={containerRef}>
            <div
              ref={trackRef}
              className="flex gap-4 will-change-transform"
              style={{
                transform: `translateX(-${offsetX}px)`,
                transition: noTransition ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {slides.map((item, i) => (
                <div
                  key={`${item.url}-${i}`}
                  className="min-w-[calc(100%/1.1)] sm:min-w-[calc(50%-8px)] lg:min-w-[calc(33.333%-11px)] shrink-0 group relative"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0) scale(1)' : 'translateY(25px) scale(0.95)',
                    transition: `opacity 0.5s ${i * 0.04}s, transform 0.5s ${i * 0.04}s`,
                  }}
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-white/[0.02] border border-white/[0.04]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${item.url})` }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white/80 text-xs font-light leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[10px] text-white/60 border border-white/10">
                        {String(((i - 1 + total) % total) + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={prev}
                className="p-2 rounded-full glass hover:bg-white/5 disabled:opacity-20 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60"><path d="M12 4l-6 6 6 6" /></svg>
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i * itemsPerView + 1)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      page === i ? 'bg-primary w-4' : 'bg-white/15 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2 rounded-full glass hover:bg-white/5 disabled:opacity-20 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60"><path d="M8 4l6 6-6 6" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
