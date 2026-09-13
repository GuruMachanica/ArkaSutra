import React from 'react';
import { Zap } from 'lucide-react';

export default function HeroContent() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px',
        borderRadius: '9999px', background: 'rgba(9, 13, 22, 0.8)', border: '1px solid rgba(245, 158, 11, 0.4)',
        backdropFilter: 'blur(16px)', marginBottom: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
      }}>
        <Zap size={14} color="#f59e0b" />
        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#fbbf24', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          3D Spatial Solar Engine v2.4 + Live Satellite Feed
        </span>
      </div>

      <h1 style={{
        fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)', fontWeight: 800, lineHeight: 1.12,
        letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '16px',
        textShadow: '0 4px 25px rgba(0, 0, 0, 0.95)'
      }}>
        Precision 3D Solar Potential &amp; <br />
        <span style={{
          background: 'linear-gradient(135deg, #ffffff 30%, #f59e0b 80%, #fbbf24 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Rooftop Energy Intelligence
        </span>
      </h1>

      <p style={{
        fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', color: '#ffffff', fontWeight: 500,
        maxWidth: '820px', margin: '0 auto', lineHeight: 1.6,
        textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0,0,0,0.9)'
      }}>
        Simulate sub-degree rooftop normal vectors, real-time WebGL shadow raycasting,
        and 25-year financial feasibility across LOD2 CityGML architectural topologies.
      </p>
    </div>
  );
}
