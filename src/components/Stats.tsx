'use client';

import { useEffect, useRef, useState } from 'react';
interface StatsData { members: number; services: number; projects: number; events: number; }
interface StatsProps { memberCount: number; stats: StatsData; }

const icons = {
  members: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  services: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  projects: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  events: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

function Counter({ target, suffix = '', label, icon }: { target: number; suffix?: string; label: string; icon: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.unobserve(el); }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center p-4 md:p-6 opacity-0 animate-[fadeSlideUp_0.6s_ease_forwards]">
      <div className="text-xl text-white/20 mb-3 flex justify-center">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold text-white mb-1.5 tabular-nums tracking-tight">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[11px] text-white/25 uppercase tracking-[0.25em] font-light">{label}</div>
    </div>
  );
}

export default function Stats({ memberCount, stats }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null);
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

  const statItems = [
    { target: memberCount || stats.members, label: 'Members', icon: icons.members },
    { target: stats.services, label: 'Services', icon: icons.services },
    { target: stats.projects, label: 'Projects', icon: icons.projects },
    { target: stats.events, label: 'Events', icon: icons.events },
  ];

  return (
    <section id="stats" className="section-padding relative scroll-mt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.01] to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <div className="text-center mb-10 md:mb-14 opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards]">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/25 uppercase tracking-[0.3em] font-light mb-5">
            By the Numbers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Our <span className="text-gradient">Impact</span>
          </h2>
          <p className="text-white/30 max-w-xl mx-auto text-sm font-light leading-relaxed">
            Real metrics from a real community. Every number represents hours of dedication.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {statItems.map((item, i) => (
            <div
              key={item.label}
              className="glass rounded-xl border border-white/[0.04] hover:border-primary/[0.08] transition-all duration-500 card-glow opacity-0 animate-[fadeSlideUp_0.4s_ease_forwards]"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <Counter target={item.target} label={item.label} icon={item.icon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
