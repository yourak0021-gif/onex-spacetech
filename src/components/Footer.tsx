'use client';

import SocialLinks from './SocialLinks';

interface SocialLinksData {
  discord: string;
  youtube: string;
  github: string;
  twitter: string;
}

export default function Footer({ communityName, socialLinks }: { communityName: string; socialLinks: SocialLinksData }) {
  return (
    <footer className="relative border-t border-white/[0.03] py-10 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-5">
          <h3 className="text-lg font-bold tracking-wider">
            <span className="text-gradient">OneX</span>
            <span className="text-white/40 ml-1.5 font-light tracking-[0.15em]">TECH</span>
          </h3>
        </div>

        <SocialLinks links={socialLinks} />

        <div className="mt-6 text-xs text-white/20 font-light flex items-center justify-center gap-2 flex-wrap">
          <span>&copy; 2020</span>
          <span className="text-white/10">|</span>
          <span>{communityName}</span>
          <span className="text-white/10">|</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
