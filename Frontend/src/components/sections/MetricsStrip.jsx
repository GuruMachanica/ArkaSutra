import React from 'react';
import { METRICS } from './metrics/metricsData';

export default function MetricsStrip() {
  return (
    <section style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '36px 0' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {METRICS.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `${m.color}15`, border: `1px solid ${m.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={m.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, fontFamily: 'monospace' }}>{m.value}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginTop: '2px' }}>{m.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{m.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
