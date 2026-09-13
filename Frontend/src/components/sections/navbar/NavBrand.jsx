import React from 'react';
import { Sun } from 'lucide-react';

export default function NavBrand({ onNavigateHome }) {
  return (
    <button
      onClick={onNavigateHome}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'none', border: 'none', color: '#ffffff',
        fontWeight: 800, fontSize: '1.45rem', letterSpacing: '-0.03em', cursor: 'pointer'
      }}
    >
      <div style={{
        width: '38px', height: '38px', borderRadius: '10px',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
      }}>
        <Sun size={22} color="#ffffff" />
      </div>
      <span>sunmap<span style={{ color: '#f59e0b' }}>.</span></span>
    </button>
  );
}
