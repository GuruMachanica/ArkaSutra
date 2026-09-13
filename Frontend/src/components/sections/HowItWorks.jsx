import React from 'react';
import { Layers, Box, Sun, FileCheck, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: Layers,
      title: 'LOD2 Geometry Extraction',
      description: 'Parses 3D CityGML polygon boundaries, surface normals [nx, ny, nz], rooftop area, and pitch angles with sub-degree vector accuracy.'
    },
    {
      num: '02',
      icon: Box,
      title: 'Ray-Traced Shadow Occlusion',
      description: 'Calculates real-time solar ray obstruction from adjacent skyscrapers, trees, and rooftop HVAC units across all 8,760 hourly celestial vectors.'
    },
    {
      num: '03',
      icon: Sun,
      title: 'Perez Irradiance Transposition',
      description: 'Splits direct normal (DNI), diffuse (DHI), and ground albedo flux on each tilted PV facet using NREL-benchmarked transposition physics.'
    },
    {
      num: '04',
      icon: FileCheck,
      title: 'Bankable Yield & ROI Audit',
      description: 'Computes annual clean kWh generation, 25-year financial cash flow, utility tariff offsets, and carbon abatement metrics.'
    }
  ];

  return (
    <section id="how-it-works" style={{ padding: '90px 0', background: '#090d16' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              color: '#f59e0b',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          >
            Spatial Simulation Pipeline
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 800,
              color: '#ffffff',
              margin: '8px 0 16px'
            }}
          >
            How the 3D Solar Engine Works
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>
            A four-stage computational spatial pipeline converting raw GIS building models into high-precision solar yield forecasts.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}
        >
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '30px 24px',
                  position: 'relative',
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
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={22} color="#f59e0b" />
                  </div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.15)', fontFamily: 'monospace' }}>
                    {s.num}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
