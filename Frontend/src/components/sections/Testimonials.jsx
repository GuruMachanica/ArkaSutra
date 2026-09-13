import React from 'react';
import { Building, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Testimonials() {
  const caseStudies = [
    {
      title: 'Delft Eco-Villa Enclave',
      location: 'Delft Zuid TU Campus, Netherlands (52.0116° N, 4.3571° E)',
      roofArea: '380 m²',
      capacity: '38.4 kWp (96 Panels)',
      annualYield: '43,200 kWh/yr',
      accuracy: '99.1% Shadow Accuracy',
      desc: 'Simulated residential gable & hip roof pitches under maritime oceanic climate. Ray-traced shadow occlusion accurately predicted morning tree obstruction.'
    },
    {
      title: 'Apex Logistics & Tech Campus',
      location: 'Frankfurt Innovation Hub, Germany (50.1109° N, 8.6821° E)',
      roofArea: '820 m²',
      capacity: '72.0 kWp (180 Panels)',
      annualYield: '86,400 kWh/yr',
      accuracy: '$13,824 Annual Utility Offset',
      desc: 'Commercial corporate HQ and logistics distribution wing with rooftop HVAC obstacles and 4 photovoltaic carport canopies.'
    },
    {
      title: 'Summit Financial Center',
      location: 'Chicago Loop District, USA (41.8781° N, -87.6298° W)',
      roofArea: '640 m²',
      capacity: '57.6 kWp (144 Panels)',
      annualYield: '76,800 kWh/yr',
      accuracy: '29.6 Tons CO₂ Abatement',
      desc: 'High-density urban skyscraper cluster modeling complex inter-building shadow casting across stepped setback roof terraces and spires.'
    }
  ];

  return (
    <section id="cases" style={{ padding: '90px 0', background: '#0c111d' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Real-World Validation Deployments
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#ffffff', margin: '8px 0 16px' }}>
            Empirical Case Studies
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Verified geospatial case studies demonstrating sub-degree shading accuracy across commercial, metropolitan, and residential topologies.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {caseStudies.map((cs, idx) => (
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
              <div>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>
                  TOPOLOGY VERIFIED
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 6px' }}>
                  {cs.title}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} color="#f59e0b" />
                  <span>{cs.location}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontFamily: 'monospace' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>CAPACITY</span>
                  <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.85rem' }}>{cs.capacity}</span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>GENERATION</span>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>{cs.annualYield}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                {cs.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
