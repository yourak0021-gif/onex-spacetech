'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiLockClosed, HiLockOpen, HiSave, HiLogout, HiPlus, HiTrash, HiPhotograph,
  HiHome, HiInformationCircle, HiChartBar, HiCollection, HiLink,
  HiPhotograph as HiPhotoIcon, HiMenu, HiX, HiShieldCheck, HiTrendingUp,
  HiBookOpen, HiEye, HiUserGroup, HiAcademicCap, HiStar,
} from 'react-icons/hi';
import SitePreview from '@/components/SitePreview';
import type { SiteContent } from '@/types/content';

const iconOptions = [
  'FaGamepad', 'FaCode', 'FaImage', 'FaVideo', 'FaPaintBrush', 'FaTrophy',
  'FaServer', 'FaGlobe', 'FaNetworkWired', 'FaRocket', 'FaCube', 'FaDatabase',
];

type Tab = 'preview' | 'general' | 'about' | 'inspirational' | 'projects' | 'members' | 'services' | 'stats' | 'gallery' | 'social' | 'courses' | 'partners';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'preview', label: 'Live Preview', icon: <HiEye /> },
  { id: 'general', label: 'General', icon: <HiHome /> },
  { id: 'about', label: 'About', icon: <HiInformationCircle /> },
  { id: 'inspirational', label: 'Inspiration', icon: <HiBookOpen /> },
  { id: 'projects', label: 'Project Value', icon: <HiTrendingUp /> },
  { id: 'members', label: 'Top Members', icon: <HiUserGroup /> },
  { id: 'services', label: 'Services', icon: <HiCollection /> },
  { id: 'stats', label: 'Statistics', icon: <HiChartBar /> },
  { id: 'gallery', label: 'Gallery', icon: <HiPhotoIcon /> },
  { id: 'social', label: 'Social Links', icon: <HiLink /> },
  { id: 'partners', label: 'Partners', icon: <HiStar /> },
  { id: 'courses', label: 'Courses', icon: <HiAcademicCap /> },
];

const sectionToTab: Record<string, Tab> = {
  hero: 'general',
  stats: 'stats',
  projects: 'projects',
  about: 'about',
  members: 'members',
  services: 'services',
  partners: 'partners',
  gallery: 'gallery',
};

