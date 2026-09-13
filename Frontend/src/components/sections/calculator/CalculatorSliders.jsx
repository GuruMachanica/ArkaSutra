import React from 'react';

export default function CalculatorSliders({ roofArea, setRoofArea, solarGhi, setSolarGhi, tariffRate, setTariffRate }) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px',
      padding: '32px', display: 'flex', flexDirection: 'column', gap: '22px'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'monospace' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>USABLE ROOF AREA</span>
          <strong style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{roofArea} m²</strong>
        </div>
        <input type="range" min="40" max="1200" step="10" value={roofArea} onChange={(e) => setRoofArea(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }} />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'monospace' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>SOLAR FLUX (GHI)</span>
          <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{solarGhi} kWh/m²/yr</strong>
        </div>
        <input type="range" min="900" max="2400" step="50" value={solarGhi} onChange={(e) => setSolarGhi(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }} />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'monospace' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>UTILITY TARIFF RATE</span>
          <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>${tariffRate.toFixed(2)} /kWh</strong>
        </div>
        <input type="range" min="0.08" max="0.45" step="0.01" value={tariffRate} onChange={(e) => setTariffRate(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }} />
      </div>
    </div>
  );
}
