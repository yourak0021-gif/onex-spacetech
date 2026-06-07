'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import type { GalleryItem } from '@/types/content';

export default function Gallery({ images }: { images: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const dragOffset = useRef(0);
  const lastMove = useRef(0);
  const velHistory = useRef<number[]>([]);
  const momentumAnim = useRef<number | null>(null);

  const itemsPerView = 3;
  const totalSlides = images.length;
  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  const scrollTo = useCallback((index: number, instant = false) => {
    const container = containerRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement;
    if (!child) return;
    const gap = 16;
    const scrollLeft = child.offsetLeft - (index === 0 ? 0 : gap);
    container.scrollTo({ left: scrollLeft, behavior: instant ? 'auto' : 'smooth' });
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => {
      const nextVal = c >= maxIndex ? 0 : c + 1;
      scrollTo(nextVal);
      return nextVal;
    });
  }, [maxIndex, scrollTo]);

  const prev = useCallback(() => {
    setCurrent((c) => {
      const prevVal = Math.max(c - 1, 0);
      scrollTo(prevVal);
      return prevVal;
    });
  }, [scrollTo]);

  const goToPage = useCallback((page: number) => {
    const idx = page * itemsPerView;
    setCurrent(idx);
    scrollTo(idx);
  }, [scrollTo]);

  const applyMomentum = useCallback((vel: number) => {
    if (Math.abs(vel) < 30) return;
    let remaining = vel;
    const step = () => {
      remaining *= 0.92;
      const el = containerRef.current;
      if (!el || Math.abs(remaining) < 1) return;
      el.scrollLeft -= remaining;
      momentumAnim.current = requestAnimationFrame(step);
    };
    if (momentumAnim.current) cancelAnimationFrame(momentumAnim.current);
    momentumAnim.current = requestAnimationFrame(step);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    dragStart.current = e.clientX;
    dragOffset.current = 0;
    lastMove.current = e.clientX;
    velHistory.current = [];
    if (momentumAnim.current) {
      cancelAnimationFrame(momentumAnim.current);
      momentumAnim.current = null;
    }
    const el = containerRef.current;
    if (el) el.style.scrollBehavior = 'auto';
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = e.clientX - lastMove.current;
    lastMove.current = e.clientX;
    dragOffset.current += delta;
    velHistory.current.push(delta);
    if (velHistory.current.length > 5) velHistory.current.shift();
    const el = containerRef.current;
    if (el) el.scrollLeft -= delta;
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const el = containerRef.current;
    if (el) el.style.scrollBehavior = 'smooth';
    const avgVel = velHistory.current.length > 0
      ? velHistory.current.reduce((a, b) => a + b, 0) / velHistory.current.length
      : 0;
    if (Math.abs(dragOffset.current) > 60) {
      if (dragOffset.current > 0) prev();
      else next();
    } else if (Math.abs(avgVel) > 1) {
      applyMomentum(avgVel * 4);
    }
    dragOffset.current = 0;
    velHistory.current = [];
  }, [dragging, prev, next, applyMomentum]);

  useEffect(() => {
    return () => {
      if (momentumAnim.current) cancelAnimationFrame(momentumAnim.current);
    };
  }, []);

  useEffect(() => {
    if (!inView || totalSlides <= itemsPerView) return;
    scrollTo(0);
    const timer = setInterval(() => {
      setCurrent((c) => {
        const nextVal = c >= maxIndex ? 0 : c + 1;
        scrollTo(nextVal);
        return nextVal;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [inView, maxIndex, totalSlides, scrollTo]);

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
            className={`flex gap-4 overflow-x-hidden ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{ touchAction: 'pan-y' }}
          >
            {images.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
                className="min-w-[calc(100%/1.1)] sm:min-w-[calc(50%-8px)] lg:min-w-[calc(33.333%-11px)] shrink-0 group relative pointer-events-auto"
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

          {totalSlides > itemsPerView && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={prev}
                disabled={current === 0}
                className="p-2 rounded-full glass hover:bg-white/5 disabled:opacity-20 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                  <path d="M12 4l-6 6 6 6" />
                </svg>
              </button>

              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(totalSlides / itemsPerView) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      current >= i * itemsPerView && current < (i + 1) * itemsPerView
                        ? 'bg-primary w-4'
                        : 'bg-white/15 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                disabled={current >= maxIndex}
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
