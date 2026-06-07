'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Course, Certificate } from '@/types/content';

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-primary/10 text-primary/60 border-primary/10',
  Advanced: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const categoryIcons: Record<string, string> = {
  'Technology & Software Development': '💻',
  'Artificial Intelligence & Automation': '🤖',
  'Cybersecurity': '🔒',
  'Testing & Quality Assurance': '✅',
  'Hosting & Infrastructure': '☁️',
  'Datacenter & Physical Infrastructure': '🏗️',
  'Design & Creative Services': '🎨',
  'Photo, Video & Media Production': '📸',
  '3D, CGI & Rendering': '🌀',
  'Content & Documentation': '📝',
  'Social Media Management': '📱',
  'Digital Marketing': '📈',
  'Creator & Influencer Services': '⭐',
  'Business & Consulting': '💼',
  'Customer Support Services': '🎧',
  'Data & Research': '📊',
  'Finance, Legal & Compliance': '⚖️',
  'Human Resources': '👥',
  'Education & Training': '📚',
  'Events & Community Operations': '🎪',
  'Gaming & Esports': '🎮',
  'Open Source & Collaboration': '🌐',
  'Global Operations': '🌍',
  'Space Research & Aerospace Division': '🚀',
};

const enrollCounts = [
  2847, 1934, 2210, 1562, 1876, 1102, 3201, 1412, 978,
  4032, 4521, 2610, 1891, 2103, 3712, 1654, 892, 2108,
  1789, 2987, 1456, 2345, 1234, 3120,
  1876, 1456, 2134, 1678, 1234, 1890, 987, 1345, 1789, 1456,
  2100, 1876, 1567, 1234, 1678, 1890, 1345, 1567, 1234, 1456,
  1789, 2100, 987, 1345,
];

const ratings = [
  4.8, 4.9, 4.7, 4.6, 4.8, 4.5, 4.7, 4.6, 4.9,
  4.5, 4.4, 4.7, 4.3, 4.6, 4.5, 4.8, 4.4, 4.5,
  4.6, 4.7, 4.8, 4.3, 4.5, 4.9,
  4.6, 4.5, 4.7, 4.4, 4.6, 4.8, 4.3, 4.5, 4.6, 4.4,
  4.7, 4.5, 4.3, 4.6, 4.5, 4.8, 4.4, 4.6, 4.5, 4.3,
  4.7, 4.6, 4.4, 4.5,
];

