'use client';

import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';

interface Props {
  sections: { id: string; label: string; node: ReactNode }[];
}

export default function HorizontalScroll({ sections }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const dragOffset = useRef(0);
  const lastMove = useRef(0);

  const go = useCallback((i: number) => {
    const n = sections.length;
    setIdx(i < 0 ? 0 : i >= n ? n - 1 : i);
  }, [sections.length]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    dragStart.current = e.clientX;
    dragOffset.current = 0;
    lastMove.current = e.clientX;
    const el = trackRef.current;
    if (el) el.style.transition = 'none';
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = e.clientX - lastMove.current;
    dragOffset.current += delta;
    lastMove.current = e.clientX;
    const el = trackRef.current;
    if (el) {
      const offset = -idx * window.innerWidth + dragOffset.current;
      el.style.transform = `translateX(${offset}px)`;
    }
  }, [dragging, idx]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    const threshold = window.innerWidth * 0.2;
    if (Math.abs(dragOffset.current) > threshold) {
      go(idx - Math.sign(dragOffset.current));
    }
    dragOffset.current = 0;
    el.style.transform = `translateX(-${idx * window.innerWidth}px)`;
  }, [dragging, idx, go]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || dragging) return;
    el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.transform = `translateX(-${idx * window.innerWidth}px)`;
  }, [idx, dragging]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const el = trackRef.current;
      if (!el) return;
      e.preventDefault();
      el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      go(idx + Math.sign(e.deltaY));
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [idx, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(idx + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(idx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, go]);

  if (sections.length === 0) return null;

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-space-dark"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ touchAction: 'pan-y' }}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{
          width: `${sections.length * 100}vw`,
          height: '100vh',
          transform: 'translateX(0)',
        }}
      >
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={`hs-${s.id}`}
            className="relative w-screen min-h-screen overflow-y-auto overflow-x-hidden shrink-0"
            style={{ height: '100vh' }}
          >
            {s.node}
          </section>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === idx
                ? 'bg-primary w-3 h-3'
                : 'bg-white/15 hover:bg-white/40'
            }`}
            aria-label={s.label}
          />
        ))}
      </div>

      {/* Label */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-[10px] text-white/10 uppercase tracking-[0.25em] font-light pointer-events-none">
        {sections[idx]?.label || ''}
      </div>
    </div>
  );
}
