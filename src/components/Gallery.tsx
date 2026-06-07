'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import type { GalleryItem } from '@/types/content';

export default function Gallery({ images }: { images: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [page, setPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const itemsPerView = 3;
  const totalSlides = images.length;
  const totalPages = Math.max(1, Math.ceil(totalSlides / itemsPerView));

  const scrollToPage = useCallback((p: number) => {
    const container = containerRef.current;
    if (!container) return;
    const child = container.children[p * itemsPerView] as HTMLElement;
    if (!child) return;
    container.scrollTo({ left: child.offsetLeft - (p === 0 ? 4 : 12), behavior: 'smooth' });
    setPage(p);
  }, []);

  const next = useCallback(() => scrollToPage(Math.min(page + 1, totalPages - 1)), [page, totalPages, scrollToPage]);
  const prev = useCallback(() => scrollToPage(Math.max(page - 1, 0)), [page, scrollToPage]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    const container = containerRef.current;
    if (container) {
      scrollLeftStart.current = container.scrollLeft;
      container.style.scrollBehavior = 'auto';
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = startX.current - e.clientX;
    const container = containerRef.current;
    if (container) container.scrollLeft = scrollLeftStart.current + dx;
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const container = containerRef.current;
    if (container) {
      container.style.scrollBehavior = 'smooth';
      const snapIdx = Math.round(container.scrollLeft / (container.clientWidth * 0.95));
      const p = Math.max(0, Math.min(Math.floor(snapIdx / itemsPerView), totalPages - 1));
      setPage(p);
    }
  }, [totalPages]);

  useEffect(() => {
    if (!inView || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setPage((p) => {
        const nextP = p >= totalPages - 1 ? 0 : p + 1;
        scrollToPage(nextP);
        return nextP;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [inView, totalSlides, totalPages, scrollToPage]);

  if (!images || images.length === 0) return null;

  return (
    <section id="gallery" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.01] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/25 uppercase tracking-[0.3em] font-light mb-5">
            Explore
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Mission <span className="text-gradient">Log</span>
          </h2>
          <p className="text-white/30 max-w-xl mx-auto text-sm font-light">
            Capturing milestones across our journey
          </p>
        </motion.div>

        <div className="relative select-none">
          <div
            ref={containerRef}
            className="flex gap-4 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {images.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
                className="min-w-[calc(100%/1.1)] sm:min-w-[calc(50%-8px)] lg:min-w-[calc(33.333%-11px)] shrink-0 group relative pointer-events-auto snap-start"
              >
                <div
                  className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-white/[0.02] border border-white/[0.04] cursor-pointer"
                  onClick={() => window.open(item.url, '_blank')}
                >
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
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={prev}
                disabled={page === 0}
                className="p-2 rounded-full glass hover:bg-white/5 disabled:opacity-20 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                  <path d="M12 4l-6 6 6 6" />
                </svg>
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToPage(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      page === i ? 'bg-primary w-4' : 'bg-white/15 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-full glass hover:bg-white/5 disabled:opacity-20 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                  <path d="M8 4l6 6-6 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

