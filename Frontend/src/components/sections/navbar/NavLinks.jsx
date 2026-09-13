import React from 'react';

const LINKS = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'calculator', label: 'ROI Estimator' },
  { id: 'tech-specs', label: 'Architecture' },
  { id: 'case-studies', label: 'Case Studies' }
];

export default function NavLinks({ scrollToSection }) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
      {LINKS.map((link) => (
        <button
          key={link.id}
          onClick={() => scrollToSection(link.id)}
          style={{
            background: 'none', border: 'none', color: '#94a3b8',
            fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
}
