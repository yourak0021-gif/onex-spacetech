'use client';

interface SocialLinksData {
  discord: string;
  youtube: string;
  github: string;
  twitter: string;
}

interface ContactInfoData {
  email: string;
  location: string;
  website: string;
}

const socialIcons = {
  discord: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>,
  youtube: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  github: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
  twitter: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
};

const platforms = [
  { key: 'discord', icon: socialIcons.discord, label: 'Discord', color: 'hover:text-[#5865F2]', desc: 'Join our community for real-time chat, support, and networking.' },
  { key: 'youtube', icon: socialIcons.youtube, label: 'YouTube', color: 'hover:text-[#FF0000]', desc: 'Tutorials, showcases, and community highlights.' },
  { key: 'github', icon: socialIcons.github, label: 'GitHub', color: 'hover:text-white', desc: 'Open-source projects, code contributions, and repositories.' },
  { key: 'twitter', icon: socialIcons.twitter, label: 'Twitter / X', color: 'hover:text-[#1DA1F2]', desc: 'Announcements, industry news, and updates.' },
];

const contactIcons = {
  email: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/></svg>,
  location: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>,
  web: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
};

const contactFields = [
  { key: 'email', icon: contactIcons.email, label: 'Email', href: (v: string) => `mailto:${v}` },
  { key: 'location', icon: contactIcons.location, label: 'Location' },
  { key: 'website', icon: contactIcons.web, label: 'Web', href: (v: string) => v.startsWith('http') ? v : `https://${v}` },
];

export default function ContactContent({ communityName, socialLinks, tagline, contactInfo }: { communityName: string; socialLinks: SocialLinksData; tagline: string; contactInfo: ContactInfoData }) {
  const hasAnyLink = Object.values(socialLinks).some(v => v?.trim());

  return (
    <div className="min-h-screen bg-space-dark">
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px] animate-pulse-glow" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards]">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] text-primary/60 uppercase tracking-[0.3em] font-light mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Get in Touch
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight opacity-0 animate-[fadeSlideUp_0.7s_0.1s_ease_forwards]">
            Let&apos;s <span className="text-gradient">Connect</span>
          </h1>

          <p className="text-sm text-white/30 max-w-2xl mx-auto font-light leading-relaxed opacity-0 animate-[fadeSlideUp_0.7s_0.2s_ease_forwards]">
            Reach out, join the conversation, or collaborate with us.
          </p>
        </div>
      </section>

      <main className="pb-24 px-4">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Social */}
          <section className="opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards]">
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
          </section>

          {/* Contact */}
          <section className="opacity-0 animate-[fadeSlideUp_0.5s_0.1s_ease_forwards]">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1 h-6 bg-secondary rounded-full" />
              <h2 className="text-lg font-semibold text-white">Contact Info</h2>
              <span className="text-[11px] text-white/20 bg-white/[0.02] px-3 py-1 rounded-full border border-white/[0.04]">Reach out</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {contactFields.map(cf => {
                const val = contactInfo[cf.key as keyof ContactInfoData];
                const href = cf.href ? cf.href(val) : undefined;
                return (
                  <div key={cf.key} className="glass rounded-xl p-6 border border-white/[0.04] hover:border-secondary/[0.12] transition-all duration-300">
                    <div className="text-2xl text-white/30 mb-3">{cf.icon}</div>
                    <h3 className="text-sm font-semibold text-white/80 mb-1">{cf.label}</h3>
                    {href ? (
                      <a href={href} className="text-xs text-primary/60 hover:text-primary/80 transition-colors">{val}</a>
                    ) : (
                      <p className="text-xs text-white/30 font-light">{val}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center p-10 md:p-14 rounded-2xl glass-strong border border-white/[0.04] relative overflow-hidden opacity-0 animate-[fadeSlideUp_0.5s_0.2s_ease_forwards]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.02]" />
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{communityName}</h3>
              <p className="text-sm text-white/30 font-light mb-2">{tagline}</p>
              <p className="text-xs text-white/20 font-light">We don&apos;t just build technology — we build the future.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
