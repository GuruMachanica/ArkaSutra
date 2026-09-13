import React from 'react';
import { Sun, CheckCircle, Shield, Award } from 'lucide-react';

export default function MetricsStrip() {
  const metrics = [
    {
      icon: Sun,
      color: '#f59e0b',
      value: '98.4%',
      label: 'POA Irradiance Accuracy',
      desc: 'NREL PVLib Benchmarked'
    },
    {
      icon: CheckCircle,
      color: '#10b981',
      value: 'CityGML LOD2',
      label: 'Vector Facet Normal Extraction',
      desc: 'Sub-Degree Azimuth & Pitch'
    },
    {
      icon: Shield,
      color: '#38bdf8',
      value: '60 FPS WebGL',
      label: 'Ray-Traced Shadow Occlusion',
      desc: 'Real-Time Hardware Raycasting'
    },
    {
      icon: Award,
      color: '#8b5cf6',
      value: '8,760 Vectors',
      label: 'Hourly Diurnal Solar Tracking',
      desc: 'Annual Simulation Engine'
    }
  ];

  return (
    <section
      style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '36px 0'
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}
      >
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: `${m.color}15`,
                  border: `1px solid ${m.color}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={22} color={m.color} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.1,
                    fontFamily: 'monospace'
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#e2e8f0',
                    marginTop: '2px'
                  }}
                >
                  {m.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {m.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