export default function AdminPanel({ initialContent, initialAuthed }: { initialContent: SiteContent | null; initialAuthed: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthed);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveMsgType, setSaveMsgType] = useState<'success' | 'error'>('success');
  const [content, setContent] = useState<SiteContent | null>(initialContent);
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const doFetchContent = async () => {
    const dataRes = await fetch('/api/content');
    if (dataRes.ok) {
      const data = await dataRes.json();
      setContent(data);
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        await doFetchContent();
        setAuthenticated(true);
      } else {
        let errMsg = 'Invalid password';
        try { const d = await res.json(); errMsg = d.error || errMsg; } catch {}
        setError(errMsg);
      }
    } catch {
      setError('Connection error');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
    setContent(null);
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        setSaveMsgType('success');
        setSaveMsg('All changes saved. Public site updates immediately.');
      } else if (res.status === 401) {
        setAuthenticated(false);
        setContent(null);
        setSaveMsgType('error');
        setSaveMsg('Session expired. Please login again.');
      } else {
        let errMsg = 'Failed to save changes.';
        try { const d = await res.json(); errMsg = d.error || errMsg; } catch {}
        setSaveMsgType('error');
        setSaveMsg(errMsg);
      }
    } catch {
      setSaveMsgType('error');
      setSaveMsg('Connection error while saving.');
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 5000);
  };

  const updateField = (path: string, value: any) => {
    setContent((prev) => {
      if (!prev) return prev;
      const newContent = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj: any = newContent;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  const addService = () => {
    setContent((prev) => {
      if (!prev) return prev;
      const newId = prev.services.length > 0 ? Math.max(...prev.services.map((s) => s.id)) + 1 : 1;
      return {
        ...prev,
        services: [...prev.services, { id: newId, title: 'New Service', description: '', icon: 'FaCode', category: '' }],
      };
    });
  };

  const removeService = (id: number) => {
    setContent((prev) => {
      if (!prev) return prev;
      return { ...prev, services: prev.services.filter((s) => s.id !== id) };
    });
  };

  const updateService = (index: number, field: string, value: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      const newServices = [...prev.services];
      newServices[index] = { ...newServices[index], [field]: value };
      return { ...prev, services: newServices };
    });
  };

  const addGalleryImage = () => {
    const url = prompt('Enter image URL:');
    if (url && content) {
      setContent({ ...content, gallery: [...content.gallery, { url, description: '' }] });
    }
  };

  const removeGalleryImage = (index: number) => {
    if (content) {
      setContent({ ...content, gallery: content.gallery.filter((_, i) => i !== index) });
    }
  };

  const updateGalleryItem = (index: number, field: string, value: string) => {
    if (content) {
      const newGallery = content.gallery.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setContent({ ...content, gallery: newGallery });
    }
  };

  const handleEditSection = (section: string) => {
    const tab = sectionToTab[section] || 'general';
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  // --- Login Screen ---
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-space-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-strong rounded-3xl p-8 md:p-10 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl text-white shadow-lg shadow-primary/20">
              <HiShieldCheck />
            </div>
            <h1 className="text-2xl font-bold text-gradient">Admin Access</h1>
            <p className="text-white/30 text-sm mt-2">Authorized personnel only</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all text-sm"
                autoFocus
              />
            </div>
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm">
                {error}
              </motion.p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-3.5 rounded-xl font-semibold tracking-wide flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <HiLockOpen />
              )}
              {loading ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>

          <p className="text-center text-xs text-white/20 mt-6">
            OneX SpaceTechnologies &middot; Admin Panel v3.0
          </p>
        </motion.div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-space-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-white/30 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="min-h-screen bg-space-dark flex">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="fixed md:static md:translate-x-0 top-0 left-0 h-full w-64 z-50 bg-space-light/95 backdrop-blur-xl border-r border-white/5 overflow-y-auto"
      >
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">
              <span className="text-gradient">OneX</span>
              <span className="text-white/50 ml-1">Admin</span>
            </h2>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/40 hover:text-white">
              <HiX size={18} />
            </button>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <HiLogout /> Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-white/5">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white/50 hover:text-white">
                <HiMenu size={20} />
              </button>
              <div>
                <h1 className="text-sm font-semibold text-white capitalize">
                  {tabs.find((t) => t.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-white/30">
                  {activeTab === 'preview'
                    ? 'Hover over any section and click Edit to modify content'
                    : 'Changes appear instantly in Live Preview'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeTab !== 'preview' && (
                <button
                  onClick={() => setActiveTab('preview')}
                  className="glass px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <HiEye /> Preview
                </button>
              )}
              <AnimatePresence>
                {saveMsg && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap ${
                      saveMsgType === 'success'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {saveMsg}
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
              >
                <HiSave /> {saving ? 'Saving...' : 'Publish Changes'}
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'preview' && (
                <div className="min-h-screen">
                  <SitePreview minimal={content} editMode onEditSection={handleEditSection} />
                </div>
              )}
              {activeTab !== 'preview' && (
                <div className="p-4 md:p-6 max-w-5xl">
                  {activeTab === 'general' && <GeneralTab content={content} updateField={updateField} />}
                  {activeTab === 'about' && <AboutTab content={content} updateField={updateField} />}
                  {activeTab === 'inspirational' && <InspirationalTab content={content} updateField={updateField} />}
                  {activeTab === 'projects' && <ProjectsTab content={content} updateField={updateField} />}
                  {activeTab === 'members' && (
                    <MembersTab content={content} updateField={updateField} />
                  )}
                  {activeTab === 'services' && (
                    <ServicesTab
                      content={content}
                      addService={addService}
                      removeService={removeService}
                      updateService={updateService}
                    />
                  )}
                  {activeTab === 'stats' && <StatsTab content={content} updateField={updateField} />}
                  {activeTab === 'gallery' && (
                    <GalleryTab content={content} addImage={addGalleryImage} removeImage={removeGalleryImage} updateItem={updateGalleryItem} />
                  )}
                  {activeTab === 'social' && <SocialTab content={content} updateField={updateField} />}
                  {activeTab === 'partners' && <PartnersTab content={content} updateField={updateField} />}
                  {activeTab === 'courses' && <CoursesTab content={content} updateField={updateField} />}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Tab Components ---

function Input({ label, value, onChange, type = 'text', placeholder, rows }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string; rows?: number;
}) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs text-white/40 uppercase tracking-wider">{label}</label>
      {rows ? (
        <textarea
          id={id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all text-sm resize-vertical min-h-[80px]"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all text-sm"
        />
      )}
    </div>
  );
}

function Card({ title, description, children, compact }: { title?: string; description?: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className={`glass-strong rounded-2xl ${compact ? 'p-4' : 'p-5 md:p-6'} space-y-5`}>
      {title && (
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {description && <p className="text-xs text-white/30 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function GeneralTab({ content, updateField }: { content: SiteContent; updateField: (p: string, v: any) => void }) {
  return (
    <div className="space-y-5">
      <Card title="Community Identity" description="Your community name and tagline appear in the hero section">
        <Input label="Community Name" value={content.communityName} onChange={(v) => updateField('communityName', v)} />
        <Input label="Tagline" value={content.tagline} onChange={(v) => updateField('tagline', v)} placeholder="e.g., Beyond Boundaries. Beyond Limits." rows={2} />
      </Card>
      <Card title="Member Count" description="Shown in the hero stats and member counter">
        <Input label="Total Members" value={content.memberCount} onChange={(v) => updateField('memberCount', parseInt(v) || 0)} type="number" />
      </Card>
    </div>
  );
}

function AboutTab({ content, updateField }: { content: SiteContent; updateField: (p: string, v: any) => void }) {
  return (
    <div className="space-y-5">
      <Card title="About Section" description="Tell visitors about your community">
        <Input label="Section Title" value={content.about.title} onChange={(v) => updateField('about.title', v)} />
        <Input label="Description" value={content.about.description} onChange={(v) => updateField('about.description', v)} rows={4} />
        <Input label="Mission" value={content.about.mission} onChange={(v) => updateField('about.mission', v)} rows={3} />
        <Input label="Vision" value={content.about.vision} onChange={(v) => updateField('about.vision', v)} rows={3} />
      </Card>
    </div>
  );
}

function InspirationalTab({ content, updateField }: { content: SiteContent; updateField: (p: string, v: any) => void }) {
  return (
    <div className="space-y-5">
      <Card title="Inspirational Quote" description="This quote appears in the hero section to inspire visitors">
        <Input label="Quote" value={content.inspirational.quote} onChange={(v) => updateField('inspirational.quote', v)} rows={3} />
        <Input label="Author" value={content.inspirational.author} onChange={(v) => updateField('inspirational.author', v)} />
      </Card>
    </div>
  );
}

function ProjectsTab({ content, updateField }: { content: SiteContent; updateField: (p: string, v: any) => void }) {
  return (
    <div className="space-y-5">
      <Card title="Project Ecosystem Value" description="Auto-increments by 10,000–10,000,000 every 1-2 hours. Set the base value here.">
        <Input label="Current Value" value={content.projectInfo.value} onChange={(v) => updateField('projectInfo.value', parseInt(v) || 0)} type="number" />
        <Input label="Section Title" value={content.projectInfo.title} onChange={(v) => updateField('projectInfo.title', v)} />
        <Input label="Description" value={content.projectInfo.description} onChange={(v) => updateField('projectInfo.description', v)} rows={3} />
      </Card>
      <Card compact>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/30 animate-pulse" />
          <span className="text-white/40">Auto-increment active — value updates every 1–2 hours</span>
        </div>
      </Card>
    </div>
  );
}

function ServicesTab({ content, addService, removeService, updateService }: {
  content: SiteContent; addService: () => void; removeService: (id: number) => void; updateService: (i: number, f: string, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Services</h3>
          <p className="text-xs text-white/30 mt-1">{content.services.length} services configured</p>
        </div>
        <button onClick={addService} className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <HiPlus /> Add Service
        </button>
      </div>
      {content.services.length === 0 ? (
        <Card>
          <p className="text-white/30 text-sm text-center py-4">No services yet. Click &ldquo;Add Service&rdquo; to get started.</p>
        </Card>
      ) : (
        content.services.map((service, i) => (
          <Card key={service.id}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/30 uppercase tracking-wider">Service #{i + 1}</span>
              <button onClick={() => removeService(service.id)} className="text-red-400/60 hover:text-red-400 transition-colors text-sm flex items-center gap-1">
                <HiTrash /> Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Title" value={service.title} onChange={(v) => updateService(i, 'title', v)} />
              <div className="space-y-1.5">
                <label className="text-xs text-white/40 uppercase tracking-wider">Icon</label>
                <select
                  value={service.icon}
                  onChange={(e) => updateService(i, 'icon', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon} className="bg-space-dark">{icon.replace('Fa', '')}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input label="Description" value={service.description} onChange={(v) => updateService(i, 'description', v)} rows={2} />
          </Card>
        ))
      )}
    </div>
  );
}

function StatsTab({ content, updateField }: { content: SiteContent; updateField: (p: string, v: any) => void }) {
  return (
    <div className="space-y-5">
      <Card title="Statistics" description="Numbers shown in the stats counter section">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Members" value={content.stats.members} onChange={(v) => updateField('stats.members', parseInt(v) || 0)} type="number" />
          <Input label="Services Count" value={content.stats.services} onChange={(v) => updateField('stats.services', parseInt(v) || 0)} type="number" />
          <Input label="Projects" value={content.stats.projects} onChange={(v) => updateField('stats.projects', parseInt(v) || 0)} type="number" />
          <Input label="Events" value={content.stats.events} onChange={(v) => updateField('stats.events', parseInt(v) || 0)} type="number" />
        </div>
      </Card>
    </div>
  );
}

function GalleryTab({ content, addImage, removeImage, updateItem }: {
  content: SiteContent; addImage: () => void; removeImage: (i: number) => void; updateItem: (i: number, f: string, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Gallery</h3>
          <p className="text-xs text-white/30 mt-1">{content.gallery.length} images. Hidden from public until images are added.</p>
        </div>
        <button onClick={addImage} className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <HiPhotograph /> Add Image URL
        </button>
      </div>
      {content.gallery.length === 0 ? (
        <Card>
          <p className="text-white/30 text-sm text-center py-4">No gallery images yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {content.gallery.map((item, i) => (
            <Card key={i} compact>
              <div className="flex gap-4">
                <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-white/[0.02]">
                  <img src={item.url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <Input label="URL" value={item.url} onChange={(v) => updateItem(i, 'url', v)} />
                  <Input label="Description" value={item.description} onChange={(v) => updateItem(i, 'description', v)} placeholder="Brief description of this image" />
                </div>
                <button onClick={() => removeImage(i)} className="text-red-400/60 hover:text-red-400 transition-colors self-start mt-6 shrink-0">
                  <HiTrash />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialTab({ content, updateField }: { content: SiteContent; updateField: (p: string, v: any) => void }) {
  return (
    <div className="space-y-5">
      <Card title="Social Links" description="Leave empty to hide. Links only appear on the public site when a URL is provided.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Discord URL" value={content.socialLinks.discord} onChange={(v) => updateField('socialLinks.discord', v)} placeholder="https://discord.gg/..." />
          <Input label="YouTube URL" value={content.socialLinks.youtube} onChange={(v) => updateField('socialLinks.youtube', v)} placeholder="https://youtube.com/@..." />
          <Input label="GitHub URL" value={content.socialLinks.github} onChange={(v) => updateField('socialLinks.github', v)} placeholder="https://github.com/..." />
          <Input label="Twitter / X URL" value={content.socialLinks.twitter} onChange={(v) => updateField('socialLinks.twitter', v)} placeholder="https://twitter.com/..." />
        </div>
      </Card>
    </div>
  );
}

function CoursesTab({ content, updateField }: { content: SiteContent; updateField: (p: string, v: any) => void }) {
  const addCourse = () => {
    const newId = content.courses.length > 0 ? Math.max(...content.courses.map((c) => c.id)) + 1 : 1;
    updateField('courses', [...content.courses, { id: newId, title: 'New Course', description: '', duration: '8 weeks', level: 'Intermediate', category: 'General', certificate: true, price: 0 }]);
  };

  const removeCourse = (id: number) => {
    updateField('courses', content.courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: number, field: string, value: any) => {
    updateField('courses', content.courses.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCertificate = () => {
    const newId = content.certificates.length > 0 ? Math.max(...content.certificates.map((c) => c.id)) + 1 : 1;
    updateField('certificates', [...content.certificates, { id: newId, name: 'New Certificate', description: '', issuer: 'OneX SpaceTechnologies', price: 0 }]);
  };

  const removeCertificate = (id: number) => {
    updateField('certificates', content.certificates.filter((c) => c.id !== id));
  };

  const updateCertificate = (id: number, field: string, value: any) => {
    updateField('certificates', content.certificates.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Courses</h3>
            <p className="text-xs text-white/30 mt-1">{content.courses.length} courses</p>
          </div>
          <button onClick={addCourse} className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <HiPlus /> Add Course
          </button>
        </div>
        {content.courses.length === 0 ? (
          <Card><p className="text-white/30 text-sm text-center py-4">No courses yet.</p></Card>
        ) : (
          content.courses.map((course) => (
            <Card key={course.id}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/30 uppercase tracking-wider">Course #{course.id}</span>
                <button onClick={() => removeCourse(course.id)} className="text-red-400/60 hover:text-red-400 text-sm flex items-center gap-1">
                  <HiTrash /> Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Title" value={course.title} onChange={(v) => updateCourse(course.id, 'title', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Duration" value={course.duration} onChange={(v) => updateCourse(course.id, 'duration', v)} placeholder="e.g. 8 weeks" />
                  <Input label="Level" value={course.level} onChange={(v) => updateCourse(course.id, 'level', v)} placeholder="Beginner / Intermediate / Advanced" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Category" value={course.category} onChange={(v) => updateCourse(course.id, 'category', v)} placeholder="e.g. Software Development" />
                  <Input label="Price ($)" value={course.price} type="number" onChange={(v) => updateCourse(course.id, 'price', parseInt(v) || 0)} />
                </div>
              </div>
              <Input label="Description" value={course.description} onChange={(v) => updateCourse(course.id, 'description', v)} rows={2} />
              <label className="flex items-center gap-2 text-xs text-white/40 mt-2">
                <input type="checkbox" checked={course.certificate} onChange={(e) => updateCourse(course.id, 'certificate', e.target.checked)} className="rounded border-white/20" />
                Offers certificate upon completion
              </label>
            </Card>
          ))
        )}
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Certificates</h3>
            <p className="text-xs text-white/30 mt-1">{content.certificates.length} certificates</p>
          </div>
          <button onClick={addCertificate} className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <HiPlus /> Add Certificate
          </button>
        </div>
        {content.certificates.length === 0 ? (
          <Card><p className="text-white/30 text-sm text-center py-4">No certificates yet.</p></Card>
        ) : (
          content.certificates.map((cert) => (
            <Card key={cert.id}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/30 uppercase tracking-wider">Certificate #{cert.id}</span>
                <button onClick={() => removeCertificate(cert.id)} className="text-red-400/60 hover:text-red-400 text-sm flex items-center gap-1">
                  <HiTrash /> Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Name" value={cert.name} onChange={(v) => updateCertificate(cert.id, 'name', v)} />
                <Input label="Price ($)" value={cert.price} type="number" onChange={(v) => updateCertificate(cert.id, 'price', parseInt(v) || 0)} />
              </div>
              <Input label="Issuer" value={cert.issuer} onChange={(v) => updateCertificate(cert.id, 'issuer', v)} />
              <Input label="Description" value={cert.description} onChange={(v) => updateCertificate(cert.id, 'description', v)} rows={2} />
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function PartnersTab({ content, updateField }: { content: SiteContent; updateField: (p: string, v: any) => void }) {
  const addPartner = () => {
    const newId = content.partners.length > 0 ? Math.max(...content.partners.map((p) => p.id)) + 1 : 1;
    updateField('partners', [...content.partners, { id: newId, name: 'New Partner', logo: '', url: '', category: 'Technology', description: '' }]);
  };

  const removePartner = (id: number) => {
    updateField('partners', content.partners.filter((p) => p.id !== id));
  };

  const updatePartner = (id: number, field: string, value: any) => {
    updateField('partners', content.partners.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const categories = [...new Set(content.partners.map((p) => p.category))].sort();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Partners</h3>
          <p className="text-xs text-white/30 mt-1">{content.partners.length} partners</p>
        </div>
        <button onClick={addPartner} className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <HiPlus /> Add Partner
        </button>
      </div>
      {content.partners.length === 0 ? (
        <Card><p className="text-white/30 text-sm text-center py-4">No partners yet.</p></Card>
      ) : (
        content.partners.map((partner) => (
          <Card key={partner.id}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/30 uppercase tracking-wider">Partner #{partner.id}</span>
              <button onClick={() => removePartner(partner.id)} className="text-red-400/60 hover:text-red-400 text-sm flex items-center gap-1">
                <HiTrash /> Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Company Name" value={partner.name} onChange={(v) => updatePartner(partner.id, 'name', v)} />
              <Input label="Website URL" value={partner.url} onChange={(v) => updatePartner(partner.id, 'url', v)} placeholder="https://example.com" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Logo URL" value={partner.logo} onChange={(v) => updatePartner(partner.id, 'logo', v)} placeholder="https://logo.clearbit.com/example.com" />
              <div className="space-y-1.5">
                <label className="text-xs text-white/40 uppercase tracking-wider">Category</label>
                <input
                  type="text"
                  value={partner.category}
                  onChange={(e) => updatePartner(partner.id, 'category', e.target.value)}
                  placeholder="e.g. Space & Aerospace"
                  list="partner-categories"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all text-sm"
                />
                <datalist id="partner-categories">
                  {['Space & Aerospace', 'Big Tech / Cloud', 'AI & Machine Learning', 'Cybersecurity', 'DevOps / Infrastructure', 'Design / Creative', 'Data & Analytics', 'Networking / Telecom', 'Gaming / Esports', 'Social / Marketing', 'Finance / Consulting', 'Education', 'Open Source / Collaboration'].map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-white/40 uppercase tracking-wider">Parent Company (optional)</label>
                <select
                  value={partner.parentId || ''}
                  onChange={(e) => updatePartner(partner.id, 'parentId', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all text-sm"
                >
                  <option value="">— None (standalone) —</option>
                  {content.partners.filter(p => p.id !== partner.id && !p.parentId).map(p => (
                    <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/40 uppercase tracking-wider">Parent ID (manual)</label>
                <input
                  type="number"
                  value={partner.parentId || ''}
                  onChange={(e) => updatePartner(partner.id, 'parentId', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 1001 for Alphabet"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all text-sm"
                />
              </div>
            </div>
            <Input label="Description" value={partner.description} onChange={(v) => updatePartner(partner.id, 'description', v)} rows={2} placeholder="Partnership context or description" />
          </Card>
        ))
      )}
    </div>
  );
}

function MembersTab({ content, updateField }: { content: SiteContent; updateField: (p: string, v: any) => void }) {
  const addMember = () => {
    const newMembers = [...content.topMembers, { name: 'New Member', role: 'Role', description: '' }];
    updateField('topMembers', newMembers);
  };

  const removeMember = (index: number) => {
    const newMembers = content.topMembers.filter((_, i) => i !== index);
    updateField('topMembers', newMembers);
  };

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = content.topMembers.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    updateField('topMembers', newMembers);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Top Members</h3>
          <p className="text-xs text-white/30 mt-1">{content.topMembers.length} members displayed</p>
        </div>
        <button onClick={addMember} className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <HiPlus /> Add Member
        </button>
      </div>
      {content.topMembers.length === 0 ? (
        <Card>
          <p className="text-white/30 text-sm text-center py-4">No top members yet.</p>
        </Card>
      ) : (
        content.topMembers.map((member, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/30 uppercase tracking-wider">Member #{i + 1}</span>
              <button onClick={() => removeMember(i)} className="text-red-400/60 hover:text-red-400 transition-colors text-sm flex items-center gap-1">
                <HiTrash /> Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Name" value={member.name} onChange={(v) => updateMember(i, 'name', v)} />
              <Input label="Role" value={member.role} onChange={(v) => updateMember(i, 'role', v)} />
            </div>
            <Input label="Description" value={member.description} onChange={(v) => updateMember(i, 'description', v)} rows={2} />
          </Card>
        ))
      )}
    </div>
  );
}
