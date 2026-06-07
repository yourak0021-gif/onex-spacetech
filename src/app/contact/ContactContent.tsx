'use client';

import { motion } from 'framer-motion';
import { FaDiscord, FaYoutube, FaGithub, FaTwitter } from 'react-icons/fa';
import { HiMail, HiLocationMarker, HiGlobe } from 'react-icons/hi';

interface SocialLinksData {
  discord: string;
  youtube: string;
  github: string;
  twitter: string;
}

const platforms = [
  { key: 'discord', icon: <FaDiscord />, label: 'Discord', color: 'hover:text-[#5865F2]', desc: 'Join our community for real-time chat, support, and networking.' },
  { key: 'youtube', icon: <FaYoutube />, label: 'YouTube', color: 'hover:text-[#FF0000]', desc: 'Tutorials, showcases, and community highlights.' },
  { key: 'github', icon: <FaGithub />, label: 'GitHub', color: 'hover:text-white', desc: 'Open-source projects, code contributions, and repositories.' },
  { key: 'twitter', icon: <FaTwitter />, label: 'Twitter / X', color: 'hover:text-[#1DA1F2]', desc: 'Announcements, industry news, and updates.' },
];

const contacts = [
  { icon: <HiMail />, label: 'Email', value: 'contact@onex.space', href: 'mailto:contact@onex.space' },
  { icon: <HiLocationMarker />, label: 'Location', value: 'OneX SpaceTechnologies Pvt. Ltd., Innovation Hub' },
  { icon: <HiGlobe />, label: 'Web', value: 'www.onex.space', href: 'https://www.onex.space' },
];

export default function ContactContent({ communityName, socialLinks, tagline }: { communityName: string; socialLinks: SocialLinksData; tagline: string }) {
  const hasAnyLink = Object.values(socialLinks).some(v => v?.trim());

  return (
    <div className="min-h-screen bg-space-dark">

      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px] animate-pulse-glow" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] text-primary/60 uppercase tracking-[0.3em] font-light mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Get in Touch
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Let&apos;s <span className="text-gradient">Connect</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-sm text-white/30 max-w-2xl mx-auto font-light leading-relaxed">
            Reach out, join the conversation, or collaborate with us.
          </motion.p>
        </div>
      </section>

      <main className="pb-24 px-4">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* Social */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-lg font-semibold text-white">Social Media</h2>
              <span className="text-[11px] text-white/20 bg-white/[0.02] px-3 py-1 rounded-full border border-white/[0.04]">Follow us</span>
            </div>

            {!hasAnyLink ? (
              <div className="glass rounded-xl p-10 text-center border border-white/[0.04]">
                <p className="text-white/30 text-sm">No social links configured yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {platforms.map(p => {
                  const url = socialLinks[p.key as keyof SocialLinksData];
                  if (!url?.trim()) return null;
                  return (
                    <a key={p.key} href={url} target="_blank" rel="noopener noreferrer"
                      className="glass rounded-xl p-6 border border-white/[0.04] hover:border-primary/[0.12] transition-all duration-300 group hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`text-2xl text-white/30 transition-colors duration-300 ${p.color.replace('hover:', 'group-hover:')}`}>{p.icon}</div>
                        <div>
                          <div className="text-sm font-semibold text-white/80">{p.label}</div>
                          <div className="text-[11px] text-white/20 mt-0.5">{url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</div>
                        </div>
                      </div>
                      <p className="text-xs text-white/30 font-light leading-relaxed">{p.desc}</p>
                    </a>
                  );
                })}
              </div>
            )}
          </motion.section>

          {/* Contact */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1 h-6 bg-secondary rounded-full" />
              <h2 className="text-lg font-semibold text-white">Contact Info</h2>
              <span className="text-[11px] text-white/20 bg-white/[0.02] px-3 py-1 rounded-full border border-white/[0.04]">Reach out</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {contacts.map(c => (
                <div key={c.label} className="glass rounded-xl p-6 border border-white/[0.04] hover:border-secondary/[0.12] transition-all duration-300">
                  <div className="text-2xl text-white/30 mb-3">{c.icon}</div>
                  <h3 className="text-sm font-semibold text-white/80 mb-1">{c.label}</h3>
                  {c.href ? (
                    <a href={c.href} className="text-xs text-primary/60 hover:text-primary/80 transition-colors">{c.value}</a>
                  ) : (
                    <p className="text-xs text-white/30 font-light">{c.value}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center p-10 md:p-14 rounded-2xl glass-strong border border-white/[0.04] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.02]" />
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{communityName}</h3>
              <p className="text-sm text-white/30 font-light mb-2">{tagline}</p>
              <p className="text-xs text-white/20 font-light">We don&apos;t just build technology — we build the future.</p>
            </div>
          </motion.section>

        </div>
      </main>
    </div>
  );
}