function useInViewObserver(ref: React.RefObject<HTMLElement | null>): boolean {
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
  return inView;
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInViewObserver(ref);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
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

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function CoursesContent({ courses, certificates, communityName, socialLinks }: {
  courses: Course[];
  certificates: Certificate[];
  communityName: string;
  socialLinks: { discord: string; youtube: string; github: string; twitter: string };
}) {
  const [showSticky, setShowSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [featured, setFeatured] = useState(0);
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    const maxIdx = courses.reduce((max, c, i, arr) => c.price > arr[max].price ? i : max, 0);
    setFeatured(maxIdx);
  }, [courses]);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalEnrollments = enrollCounts.reduce((a, b) => a + b, 0);

  const filteredCourses = courses.filter((c) => {
    if (filterLevel !== 'All' && c.level !== filterLevel) return false;
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      if (!c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-space-dark">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards]">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] text-primary/60 uppercase tracking-[0.3em] font-light mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Enroll Now — Limited Seats
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.08] opacity-0 animate-[fadeSlideUp_0.7s_0.1s_ease_forwards]">
            Invest in <span className="text-gradient">Your Future</span>
            <br />
            <span className="text-white/20 text-2xl sm:text-3xl md:text-4xl font-light">Master skills that matter</span>
          </h1>

          <p className="text-sm text-white/30 max-w-2xl mx-auto mb-10 font-light leading-relaxed opacity-0 animate-[fadeSlideUp_0.7s_0.2s_ease_forwards]">
            {courses.length} industry-aligned courses with certificates. Learn from experts, build real projects, and earn verifiable credentials that open doors.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-6 opacity-0 animate-[fadeSlideUp_0.7s_0.3s_ease_forwards]">
            <div className="text-center">
              <div className="text-2xl font-bold text-white tabular-nums"><Counter target={totalEnrollments} />+</div>
              <div className="text-[11px] text-white/20 uppercase tracking-wider mt-1">Enrollments</div>
            </div>
            <div className="w-px h-10 bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white tabular-nums">{courses.length}</div>
              <div className="text-[11px] text-white/20 uppercase tracking-wider mt-1">Courses</div>
            </div>
            <div className="w-px h-10 bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white tabular-nums">{certificates.length}</div>
              <div className="text-[11px] text-white/20 uppercase tracking-wider mt-1">Certifications</div>
            </div>
            <div className="w-px h-10 bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white tabular-nums">4.7</div>
              <div className="text-[11px] text-white/20 uppercase tracking-wider mt-1">Avg Rating</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 opacity-0 animate-[fadeIn_0.5s_0.6s_ease_forwards]">
            <a href="#courses" onClick={(e) => { e.preventDefault(); document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-gradient px-7 py-2.5 rounded-full text-sm font-medium tracking-wider">
              Browse Courses ↓
            </a>
            <a href="#certificates" onClick={(e) => { e.preventDefault(); document.querySelector('#certificates')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-outline px-7 py-2.5 rounded-full text-sm font-medium tracking-wider text-white/50 hover:text-white/80">
              View Certificates
            </a>
          </div>
        </div>
      </section>

      <main className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Trust / Guarantee bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-16 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03] opacity-0 animate-[fadeSlideUp_0.4s_ease_forwards]">
            {[
              { icon: '🛡️', text: '30-Day Money-Back Guarantee' },
              { icon: '🎓', text: 'Industry-Recognized Certificates' },
              { icon: '⏳', text: 'Lifetime Access + Updates' },
              { icon: '💬', text: '24/7 Community Support' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-xs text-white/40">
                <span>{item.icon}</span>
                <span className="font-light">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Popular pick */}
          {courses[featured] && (
            <div id="courses" className="mb-16 opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards]">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs text-amber-400/80 tracking-widest uppercase font-medium">⭐ Featured Pick</span>
                <span className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
              </div>
              <div className="glass rounded-2xl overflow-hidden border border-amber-500/20 card-glow">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="md:col-span-2 h-48 md:h-auto bg-gradient-to-br from-primary/[0.06] to-secondary/[0.03] flex items-center justify-center text-5xl relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(107,76,230,0.08)_0%,transparent_70%)]" />
                    <span className="relative">{categoryIcons[courses[featured].category]}</span>
                  </div>
                  <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[11px] px-2 py-0.5 rounded-md border ${levelColors[courses[featured].level]}`}>{courses[featured].level}</span>
                      <span className="text-[11px] text-amber-400/60 font-medium">Most Popular</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{courses[featured].title}</h3>
                    <p className="text-sm text-white/30 font-light leading-relaxed mb-4 line-clamp-2">{courses[featured].description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/25 mb-5">
                      <span>📅 {courses[featured].duration}</span>
                      <span>⭐ {ratings[featured]}</span>
                      <span>👥 {enrollCounts[featured].toLocaleString()} enrolled</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-2xl font-bold text-white/80">${courses[featured].price}</span>
                        <span className="text-xs text-white/20 ml-2">one-time</span>
                      </div>
                      <button className="btn-gradient px-6 py-2.5 rounded-full text-sm font-medium tracking-wider text-white">
                        Enroll Now →
                      </button>
                      <a href="#all-courses" onClick={(e) => { e.preventDefault(); document.querySelector('#all-courses')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                        View all courses
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 opacity-0 animate-[fadeSlideUp_0.4s_ease_forwards]">
            {[
              { icon: '🎓', title: 'Expert-Led Curriculum', desc: 'Industry professionals with years of real-world experience teaching each course.' },
              { icon: '📜', title: 'Verifiable Credentials', desc: 'Unique verification codes. Shareable on LinkedIn, portfolio, and resume.' },
              { icon: '⚡', title: 'Hands-On Projects', desc: 'Production-grade assignments. Build a portfolio that proves your skills.' },
              { icon: '🔄', title: 'Lifetime Access', desc: 'One payment, forever access. All future updates and new content included.' },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-5 border border-white/[0.04] hover:border-primary/[0.08] transition-all duration-300 hover:-translate-y-0.5">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-semibold text-white/80 mb-1">{item.title}</h3>
                <p className="text-xs text-white/30 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Filter controls */}
          {courses.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFilterLevel(lvl)}
                      className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                        filterLevel === lvl
                          ? 'bg-primary/20 border-primary/40 text-primary/80'
                          : 'border-white/[0.06] text-white/30 hover:border-white/[0.12]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-white/50 px-2.5 py-1.5 outline-none focus:border-primary/30 w-full sm:w-auto"
                  >
                    <option value="All">All Categories</option>
                    {[...new Set(courses.map((c) => c.category))].sort().map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-white/50 px-2.5 py-1.5 outline-none focus:border-primary/30 w-full sm:w-40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Course + Certificate */}
          {courses.length > 0 && (
            <div id="all-courses" className="mb-20">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-lg font-semibold text-white">Course + Certificate</h2>
                </div>
                <span className="text-[11px] text-white/20 bg-white/[0.02] px-3 py-1 rounded-full border border-white/[0.04]">
                  {courses.length} paths
                </span>
              </div>
              <p className="text-xs text-white/20 mb-4 font-light">
                Complete the course — earn the certificate. All-in-one price.
              </p>

              {/* Price comparison */}
              <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-gradient-to-r from-primary/[0.04] to-secondary/[0.02] border border-primary/[0.06]">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className="text-primary/60"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/></svg>
                </div>
                <div className="flex-1 text-xs text-white/40 font-light">
                  <span className="text-white/60 font-medium">Bundle & save:</span> Buying course + certificate separately costs <span className="line-through text-white/20">$2,680 avg</span> — bundled it's <span className="text-emerald-400/80 font-medium">$2,000 avg</span>.
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20">Save ~25%</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCourses.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-white/20 text-sm">No courses match your filters.</div>
                ) : null}
                {filteredCourses.map((course, i) => (
                  <div
                    key={course.id}
                    className={`glass rounded-2xl overflow-hidden border transition-all duration-300 group flex flex-col ${
                      i === featured
                        ? 'border-amber-500/20 card-glow'
                        : 'border-white/[0.04] hover:border-primary/[0.1]'
                    }`}
                  >
                    {i === featured && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">Most Popular</span>
                      </div>
                    )}
                    <div className="h-28 bg-gradient-to-br from-primary/[0.04] to-secondary/[0.02] flex items-center justify-center text-3xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(107,76,230,0.06)_0%,transparent_70%)]" />
                      <span className="relative">{categoryIcons[course.category] || '📘'}</span>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border ${levelColors[course.level] || 'bg-white/5 text-white/40 border-white/10'}`}>
                          {course.level}
                        </span>
                        <span className="shrink-0 text-[10px] text-secondary/50 tracking-wide flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd"/></svg>
                          Cert Included
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-white/90 mb-1">{course.title}</h3>

                      <div className="flex items-center gap-2 text-[11px] text-white/25 mb-2">
                        <span className="flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" className="opacity-40"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 8.586V5z"/></svg>
                          {course.duration}
                        </span>
                        <span className="text-white/10">·</span>
                        <span className="text-white/30 truncate max-w-[140px]">{course.category}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-white/25 mb-3">
                        <span className="flex items-center gap-1">⭐ {ratings[i]}</span>
                        <span className="flex items-center gap-1">👥 {enrollCounts[i].toLocaleString()}</span>
                      </div>

                      <p className="text-xs text-white/30 font-light leading-relaxed mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="mt-auto pt-3 border-t border-white/[0.03]">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-white/80">${course.price}</span>
                            <span className="text-[10px] text-white/20 ml-1.5">one-time</span>
                          </div>
                          <button className="text-xs font-medium text-white bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-full transition-all">
                            Enroll →
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/20 mt-2">
                          <svg width="9" height="9" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd"/></svg>
                          Certificate upon completion
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificate Only */}
          {certificates.length > 0 && (
            <div id="certificates" className="mb-16">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-1 h-6 bg-secondary rounded-full" />
                  <h2 className="text-lg font-semibold text-white">Certificate Only</h2>
                </div>
                <span className="text-[11px] text-white/20 bg-white/[0.02] px-3 py-1 rounded-full border border-white/[0.04]">
                  {certificates.length} exams
                </span>
              </div>
              <p className="text-xs text-white/20 mb-8 font-light">
                Already know the material? Skip the course and certify directly by exam.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="glass rounded-xl p-5 border border-white/[0.04] hover:border-secondary/[0.15] transition-all duration-300 group flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 border border-white/[0.06] flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-secondary/50"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd"/></svg>
                      </div>
                      <h3 className="text-sm font-semibold text-white/80 leading-tight">{cert.name}</h3>
                    </div>
                    <p className="text-xs text-white/30 font-light leading-relaxed mb-3 line-clamp-2 flex-1">{cert.description}</p>
                    <p className="text-[10px] text-white/20 mb-3">{cert.issuer}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
                      <div>
                        <span className="text-base font-bold text-white/70">${cert.price}</span>
                        <span className="text-[10px] text-white/20 ml-1">exam fee</span>
                      </div>
                      <button className="text-xs text-secondary/50 hover:text-secondary/70 font-medium transition-colors">
                        Take Test →
                      </button>
                    </div>
                    <div className="text-[10px] text-white/20 mt-2 flex items-center gap-1">
                      <svg width="9" height="9" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947z" clipRule="evenodd"/></svg>
                      Exam-based certification
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {courses.length === 0 && certificates.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/20 text-sm">Courses and certificates coming soon.</p>
            </div>
          )}

          {/* FAQ */}
          <div className="mb-16 opacity-0 animate-[fadeSlideUp_0.4s_ease_forwards]">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2.5">
                <span className="w-1 h-6 bg-white/20 rounded-full" />
                <h2 className="text-lg font-semibold text-white">Frequently Asked Questions</h2>
              </div>
            </div>

            <div className="space-y-2 max-w-3xl">
              {[
                { q: 'How does the money-back guarantee work?', a: 'If you\'re not satisfied within 30 days of purchase, email us and we\'ll issue a full refund — no questions asked. You keep any certificates you\'ve already earned.' },
                { q: 'Are the certificates recognized by employers?', a: 'Yes. Each certificate comes with a unique verification code and can be shared on LinkedIn, added to your resume, or linked from your portfolio. Our credentials are recognized across the aerospace and technology industries.' },
                { q: 'Can I take just the exam without the course?', a: 'Absolutely. If you already know the material, go straight to the "Certificate Only" section and take the exam. Passing earns you the same industry-recognized credential.' },
                { q: 'How long do I have access to course materials?', a: 'Lifetime access. One payment, and you get all current content plus future updates forever.' },
                { q: 'What if a course doesn\'t have a related certificate?', a: 'Every course includes a certificate upon completion. You don\'t need to purchase anything extra — it\'s built into the course price.' },
                { q: 'Can I switch from certificate-only to the full course?', a: 'Yes. Upgrade anytime by paying the difference between the exam fee and the full course price. Contact support and we\'ll handle it.' },
              ].map((faq, i) => (
                <div key={i} className="glass rounded-xl border border-white/[0.04] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm text-white/70 hover:text-white/90 transition-colors"
                  >
                    <span className="font-medium">{faq.q}</span>
                    <svg
                      width="14" height="14" viewBox="0 0 20 20" fill="currentColor"
                      className={`shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-4 pb-4 text-xs text-white/30 font-light leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 p-8 md:p-12 rounded-2xl glass-strong border border-white/[0.04] relative overflow-hidden opacity-0 animate-[fadeSlideUp_0.4s_ease_forwards]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.02]" />
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Still deciding?</h3>
              <p className="text-sm text-white/30 font-light max-w-md mx-auto mb-6">
                All courses come with a 30-day money-back guarantee. Start learning risk-free today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className="btn-gradient px-6 py-2.5 rounded-full text-sm font-medium tracking-wider text-white inline-flex items-center gap-2">
                  ← Back to Home
                </Link>
                <a href="#courses" onClick={(e) => { e.preventDefault(); document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-outline px-6 py-2.5 rounded-full text-sm font-medium tracking-wider text-white/50 hover:text-white/80 inline-flex items-center gap-2">
                  Browse All Courses
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
        style={{
          transform: showSticky ? 'translateY(0)' : 'translateY(80px)',
          opacity: showSticky ? 1 : 0,
          transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 pb-4 pointer-events-auto">
          <div className="glass-strong rounded-2xl border border-white/[0.06] p-3 flex items-center justify-between gap-3 backdrop-blur-xl bg-space-dark/90">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center text-xs">
                🚀
              </div>
              <div>
                <div className="text-sm font-semibold text-white/80">Start learning today</div>
                <div className="text-[10px] text-white/30 font-light">30-day money-back guarantee</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40 hidden sm:block font-light">
                {courses[featured] ? `From $${courses[featured].price}` : ''}
              </span>
              <button className="btn-gradient px-5 py-2 rounded-full text-xs font-medium tracking-wider text-white shrink-0">
                Enroll Now →
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer communityName={communityName} socialLinks={socialLinks} />
    </div>
  );
}
