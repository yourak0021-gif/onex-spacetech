'use client';

import { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/hooks/useContent';

interface Partner {
  id: number; name: string; logo: string; url: string; category: string; description: string; parentId?: number;
}

const icons: Record<string, string> = {
  'Space & Aerospace': '🚀', 'Big Tech / Cloud': '☁️', 'AI & Machine Learning': '🤖', 'Cybersecurity': '🔒',
  'DevOps / Infrastructure': '⚙️', 'Design / Creative': '🎨', 'Data & Analytics': '📊', 'Networking / Telecom': '📡',
  'Gaming / Esports': '🎮', 'Social / Marketing': '📱', 'Finance / Consulting': '💼', 'Education': '📚',
  'Open Source / Collaboration': '🌐',
};

function Img({ src, name, cn = '' }: { src: string; name: string; cn?: string }) {
  const [bad, setBad] = useState(false);
  if (bad || !src) {
    const init = name.split(' ').map(w => w[0]).join('').slice(0, 2);
    return <div className={`bg-gradient-to-br from-primary/25 to-secondary/15 flex items-center justify-center font-bold text-white/30 shrink-0 rounded-full ${cn}`}>{init}</div>;
  }
  return <img src={src} alt={name} className={cn} loading="lazy" onError={() => setBad(true)} />;
}

function MarqueeRow({ partners, speed, dir }: { partners: Partner[]; speed: number; dir: 1 | -1 }) {
  const ref = useRef<HTMLDivElement>(null);
  const doubled = [...partners, ...partners];
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-space-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-space-dark to-transparent z-10 pointer-events-none" />
      <div className="overflow-hidden">
        <div ref={ref} className="flex gap-10" style={{ width: 'max-content', animation: `roll${dir === 1 ? 'L' : 'R'} ${speed}s linear infinite` }}
          onMouseEnter={() => { if (ref.current) ref.current.style.animationPlayState = 'paused'; }}
          onMouseLeave={() => { if (ref.current) ref.current.style.animationPlayState = 'running'; }}
        >
          {doubled.map((p, i) => (
            <a key={`${p.id}-${i}`} href={p.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 shrink-0 py-2 px-3 rounded-xl hover:bg-white/[0.03] transition-all duration-300" title={p.name}
            >
              <Img src={p.logo} name={p.name} cn="h-9 w-auto object-contain brightness-[0.85] group-hover:brightness-100 transition-all" />
              <span className="text-xs text-white/20 group-hover:text-white/50 font-light whitespace-nowrap transition-colors">{p.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryStrip({ cat, partners, icon }: { cat: string; partners: Partner[]; icon: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += dir * 300;
  };

  return (
    <div className="group/strip">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-xs">{icon}</span>
        <span className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-light">{cat}</span>
        <span className="text-[9px] text-white/10 font-mono">{partners.length}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-white/[0.04] to-transparent" />
        <button onClick={() => scroll(-1)} className="opacity-0 group-hover/strip:opacity-100 w-5 h-5 rounded-md bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[9px] text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-all">&larr;</button>
        <button onClick={() => scroll(1)} className="opacity-0 group-hover/strip:opacity-100 w-5 h-5 rounded-md bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[9px] text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-all">&rarr;</button>
      </div>
      <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto scrollbar-none pb-2" style={{ scrollBehavior: 'smooth' }}>
        {partners.map(p => (
          <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
            className="group/chip shrink-0 flex items-center gap-1.5 px-2 py-1.5 rounded-lg glass border border-white/[0.04] hover:border-primary/[0.15] transition-all duration-200 hover:bg-white/[0.03]"
            title={p.description}
          >
            <Img src={p.logo} name={p.name} cn="w-4 h-4 object-contain brightness-[0.7] group-hover/chip:brightness-100 transition-all" />
            <span className="text-[10px] text-white/35 group-hover/chip:text-white/70 whitespace-nowrap transition-colors font-light">{p.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Partners({ partners: propData }: { partners?: Partner[] }) {
  const fetchedData = useContent((d: any) => d.partners as Partner[] | undefined);
  const data: Partner[] = propData || fetchedData || [];

  if (!data || data.length === 0) return null;

  const categories = useMemo(() => {
    const map = new Map<string, Partner[]>();
    data.forEach(p => {
      const arr = map.get(p.category) || [];
      arr.push(p);
      map.set(p.category, arr);
    });
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [data]);

  const allForWall = data;
  const third = Math.ceil(allForWall.length / 3);
  const row1 = allForWall.slice(0, third);
  const row2 = allForWall.slice(third, third * 2);
  const row3 = allForWall.slice(third * 2);

  return (
    <section className="relative py-24 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-secondary/[0.01]" />
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[300px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/3 rounded-full blur-[250px]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] text-primary/60 uppercase tracking-[0.3em] font-light mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Trusted by Industry Leaders
            </span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-3">
              Our <span className="text-gradient">Partners</span>
            </h2>
            <p className="text-sm text-white/30 max-w-2xl mx-auto font-light">
              {data.length} organizations across {categories.length} sectors.
            </p>
          </motion.div>
        </div>

        {/* Multi-row logo wall */}
        <div className="space-y-5 mb-16">
          <style>{`
            @keyframes rollL { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            @keyframes rollR { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
          `}</style>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <MarqueeRow partners={row1} speed={22} dir={1} />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <MarqueeRow partners={row2} speed={35} dir={-1} />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <MarqueeRow partners={row3} speed={50} dir={1} />
          </motion.div>
        </div>

        {/* Category strips */}
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          {categories.map(([cat, partners], idx) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
            >
              <CategoryStrip cat={cat} partners={partners} icon={icons[cat] || '🏢'} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
