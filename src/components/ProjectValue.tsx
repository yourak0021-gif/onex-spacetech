'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiTrendingUp } from 'react-icons/hi';

interface ProjectInfo {
  title: string;
  description: string;
  value: number;
}

export default function ProjectValue({ projectInfo }: { projectInfo: ProjectInfo }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(projectInfo.value);

  useEffect(() => {
    if (!inView) return;
    const startValue = projectInfo.value - 50;
    const targetValue = projectInfo.value;
    const duration = 2500;
    const steps = 60;
    const increment = (targetValue - startValue) / steps;
    let current = startValue;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, projectInfo.value]);

  return (
    <section className="section-padding relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.01] to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/25 uppercase tracking-[0.3em] font-light mb-6">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
              Live Tracking
            </span>
          </span>

          <h2 className="text-lg md:text-xl font-semibold text-white/50 mb-6 tracking-wide font-light">
            {projectInfo.title}
          </h2>

          <motion.div
            className="relative inline-block my-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl blur-2xl" />
            <div className="relative glass rounded-2xl px-5 md:px-8 py-6 md:py-7 border border-white/[0.04]">
              <div className="flex items-center justify-center gap-3">
                <HiTrendingUp className="text-lg text-green-500/50" />
                <span className="text-2xl sm:text-4xl md:text-6xl font-bold tabular-nums tracking-tight">
                  <span className="text-white/30">$</span>
                  <span className="text-white">{displayValue.toLocaleString()}</span>
                </span>
              </div>
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
          </motion.div>

          <motion.p
            className="text-white/25 max-w-2xl mx-auto text-sm leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {projectInfo.description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
