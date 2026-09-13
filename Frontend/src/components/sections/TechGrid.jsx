import React from 'react';
import { Layers, Sun, Cpu, Globe, Sliders, ShieldCheck } from 'lucide-react';

export default function TechGrid() {
  const cards = [
    {
      icon: Layers,
      color: '#f59e0b',
      title: 'LOD2 CityGML Normal Extractor',
      desc: 'Parses complex 3D urban polygon boundaries, roof facet orientations, and coordinates directly from OGC CityGML 3.0 vector schemas.',
      badge: 'OGC Standard'
    },
    {
      icon: Sun,
      color: '#38bdf8',
      title: 'Perez Solar Transposition Physics',
      desc: 'Calculates circumsolar, isotropic sky diffuse, and ground-reflected albedo components on arbitrary tilt angles using NREL algorithms.',
      badge: 'NREL PVLib'
    },
    {
      icon: Cpu,
      color: '#10b981',
      title: 'WebGL 60 FPS Ray-Tracing',
      desc: 'Hardware-accelerated shadow raycasting rendering accurate diurnal shadow occlusions from adjacent skyscrapers and terrain.',
      badge: 'Three.js Engine'
    },
    {
      icon: Globe,
      color: '#8b5cf6',
      title: 'Astronomical Celestial Tracking',
      desc: 'Real-time solar position equations computing hourly solar elevation, azimuth, and airmass coefficients for any global coordinate.',
      badge: 'Sub-Degree Precision'
    },
    {
      icon: Sliders,
      color: '#ec4899',
      title: 'Single-Axis PV Tracker Modeler',
      desc: 'Simulates dynamic 0°–45° single-axis horizontal and tilted photovoltaic tracker arrays with active backtracking algorithms.',
      badge: 'Tracker Simulation'
    },
    {
      icon: ShieldCheck,
      color: '#14b8a6',
      title: 'Bankable Financial Modeling',
      desc: 'Generates bank-grade engineering audits, Levelized Cost of Energy (LCOE), Net Present Value (NPV), and carbon abatement reports.',
      badge: 'Bankable ROI'
    }
  ];

  return (
    <section id="tech" style={{ padding: '90px 0', background: '#090d16' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Technology &amp; Architecture
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#ffffff', margin: '8px 0 16px' }}>
            Next-Gen Spatial Solar Engineering Stack
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>
            SunMap combines advanced geospatial polygon parsing, astronomical algorithms, and real-time WebGL ray-tracing for urban solar feasibility.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px'
          }}
        >
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: `${c.color}15`,
                      border: `1px solid ${c.color}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={22} color={c.color} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'monospace',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: c.color,
                      fontWeight: 700
                    }}
                  >
                    {c.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
