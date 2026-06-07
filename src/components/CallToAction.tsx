'use client';

export default function CallToAction() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-3xl mx-auto text-center opacity-0 animate-[fadeSlideUp_0.6s_ease_forwards]">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/25 uppercase tracking-[0.3em] font-light mb-6">
          Join the Collective
        </span>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Ready to Be Part of <span className="text-gradient">Something Bigger</span>?
        </h2>

        <p className="text-white/30 max-w-lg mx-auto text-sm font-light leading-relaxed mb-8">
          Connect with thousands of creators, engineers, researchers, and visionaries across 24 disciplines. One community, infinite possibilities.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#services"
            onClick={(e) => { e.preventDefault(); scrollTo('#services'); }}
            className="btn-gradient px-7 py-2.5 rounded-full text-sm font-medium tracking-wider text-white inline-flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Explore Services
          </a>
          <a
            href="#stats"
            onClick={(e) => { e.preventDefault(); scrollTo('#stats'); }}
            className="btn-outline px-7 py-2.5 rounded-full text-sm font-medium tracking-wider text-white/50 hover:text-white/80 inline-flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            View Our Impact
          </a>
        </div>
      </div>
    </section>
  );
}
