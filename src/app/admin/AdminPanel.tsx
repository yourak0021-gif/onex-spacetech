'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SiteContent } from '@/types/content';

type Tab = 'stats' | 'project' | 'social' | 'contact' | 'preview';

const S = {
  page: { minHeight: '100vh', background: '#0d1117', display: 'flex', fontFamily: 'monospace', color: '#e6edf3', fontSize: 12 } as const,
  center: { minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' } as const,
  input: { width: '100%', padding: '8px 12px', background: '#161b22', border: '1px solid #30363d', color: '#e6edf3', fontSize: 13, outline: 'none', fontFamily: 'monospace' } as const,
  btn: (hover: boolean) => ({ padding: '8px 0', background: hover ? '#30363d' : '#21262d', border: '1px solid #30363d', color: '#e6edf3', fontSize: 12, cursor: 'pointer', fontFamily: 'monospace', width: '100%' } as const),
  sidebarItem: (active: boolean, hover?: boolean) => ({
    padding: '8px 20px', cursor: 'pointer',
    background: active ? '#161b22' : hover ? '#161b22' : 'transparent',
    color: active ? '#58a6ff' : '#8b949e', fontSize: 12,
  } as const),
  link: { color: '#58a6ff', cursor: 'pointer', textDecoration: 'none' } as const,
  borderBox: { border: '1px solid #21262d', padding: 16, marginBottom: 12 } as const,
};

function useContentPoll(intervalMs = 30000) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) setContent(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchContent(); const id = setInterval(fetchContent, intervalMs); return () => clearInterval(id); }, [fetchContent, intervalMs]);
  return { content, setContent, loading, refresh: fetchContent };
}

