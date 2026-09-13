import React from 'react';
import { Zap, DollarSign, Leaf, ArrowRight } from 'lucide-react';

export default function CalculatorResults({ systemKwp, annualKwh, annualSavings, twentyFiveYearSavings, co2Offset, onOpenQuote, roofArea, tariffRate }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '24px', padding: '32px',
      display: 'flex', flexDirection: 'column', gap: '20px'
    }}>
      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
        <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#f59e0b', textTransform: 'uppercase', fontWeight: 700 }}>
          25-YEAR LIFECYCLE ROI
        </span>
        <div style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace' }}>
          ${twentyFiveYearSavings.toLocaleString()}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Zap size={13} color="#f59e0b" /> PV Capacity
          </span>
          <strong style={{ fontSize: '1.2rem', color: '#ffffff', fontFamily: 'monospace' }}>{systemKwp} kWp</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <DollarSign size={13} color="#10b981" /> Annual Savings
          </span>
          <strong style={{ fontSize: '1.2rem', color: '#10b981', fontFamily: 'monospace' }}>${annualSavings.toLocaleString()}</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Leaf size={13} color="#10b981" /> CO₂ Abatement
          </span>
          <strong style={{ fontSize: '1.2rem', color: '#ffffff', fontFamily: 'monospace' }}>{co2Offset} T/yr</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Annual Yield</span>
          <strong style={{ fontSize: '1.2rem', color: '#38bdf8', fontFamily: 'monospace' }}>{annualKwh.toLocaleString()} kWh</strong>
        </div>
      </div>

      <button
        onClick={() => onOpenQuote({ monthlyBill: Math.round(annualSavings / 12), roofArea, tariffRate })}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: '#f59e0b', color: '#000000', border: 'none', padding: '14px',
          borderRadius: '14px', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer'
        }}
      >
        <span>Lock In Your Savings Proposal</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
