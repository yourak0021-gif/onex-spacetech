'use client';

import { useState, useMemo } from 'react';
import type { Service } from '@/types/content';

const SvgIcon = ({ name, className = 'text-primary/50' }: { name: string; className?: string }) => {
  const cn = `shrink-0 ${className}`;
  switch (name) {
    case 'code': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
    case 'brain': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V20H8v-5.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z"/></svg>;
    case 'shield': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'server': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
    case 'palette': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-10-10-10z"/></svg>;
    case 'video': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
    case 'cube': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
    case 'file': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case 'bullhorn': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 8l-6-3v14l6-3V8z"/><path d="M6 12h4"/><circle cx="6" cy="14" r="3"/></svg>;
    case 'briefcase': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    case 'users': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'chart': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case 'education': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5"/></svg>;
    case 'gamepad': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4M15 13h2M17 11h2"/></svg>;
    case 'globe': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case 'rocket': return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
    default: return <svg className={cn} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
  }
};

function getCategoryIcon(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes('software') || cat.includes('technology') || cat.includes('host') || cat.includes('infrastructure') || cat.includes('datacenter') || cat.includes('physical')) return 'server';
  if (cat.includes('ai') || cat.includes('artificial') || cat.includes('automation')) return 'brain';
  if (cat.includes('cyber') || cat.includes('security')) return 'shield';
  if (cat.includes('design') || cat.includes('creative') || cat.includes('photo') || cat.includes('video') || cat.includes('media') || cat.includes('3d') || cat.includes('cgi') || cat.includes('render')) return 'palette';
  if (cat.includes('content') || cat.includes('document')) return 'file';
  if (cat.includes('social') || cat.includes('market') || cat.includes('digital market') || cat.includes('creator') || cat.includes('influencer') || cat.includes('brand')) return 'bullhorn';
  if (cat.includes('business') || cat.includes('consult') || cat.includes('finance') || cat.includes('legal') || cat.includes('compliance') || cat.includes('customer') || cat.includes('support')) return 'briefcase';
  if (cat.includes('data') || cat.includes('research')) return 'chart';
  if (cat.includes('human') || cat.includes('hr') || cat.includes('community') || cat.includes('event')) return 'users';
  if (cat.includes('education') || cat.includes('train')) return 'education';
  if (cat.includes('gaming') || cat.includes('esport')) return 'gamepad';
  if (cat.includes('open source')) return 'code';
  if (cat.includes('global') || cat.includes('network')) return 'globe';
  if (cat.includes('space') || cat.includes('aero') || cat.includes('astro')) return 'rocket';
  if (cat.includes('test') || cat.includes('qa') || cat.includes('quality')) return 'shield';
  return 'code';
}

const ServiceDot = () => (
  <span className="w-1.5 h-1.5 rounded-full bg-primary/30 shrink-0" />
);

export default function Services({ services }: { services: Service[] }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, Service[]> = {};
    services.forEach((s) => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [services]);

  const categories = useMemo(() => Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)), [grouped]);

  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="section-padding relative scroll-mt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.01] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14 animate-[fadeIn_0.5s_ease_forwards]">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/25 uppercase tracking-[0.3em] font-light mb-5">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Services <span className="text-gradient">&amp; Operations</span>
          </h2>
          <p className="text-white/30 max-w-2xl mx-auto text-sm font-light">
            {services.length}+ services across {categories.length} disciplines. Every digital and scientific capability, under one community.
          </p>
        </div>

        <div className="space-y-2">
          {categories.map(([category, items], catIdx) => {
            const isOpen = openCategory === category;
            const catIcon = getCategoryIcon(category);

            return (
              <div
                key={category}
                className="glass rounded-xl border border-white/[0.04] overflow-hidden card-glow animate-[fadeIn_0.4s_ease_forwards]"
                style={{ animationDelay: `${catIdx * 0.03}s`, opacity: 0 }}
              >
                <button
                  onClick={() => setOpenCategory((prev) => (prev === category ? null : category))}
                  className="w-full flex items-center justify-between px-4 md:px-5 py-3.5 md:py-4 text-left hover:bg-white/[0.015] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <SvgIcon name={catIcon} />
                    <div>
                      <h3 className="text-sm font-medium text-white/80">{category}</h3>
                      <p className="text-[11px] text-white/20 mt-0.5">{items.length} services</p>
                    </div>
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-white/15 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-250 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-4 md:px-5 pb-4">
                    <div className="border-t border-white/[0.03] pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                        {items.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.02] transition-colors group"
                          >
                            <ServiceDot />
                            <div className="min-w-0">
                              <div className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors truncate">
                                {service.title}
                              </div>
                              {service.description && (
                                <div className="text-[11px] text-white/20 truncate">{service.description}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
