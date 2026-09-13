import React from 'react';
import { Box, ArrowRight } from 'lucide-react';
import ModeToggle from '../../ui/ModeToggle';

export default function HeroActions({ onLaunchStudio, mode, setMode }) {
  return (
    <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onLaunchStudio('commercial')}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#000000', border: 'none', padding: '16px 36px', borderRadius: '16px',
            fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.45)'
          }}
        >
          <Box size={20} />
          <span>Launch 3D Studio</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('how-it-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(9, 13, 22, 0.85)', color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.18)', padding: '16px 28px',
            borderRadius: '16px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
            backdropFilter: 'blur(16px)'
          }}
        >
          <span>Explore Pipeline</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <ModeToggle activeMode={mode} onModeChange={setMode} />
    </div>
  );
}
