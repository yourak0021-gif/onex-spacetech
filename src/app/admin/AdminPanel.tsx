'use client';

import { useState } from 'react';
import type { SiteContent } from '@/types/content';

type Tab = 'stats' | 'project' | 'social' | 'contact';

export default function AdminPanel({ initialContent, initialAuthed }: { initialContent: SiteContent | null; initialAuthed: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthed);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [content, setContent] = useState<SiteContent | null>(initialContent);
  const [activeTab, setActiveTab] = useState<Tab>('stats');

  const doFetchContent = async () => {
    const res = await fetch('/api/content');
    if (res.ok) setContent(await res.json());
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
      if (res.ok) { await doFetchContent(); setAuthenticated(true); }
      else { let m = 'Invalid password'; try { const d = await res.json(); m = d.error || m; } catch {} setError(m); }
    } catch { setError('Connection error'); }
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
      if (res.ok) { const d = await res.json(); setContent(d); setSaveMsg('saved'); }
      else if (res.status === 401) { setAuthenticated(false); setContent(null); setSaveMsg('session expired'); }
      else { setSaveMsg('save failed'); }
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

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
        <div style={{ width: 400, padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ color: '#58a6ff', fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>ADMIN LOGIN</div>
            <div style={{ color: '#8b949e', fontSize: 11 }}>OneX SpaceTechnologies</div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#8b949e', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                autoFocus
                style={{ width: '100%', padding: '8px 12px', background: '#161b22', border: '1px solid #30363d', color: '#e6edf3', fontSize: 13, outline: 'none', fontFamily: 'monospace' }}
                onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
            </div>
            {error && <div style={{ color: '#ff7b72', fontSize: 12, marginBottom: 12 }}>{error}</div>}
            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '8px 0', background: '#21262d', border: '1px solid #30363d', color: '#e6edf3', fontSize: 12, cursor: 'pointer', fontFamily: 'monospace' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#30363d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#21262d'; }}
            >
              {loading ? 'verifying...' : '[ UNLOCK ]'}
            </button>
          </form>
          <div style={{ color: '#484f58', fontSize: 10, textAlign: 'center', marginTop: 24 }}>---</div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', color: '#8b949e', fontSize: 12 }}>
        loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', fontFamily: 'monospace', color: '#e6edf3', fontSize: 12 }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #21262d', color: '#58a6ff', fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
          ADMIN PANEL
        </div>
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {(['stats', 'project', 'social', 'contact'] as Tab[]).map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px',
                cursor: 'pointer',
                background: activeTab === tab ? '#161b22' : 'transparent',
                color: activeTab === tab ? '#58a6ff' : '#8b949e',
                fontSize: 12,
              }}
              onMouseEnter={(e) => { if (activeTab !== tab) e.currentTarget.style.background = '#161b22'; }}
              onMouseLeave={(e) => { if (activeTab !== tab) e.currentTarget.style.background = 'transparent'; }}
            >
              {activeTab === tab ? '> ' : '  '}{tab}
            </div>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid #21262d', padding: '8px 0' }}>
          <div
            onClick={handleLogout}
            style={{ padding: '8px 20px', cursor: 'pointer', color: '#484f58', fontSize: 12 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ff7b72'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#484f58'; }}
          >
            logout
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: '#8b949e', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
            {activeTab === 'stats' ? 'Our Impact / Stats' :
             activeTab === 'project' ? 'Project Ecosystem Value' :
             activeTab === 'social' ? 'Social Media' :
             'Contact Info'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {saveMsg && <span style={{ color: '#3fb950', fontSize: 11 }}>{saveMsg}</span>}
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
        <div style={{ padding: 24, overflow: 'auto' }}>
          {activeTab === 'stats' && (
            <div>
              <div style={{ marginBottom: 20, color: '#8b949e', fontSize: 11 }}>Edit the numbers shown in the "Our Impact" section.</div>
              <NumberField label="members" value={content.stats.members} onChange={(v) => updateField('stats.members', v)} />
              <NumberField label="services" value={content.stats.services} onChange={(v) => updateField('stats.services', v)} />
              <NumberField label="projects" value={content.stats.projects} onChange={(v) => updateField('stats.projects', v)} />
              <NumberField label="events" value={content.stats.events} onChange={(v) => updateField('stats.events', v)} />
            </div>
          )}

          {activeTab === 'project' && (
            <div>
              <div style={{ marginBottom: 20, color: '#8b949e', fontSize: 11 }}>Edit the Project Ecosystem Value counter. Auto-increment adds 10k–10M every 1-2 hours.</div>
              <Field label="title" value={content.projectInfo.title} onChange={(v) => updateField('projectInfo.title', v)} />
              <Field label="description" value={content.projectInfo.description} onChange={(v) => updateField('projectInfo.description', v)} />
              <NumberField label="value" value={content.projectInfo.value} onChange={(v) => updateField('projectInfo.value', v)} />
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <div style={{ marginBottom: 20, color: '#8b949e', fontSize: 11 }}>Social media URLs. Leave empty to hide that platform from the site.</div>
              <Field label="discord" value={content.socialLinks.discord} onChange={(v) => updateField('socialLinks.discord', v)} />
              <Field label="youtube" value={content.socialLinks.youtube} onChange={(v) => updateField('socialLinks.youtube', v)} />
              <Field label="github" value={content.socialLinks.github} onChange={(v) => updateField('socialLinks.github', v)} />
              <Field label="twitter" value={content.socialLinks.twitter} onChange={(v) => updateField('socialLinks.twitter', v)} />
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <div style={{ marginBottom: 20, color: '#8b949e', fontSize: 11 }}>Contact information shown on the /connect page.</div>
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
        style={{ flex: 1, padding: '6px 10px', background: '#161b22', border: '1px solid #30363d', color: '#e6edf3', fontSize: 12, outline: 'none', fontFamily: 'monospace' }}
        onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
        onBlur={(e) => e.target.style.borderColor = '#30363d'}
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [addVal, setAddVal] = useState('');
  const [subVal, setSubVal] = useState('');

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 80, flexShrink: 0, color: '#8b949e', fontSize: 11, textAlign: 'right', textTransform: 'lowercase' }}>{label}:</div>
        <input
          type="text" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)}
          style={{ width: 180, padding: '6px 10px', background: '#161b22', border: '1px solid #30363d', color: '#e6edf3', fontSize: 12, outline: 'none', fontFamily: 'monospace', textAlign: 'right' }}
          onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
        <input
          type="text" value={addVal} onChange={(e) => setAddVal(e.target.value)}
          placeholder="+"
          style={{ width: 60, padding: '6px 8px', background: '#161b22', border: '1px solid #30363d', color: '#e6edf3', fontSize: 12, outline: 'none', fontFamily: 'monospace' }}
          onFocus={(e) => e.target.style.borderColor = '#3fb950'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
        <button
          onClick={() => { const n = parseInt(addVal); if (!isNaN(n)) { onChange(value + n); setAddVal(''); } }}
          style={{ padding: '6px 10px', background: '#21262d', border: '1px solid #30363d', color: '#3fb950', cursor: 'pointer', fontSize: 12, fontFamily: 'monospace' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#30363d'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#21262d'; }}
        >+</button>
        <input
          type="text" value={subVal} onChange={(e) => setSubVal(e.target.value)}
          placeholder="-"
          style={{ width: 60, padding: '6px 8px', background: '#161b22', border: '1px solid #30363d', color: '#e6edf3', fontSize: 12, outline: 'none', fontFamily: 'monospace' }}
          onFocus={(e) => e.target.style.borderColor = '#ff7b72'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
        <button
          onClick={() => { const n = parseInt(subVal); if (!isNaN(n)) { onChange(value - n); setSubVal(''); } }}
          style={{ padding: '6px 10px', background: '#21262d', border: '1px solid #30363d', color: '#ff7b72', cursor: 'pointer', fontSize: 12, fontFamily: 'monospace' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#30363d'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#21262d'; }}
        >-</button>
      </div>
    </div>
  );
}
