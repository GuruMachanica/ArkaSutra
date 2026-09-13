import React from 'react';
import { Box } from 'lucide-react';

export default function NavActions({ activeTab, setActiveTab, timeStr }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '6px 12px', background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px',
        fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
        <span>{timeStr || 'LIVE UTC'}</span>
      </div>

      <button
        onClick={() => setActiveTab(activeTab === 'studio' ? 'home' : 'studio')}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: activeTab === 'studio' ? '#ffffff' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: activeTab === 'studio' ? '#0f172a' : '#ffffff',
          border: 'none', padding: '9px 18px', borderRadius: '12px',
          fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
          boxShadow: activeTab === 'studio' ? 'none' : '0 4px 15px rgba(245, 158, 11, 0.35)'
        }}
      >
        <Box size={16} />
        <span>{activeTab === 'studio' ? 'Exit Studio' : '3D Studio'}</span>
      </button>
    </div>
  );
}
