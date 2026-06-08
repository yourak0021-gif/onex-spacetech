'use client';

import { useRef, useEffect, useState } from 'react';
import type { TopMember } from '@/types/content';

function MemberCard({ member, index }: { member: TopMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.unobserve(el); }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '0.5s',
        transitionDelay: `${index * 0.1}s`,
        transitionTimingFunction: 'ease-out',
      }}
      className="glass rounded-xl p-5 md:p-6 text-center border border-white/[0.04] group cursor-default"
    >
      <div
        className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/[0.06] flex items-center justify-center text-lg font-semibold text-white/70 shadow-lg"
        style={{ transform: 'translateZ(25px)' }}
      >
        {member.name.charAt(0)}
      </div>
      <div className="flex items-center justify-center gap-1.5 mb-1" style={{ transform: 'translateZ(15px)' }}>
        <h3 className="text-sm font-semibold text-white/80">{member.name}</h3>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-primary/50 shrink-0"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <p className="text-[11px] text-primary/50 font-medium mb-2.5 tracking-wide" style={{ transform: 'translateZ(10px)' }}>{member.role}</p>
      <p className="text-xs text-white/30 leading-relaxed font-light" style={{ transform: 'translateZ(5px)' }}>{member.description}</p>
    </div>
  );
}

export default function TopMembers({ members }: { members: TopMember[] }) {
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

  if (!members || members.length === 0) return null;

  return (
    <section id="top-members" className="section-padding relative scroll-mt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/[0.01] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center mb-10 md:mb-14 opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards]">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/25 uppercase tracking-[0.3em] font-light mb-5">
            Leadership
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Top <span className="text-gradient">Members</span>
          </h2>
          <p className="text-white/30 max-w-2xl mx-auto text-sm font-light">
            The people steering our community across technology, science, and creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
