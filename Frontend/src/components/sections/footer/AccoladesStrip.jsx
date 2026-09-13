import React from 'react';
import { Award, ShieldCheck, CheckCircle } from 'lucide-react';

export default function AccoladesStrip() {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
      gap: '16px', paddingBottom: '28px', marginBottom: '32px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
        <Award size={18} /> CodeStorm’25 Hackathon Winner Project
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
        <ShieldCheck size={18} /> CityGML LOD2 Geometry Extraction Engine
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
        <CheckCircle size={18} /> NREL PVLib Irradiance Physics Benchmarked
      </div>
    </div>
  );
}
