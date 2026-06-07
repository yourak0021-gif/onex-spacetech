'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiUserGroup, HiCode, HiFolderOpen, HiCalendar } from 'react-icons/hi';

interface StatsData {
  members: number;
  services: number;
  projects: number;
  events: number;
}

interface StatsProps {
  memberCount: number;
  stats: StatsData;
}

function Counter({ target, suffix = '', label, icon }: { target: number; suffix?: string; label: string; icon: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center p-4 md:p-6"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="text-xl text-white/20 mb-3 flex justify-center">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-white mb-1.5 tabular-nums tracking-tight">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[11px] text-white/25 uppercase tracking-[0.25em] font-light">{label}</div>
    </motion.div>
  );
}

export default function Stats({ memberCount, stats }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const statItems = [
    { target: memberCount || stats.members, label: 'Members', icon: <HiUserGroup /> },
    { target: stats.services, label: 'Services', icon: <HiCode /> },
    { target: stats.projects, label: 'Projects', icon: <HiFolderOpen /> },
    { target: stats.events, label: 'Events', icon: <HiCalendar /> },
  ];

  return (
    <section id="stats" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.01] to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/25 uppercase tracking-[0.3em] font-light mb-5">
            By the Numbers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Our <span className="text-gradient">Impact</span>
          </h2>
          <p className="text-white/30 max-w-xl mx-auto text-sm font-light leading-relaxed">
            Real metrics from a real community. Every number represents hours of dedication.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {statItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass rounded-xl border border-white/[0.04] hover:border-primary/[0.08] transition-all duration-500 card-glow"
            >
              <Counter
                target={item.target}
                label={item.label}
                icon={item.icon}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
