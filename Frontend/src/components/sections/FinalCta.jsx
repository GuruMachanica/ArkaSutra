import React from 'react';
import { Box, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FinalCta({ onLaunchStudio, onOpenQuote }) {
  return (
    <section id="final-cta" style={{ padding: '90px 0', background: '#090d16' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '28px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
          }}
        >
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Ready to Simulate Your Rooftop?
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, color: '#ffffff', margin: '10px 0 16px' }}>
            Launch Full-Scale 3D Solar Simulation
          </h2>
          <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 30px' }}>
            Explore ray-traced shadow occlusions, seasonal sun trajectories, and bankable solar feasibility across commercial, residential, and high-rise districts.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
    onClick={() => {
      const el = document.getElementById('calculator');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '14px 28px',
      borderRadius: '9999px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '1rem',
      cursor: 'pointer'
    }}
  >
    <span>Calculate ROI</span>
  </button>
          </div>
        </div>
      </div>
    </section>
  );
}
