'use client';

import dynamic from 'next/dynamic';
import Particles from '@/components/Particles';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import ProjectValue from '@/components/ProjectValue';
import TopMembers from '@/components/TopMembers';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import type { SiteContent } from '@/types/content';

const Partners = dynamic(() => import('@/components/Partners'), { ssr: false });
const Services = dynamic(() => import('@/components/Services'), { ssr: false });
const Gallery = dynamic(() => import('@/components/Gallery'), { ssr: false });

interface SitePreviewProps {
  content: SiteContent;
  editMode?: boolean;
  onEditSection?: (section: string) => void;
}

export default function SitePreview({ content, editMode, onEditSection }: SitePreviewProps) {
  const sectionIds = ['hero', 'partners', 'stats', 'project-value', 'members', 'services', 'gallery'];

  const EditOverlay = ({ section }: { section: string }) => {
    if (!editMode) return null;
    return (
      <div
        className="absolute inset-0 z-20 group cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onEditSection?.(section);
        }}
      >
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="btn-gradient px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide shadow-lg shadow-primary/20 inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit {section.charAt(0).toUpperCase() + section.slice(1)}
          </span>
        </div>
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-none" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>
    );
  };

  const SectionWrapper = ({ section, children }: { section: string; children: React.ReactNode }) => {
    if (!editMode) return <>{children}</>;
    return (
      <div className="relative">
        {children}
        <EditOverlay section={section} />
      </div>
    );
  };

  return (
    <div className="relative">
      <Particles />
      <Navbar />
      <main className="relative z-10">
        <div className="relative" id="preview-hero">
          <SectionWrapper section="hero">
            <Hero
              communityName={content.communityName}
              tagline={content.tagline}
              inspirational={content.inspirational}
            />
          </SectionWrapper>
        </div>

        <div className="relative" id="preview-partners">
          <SectionWrapper section="partners">
            <Partners partners={content.partners} />
          </SectionWrapper>
        </div>

        <div className="relative" id="preview-stats">
          <SectionWrapper section="stats">
            <Stats memberCount={content.memberCount} stats={content.stats} />
          </SectionWrapper>
        </div>

        <div className="relative" id="preview-projects">
          <SectionWrapper section="projects">
            <ProjectValue projectInfo={content.projectInfo} />
          </SectionWrapper>
        </div>

        <div className="relative" id="preview-members">
          <SectionWrapper section="members">
            <TopMembers members={content.topMembers} />
          </SectionWrapper>
        </div>

        <div className="relative" id="preview-services">
          <SectionWrapper section="services">
            <Services services={content.services} />
          </SectionWrapper>
        </div>

        <div className="relative" id="preview-gallery">
          <SectionWrapper section="gallery">
            <Gallery images={content.gallery} />
          </SectionWrapper>
        </div>

        <CallToAction />
      </main>
      <Footer communityName={content.communityName} socialLinks={content.socialLinks} />
    </div>
  );
}
