import React, { useState } from 'react';
import { Zap, DollarSign, Leaf, Sliders, ArrowRight } from 'lucide-react';

export default function SavingsCalculator({ onOpenQuote }) {
  const [roofArea, setRoofArea] = useState(180); // m2
  const [tariffRate, setTariffRate] = useState(0.16); // $/kWh
  const [solarGhi, setSolarGhi] = useState(1450); // kWh/m2/yr

  // Physics Calculations
  const systemKwp = (roofArea * 0.20 * 0.75).toFixed(1); // 200W/m2 packing density
  const annualKwh = Math.round(roofArea * solarGhi * 0.21 * 0.82); // 21% module eff, 82% PR
  const annualSavings = Math.round(annualKwh * tariffRate);
  const twentyFiveYearSavings = annualSavings * 25;
  const co2Offset = ((annualKwh * 0.85) / 2204.62).toFixed(1);

  return (
    <section id="calculator" style={{ padding: '90px 0', background: '#0c111d' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Interactive Physics &amp; Financial Modeler
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#ffffff', margin: '8px 0 16px' }}>
            Solar Potential &amp; Revenue Estimator
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Adjust your usable rooftop area, local solar insolation flux, and electricity tariff rate to simulate bankable generation and ROI.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'center' }}>
          {/* Left Controls Card */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* Slider 1: Rooftop Area */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontFamily: 'monospace' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>USABLE ROOF AREA</span>
                <strong style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{roofArea} m²</strong>
              </div>
              <input
                type="range"
                min="40"
                max="1200"
                step="10"
                value={roofArea}
                onChange={(e) => setRoofArea(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
            </div>

            {/* Slider 2: Annual Solar GHI */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontFamily: 'monospace' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>SOLAR FLUX (GHI)</span>
                <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{solarGhi} kWh/m²/yr</strong>
              </div>
              <input
                type="range"
                min="900"
                max="2400"
                step="50"
                value={solarGhi}
                onChange={(e) => setSolarGhi(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </div>

            {/* Slider 3: Utility Tariff Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontFamily: 'monospace' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>UTILITY TARIFF RATE</span>
                <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>${tariffRate.toFixed(2)} /kWh</strong>
              </div>
              <input
                type="range"
                min="0.08"
                max="0.45"
                step="0.01"
                value={tariffRate}
                onChange={(e) => setTariffRate(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Right Metrics Output Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontFamily: 'monospace', fontWeight: 700 }}>
                ESTIMATED ANNUAL SOLAR REVENUE
              </span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace', margin: '4px 0' }}>
                ${annualSavings.toLocaleString()} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/year</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                25-Year Cumulative Savings: ${twentyFiveYearSavings.toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontFamily: 'monospace' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>SYSTEM CAPACITY</span>
                <strong style={{ fontSize: '1.25rem', color: '#ffffff' }}>{systemKwp} kWp</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>ANNUAL CLEAN ENERGY</span>
                <strong style={{ fontSize: '1.25rem', color: '#10b981' }}>{annualKwh.toLocaleString()} kWh</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)', gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>CARBON ABATEMENT</span>
                <strong style={{ fontSize: '1.25rem', color: '#38bdf8' }}>{co2Offset} Metric Tons CO₂ /year</strong>
              </div>
            </div>

            <button
              onClick={() => onOpenQuote({ roofArea, annualSavings, systemKwp })}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)'
              }}
            >
              <span>Download Engineering Audit Report</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
