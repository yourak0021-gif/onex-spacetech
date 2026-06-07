'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('/')) {
      router.push(href);
      return;
    }
    router.push('/' + href);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#06060f]/80 backdrop-blur-2xl border-b border-white/[0.03] shadow-[0_1px_0_0_rgba(255,255,255,0.02)]'
          : 'bg-transparent'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <motion.a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleClick('#hero'); }}
            className="text-lg font-bold tracking-wider cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-gradient">OneX</span>
            <span className="text-white/60 ml-1.5 font-light tracking-[0.15em]">TECH</span>
          </motion.a>

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
            <motion.a
              href="/contact"
              onClick={(e) => { e.preventDefault(); handleClick('/contact'); }}
              className="btn-gradient px-5 py-2 rounded-full text-[13px] font-medium tracking-wider text-white cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Connect
            </motion.a>
          </div>

          <motion.button
            className="md:hidden text-white/50 hover:text-white/80 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden bg-[#0c0c1e]/95 backdrop-blur-2xl border-t border-white/[0.03] overflow-hidden"
          >
            <div className="px-6 py-5 space-y-3">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleClick(link.href); }}
                  className="block text-sm text-white/40 hover:text-white/80 transition-colors tracking-wider py-2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="/contact"
                onClick={(e) => { e.preventDefault(); handleClick('/contact'); }}
                className="block text-center btn-gradient px-5 py-2.5 rounded-full text-sm font-medium tracking-wider text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Connect
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