export default function AdminPanel({ initialContent, initialAuthed }: { initialContent: SiteContent | null; initialAuthed: boolean }) {
  const { content, setContent, loading: contentLoading } = useContentPoll(30000);

  const [privacyVerified, setPrivacyVerified] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [privacyError, setPrivacyError] = useState('');
  const [privacyKey, setPrivacyKey] = useState('');

  const [authenticated, setAuthenticated] = useState(initialAuthed);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [password, setPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('preview');

  // Auto-increment countdowns
  const [nextValueUpdate, setNextValueUpdate] = useState('');
  const [nextProjectsUpdate, setNextProjectsUpdate] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      if (content?.projectInfo?.nextUpdate) {
        const d = content.projectInfo.nextUpdate - now;
        setNextValueUpdate(d > 0 ? `${Math.floor(d / 60000)}m ${Math.floor((d % 60000) / 1000)}s` : 'any moment');
      } else setNextValueUpdate('-');
      if (content?.stats?.projectsNextUpdate) {
        const d = content.stats.projectsNextUpdate - now;
        setNextProjectsUpdate(d > 0 ? `${Math.floor(d / 60000)}m ${Math.floor((d % 60000) / 1000)}s` : 'any moment');
      } else setNextProjectsUpdate('-');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [content?.projectInfo?.nextUpdate, content?.stats?.projectsNextUpdate]);

  const handlePrivacy = async () => {
    setPrivacyError(''); setPrivacyLoading(true);
    try {
      const res = await fetch('/api/auth/privacy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: privacyKey }),
      });
      if (res.ok) setPrivacyVerified(true);
      else { let m = 'Invalid key'; try { const d = await res.json(); m = d.error || m; } catch {} setPrivacyError(m); }
    } catch { setPrivacyError('Connection error'); }
    setPrivacyLoading(false);
  };

  const handleLogin = async () => {
    setLoginError(''); setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      });
      if (res.ok) setAuthenticated(true);
      else { let m = 'Invalid password'; try { const d = await res.json(); m = d.error || m; } catch {} setLoginError(m); }
    } catch { setLoginError('Connection error'); }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false); setPrivacyVerified(false); setPrivacyKey(''); setPassword('');
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true); setSaveMsg('');
    try {
      const res = await fetch('/api/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) });
      if (res.ok) { setContent(await res.json()); setSaveMsg('saved'); }
      else if (res.status === 401) { setAuthenticated(false); setSaveMsg('session expired'); }
      else setSaveMsg('save failed');
    } catch { setSaveMsg('connection error'); }
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const updateField = (path: string, value: any) => {
    setContent((prev) => {
      if (!prev) return prev;
      const c = JSON.parse(JSON.stringify(prev));
      const k = path.split('.');
      let o: any = c;
      for (let i = 0; i < k.length - 1; i++) o = o[k[i]];
      o[k[k.length - 1]] = value;
      return c;
    });
  };

  const modifyNumber = (path: string, delta: number) => {
    setContent((prev) => {
      if (!prev) return prev;
      const c = JSON.parse(JSON.stringify(prev));
      const k = path.split('.');
      let o: any = c;
      for (let i = 0; i < k.length - 1; i++) o = o[k[i]];
      o[k[k.length - 1]] = (o[k[k.length - 1]] || 0) + delta;
      return c;
    });
  };

  // Privacy screen
  if (!privacyVerified) {
    return (
      <div style={S.center}>
        <div style={{ width: 400, padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ color: '#ff7b72', fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>PRIVACY ACCESS</div>
            <div style={{ color: '#8b949e', fontSize: 11 }}>authorized personnel only</div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handlePrivacy(); }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#8b949e', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>privacy key</label>
              <input
                type="password" value={privacyKey} onChange={(e) => setPrivacyKey(e.target.value)} autoFocus
                style={S.input}
                onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
            </div>
            {privacyError && <div style={{ color: '#ff7b72', fontSize: 12, marginBottom: 12 }}>{privacyError}</div>}
            <button
              type="submit" disabled={privacyLoading}
              style={S.btn(false)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#30363d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#21262d'; }}
            >
              {privacyLoading ? 'verifying...' : '[ VERIFY ]'}
            </button>
          </form>
          <div style={{ color: '#484f58', fontSize: 10, textAlign: 'center', marginTop: 24 }}>---</div>
        </div>
      </div>
    );
  }

  // Login screen
  if (!authenticated) {
    return (
      <div style={S.center}>
        <div style={{ width: 400, padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ color: '#58a6ff', fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>ADMIN LOGIN</div>
            <div style={{ color: '#8b949e', fontSize: 11 }}>OneX SpaceTechnologies</div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#8b949e', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus
                style={S.input}
                onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
            </div>
            {loginError && <div style={{ color: '#ff7b72', fontSize: 12, marginBottom: 12 }}>{loginError}</div>}
            <button
              type="submit" disabled={loginLoading}
              style={S.btn(false)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#30363d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#21262d'; }}
            >
              {loginLoading ? 'verifying...' : '[ UNLOCK ]'}
            </button>
          </form>
          <div style={{ color: '#484f58', fontSize: 10, textAlign: 'center', marginTop: 24 }}>---</div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={S.center}>
        <div style={{ color: '#8b949e', fontSize: 12 }}>loading...</div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'preview', label: 'live preview' },
    { id: 'stats', label: 'stats' },
    { id: 'project', label: 'project value' },
    { id: 'social', label: 'social links' },
    { id: 'contact', label: 'contact info' },
  ];

  return (
    <div style={S.page}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #21262d', color: '#58a6ff', fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
          ADMIN PANEL
        </div>
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {tabs.map((tab) => (
            <div
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={S.sidebarItem(activeTab === tab.id)}
              onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.background = '#161b22'; }}
              onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}
            >
              {activeTab === tab.id ? '> ' : '  '}{tab.label}
            </div>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid #21262d', padding: '8px 0' }}>
          <div
            onClick={handleLogout}
            style={{ padding: '8px 20px', cursor: 'pointer', color: '#484f58', fontSize: 12 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ff7b72'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#484f58'; }}
          >logout</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: '#8b949e', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
            {tabs.find(t => t.id === activeTab)?.label || ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {saveMsg && <span style={{ color: '#3fb950', fontSize: 11 }}>{saveMsg}</span>}
            {contentLoading && <span style={{ color: '#484f58', fontSize: 10 }}>syncing...</span>}
            <button
              onClick={handleSave} disabled={saving}
              style={{ padding: '6px 16px', background: '#21262d', border: '1px solid #30363d', color: '#e6edf3', fontSize: 11, cursor: 'pointer', fontFamily: 'monospace' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#30363d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#21262d'; }}
            >
              [ {saving ? 'saving...' : 'SAVE'} ]
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 24, overflow: 'auto', flex: 1 }}>

          {/* PREVIEW TAB */}
          {activeTab === 'preview' && (
            <div>
              <div style={{ color: '#8b949e', fontSize: 11, marginBottom: 20 }}>
                live view — updates instantly as you edit. auto-refreshes every 30s for server increments.
              </div>

              <div style={S.borderBox}>
                <div style={{ color: '#58a6ff', fontSize: 11, fontWeight: 700, marginBottom: 16, letterSpacing: 0.5 }}>OUR IMPACT</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ color: '#8b949e', fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Members</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#e6edf3' }}>{(content.stats?.members || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ color: '#8b949e', fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Services</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#e6edf3' }}>{(content.stats?.services || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ color: '#8b949e', fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Projects</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#e6edf3' }}>{(content.stats?.projects || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ color: '#8b949e', fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Events</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#e6edf3' }}>{(content.stats?.events || 0).toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #21262d', color: '#484f58', fontSize: 10 }}>
                  projects auto-increment: <span style={{ color: '#8b949e' }}>{nextProjectsUpdate}</span>
                </div>
              </div>

              <div style={S.borderBox}>
                <div style={{ color: '#58a6ff', fontSize: 11, fontWeight: 700, marginBottom: 16, letterSpacing: 0.5 }}>PROJECT ECOSYSTEM VALUE</div>
                <div>
                  <div style={{ color: '#8b949e', fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{content.projectInfo?.title || 'Project Ecosystem Value'}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#3fb950' }}>${(content.projectInfo?.value || 0).toLocaleString()}</div>
                </div>
                <div style={{ marginTop: 12, color: '#8b949e', fontSize: 10 }}>{content.projectInfo?.description}</div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #21262d', color: '#484f58', fontSize: 10 }}>
                  value auto-increment: <span style={{ color: '#8b949e' }}>{nextValueUpdate}</span>
                </div>
              </div>

              <div style={{ color: '#484f58', fontSize: 10, marginTop: 8 }}>
                soc: {content.socialLinks?.discord ? 'discord ' : ''}{content.socialLinks?.youtube ? 'youtube ' : ''}{content.socialLinks?.github ? 'github ' : ''}{content.socialLinks?.twitter ? 'twitter ' : ''}
                &middot; contact: {content.contactInfo?.email || '-'} / {content.contactInfo?.website || '-'}
              </div>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div>
              <div style={{ color: '#8b949e', fontSize: 11, marginBottom: 20 }}>Edit the numbers shown in the "Our Impact" section.</div>
              <NumberField label="members" value={content.stats.members} onChange={(v) => updateField('stats.members', v)} />
              <NumberField label="services" value={content.stats.services} onChange={(v) => updateField('stats.services', v)} />
              <NumberField label="projects" value={content.stats.projects} onChange={(v) => updateField('stats.projects', v)} />
              <NumberField label="events" value={content.stats.events} onChange={(v) => updateField('stats.events', v)} />
            </div>
          )}

          {/* PROJECT VALUE TAB */}
          {activeTab === 'project' && (
            <div>
              <div style={{ color: '#8b949e', fontSize: 11, marginBottom: 20 }}>Project Ecosystem Value. Auto-increment adds 10k–10M every 1-2 hours.</div>
              <Field label="title" value={content.projectInfo.title} onChange={(v) => updateField('projectInfo.title', v)} />
              <Field label="description" value={content.projectInfo.description} onChange={(v) => updateField('projectInfo.description', v)} />
              <NumberField label="value" value={content.projectInfo.value} onChange={(v) => updateField('projectInfo.value', v)} />
            </div>
          )}

          {/* SOCIAL TAB */}
          {activeTab === 'social' && (
            <div>
              <div style={{ color: '#8b949e', fontSize: 11, marginBottom: 20 }}>Social URLs. Leave empty to hide that platform.</div>
              <Field label="discord" value={content.socialLinks.discord} onChange={(v) => updateField('socialLinks.discord', v)} />
              <Field label="youtube" value={content.socialLinks.youtube} onChange={(v) => updateField('socialLinks.youtube', v)} />
              <Field label="github" value={content.socialLinks.github} onChange={(v) => updateField('socialLinks.github', v)} />
              <Field label="twitter" value={content.socialLinks.twitter} onChange={(v) => updateField('socialLinks.twitter', v)} />
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === 'contact' && (
            <div>
              <div style={{ color: '#8b949e', fontSize: 11, marginBottom: 20 }}>Contact info shown on the /connect page.</div>
              <Field label="email" value={content.contactInfo.email} onChange={(v) => updateField('contactInfo.email', v)} />
              <Field label="location" value={content.contactInfo.location} onChange={(v) => updateField('contactInfo.location', v)} />
              <Field label="website" value={content.contactInfo.website} onChange={(v) => updateField('contactInfo.website', v)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string | number; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 80, flexShrink: 0, color: '#8b949e', fontSize: 11, textAlign: 'right', textTransform: 'lowercase' }}>{label}:</div>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1, maxWidth: 500, padding: '6px 10px', background: '#161b22', border: '1px solid #30363d', color: '#e6edf3', fontSize: 12, outline: 'none', fontFamily: 'monospace' }}
        onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
        onBlur={(e) => e.target.style.borderColor = '#30363d'}
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [addVal, setAddVal] = useState('');
  const [subVal, setSubVal] = useState('');
  const btnS = { padding: '6px 10px', background: '#21262d', border: '1px solid #30363d', cursor: 'pointer', fontSize: 12, fontFamily: 'monospace' } as const;
  const inputS = { width: 60, padding: '6px 8px', background: '#161b22', border: '1px solid #30363d', color: '#e6edf3', fontSize: 12, outline: 'none', fontFamily: 'monospace' } as const;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 80, flexShrink: 0, color: '#8b949e', fontSize: 11, textAlign: 'right', textTransform: 'lowercase' }}>{label}:</div>
        <input
          type="text" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)}
          style={{ ...inputS, width: 180, textAlign: 'right' }}
          onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
        <input
          type="text" value={addVal} onChange={(e) => setAddVal(e.target.value)} placeholder="+"
          style={inputS}
          onFocus={(e) => e.target.style.borderColor = '#3fb950'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
        <button
          onClick={() => { const n = parseInt(addVal); if (!isNaN(n)) { onChange(value + n); setAddVal(''); } }}
          style={{ ...btnS, color: '#3fb950' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#30363d'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#21262d'; }}
        >+</button>
        <input
          type="text" value={subVal} onChange={(e) => setSubVal(e.target.value)} placeholder="-"
          style={inputS}
          onFocus={(e) => e.target.style.borderColor = '#ff7b72'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
        <button
          onClick={() => { const n = parseInt(subVal); if (!isNaN(n)) { onChange(value - n); setSubVal(''); } }}
          style={{ ...btnS, color: '#ff7b72' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#30363d'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#21262d'; }}
        >-</button>
      </div>
    </div>
  );
}
