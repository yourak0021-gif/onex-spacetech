'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Stats', href: '#stats' },
  { label: 'Services', href: '#services' },
  { label: 'Courses', href: '/courses' },
  { label: 'Gallery', href: '#gallery' },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    if (href === '/' || href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (href.startsWith('/')) { router.push(href); return; }
    router.push('/' + href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 animate-[navSlideIn_0.6s_ease_forwards] ${
        scrolled
          ? 'bg-[#06060f]/80 backdrop-blur-2xl border-b border-white/[0.03] shadow-[0_0_30px_rgba(107,76,230,0.03)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleClick('#hero'); }}
            className="text-lg font-bold tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-gradient">OneX</span>
            <span className="text-white/60 ml-1.5 font-light tracking-[0.15em]">TECH</span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleClick(link.href); }}
                className="text-[13px] text-white/40 hover:text-white/80 transition-all tracking-wider uppercase font-light relative after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); handleClick('/contact'); }}
              className="btn-gradient px-5 py-2 rounded-full text-[13px] font-medium tracking-wider text-white cursor-pointer active:scale-95 transition-transform"
            >
              Connect
            </a>
          </div>

          <button
            className="md:hidden text-white/50 hover:text-white/80 transition-colors p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#0c0c1e]/95 backdrop-blur-2xl border-t border-white/[0.03] px-6 py-5 space-y-3">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleClick(link.href); }}
              className="block text-sm text-white/40 hover:text-white/80 transition-colors tracking-wider py-2"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); handleClick('/contact'); }}
            className="block text-center btn-gradient px-5 py-2.5 rounded-full text-sm font-medium tracking-wider text-white active:scale-95 transition-transform"
          >
            Connect
          </a>
        </div>
      </div>
    </nav>
  );
}
