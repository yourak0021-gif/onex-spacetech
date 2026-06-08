'use client';

export default function CallToAction() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto text-center relative">
        <div className="glass-premium rounded-3xl px-8 py-12 md:py-16 md:px-16 border border-primary/[0.06] opacity-0 animate-[fadeSlideUp_0.6s_ease_forwards]">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/25 uppercase tracking-[0.3em] font-light mb-6">
            Join the Collective
          </span>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
            Ready to Be Part of <br />
            <span className="text-gradient">Something Bigger</span>?
          </h2>

          <p className="text-white/30 max-w-lg mx-auto text-sm font-light leading-relaxed mb-10">
            Connect with thousands of creators, engineers, researchers, and visionaries across 24 disciplines. One community, infinite possibilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#services"
              onClick={(e) => { e.preventDefault(); scrollTo('#services'); }}
              className="btn-gradient-glow px-8 py-3 rounded-full text-sm font-medium tracking-wider text-white inline-flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Explore Services
            </a>
            <a
              href="#stats"
              onClick={(e) => { e.preventDefault(); scrollTo('#stats'); }}
              className="btn-outline px-8 py-3 rounded-full text-sm font-medium tracking-wider text-white/50 hover:text-white/80 inline-flex items-center justify-center gap-2 active:scale-95 transition-transform backdrop-blur-sm"
            >
              View Our Impact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
