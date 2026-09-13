import React from 'react';
import { Sun, ArrowRight, Zap, MapPin } from 'lucide-react';
import Button from '../Button';

export default function QuoteForm({ formData, setFormData, onSubmit, calculated7YearSavings }) {
  const inputStyle = {
    width: '100%', background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px',
    padding: '11px 14px', color: '#fff', fontSize: '0.86rem', outline: 'none'
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
        <div style={{ background: '#f59e0b', color: '#fff', borderRadius: '10px', padding: '7px', display: 'flex' }}>
          <Sun size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.35rem', color: '#fff', fontWeight: 800, margin: 0 }}>Get Your $0 Bill Proposal</h3>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>● 7-Year Fixed Guarantee Assessment</div>
        </div>
      </div>

      <div style={{
        background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.22)',
        borderRadius: '14px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.78rem', color: '#f8fafc' }}>Est. 7-Yr Guaranteed Savings:</span>
        </div>
        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>
          ${calculated7YearSavings.toLocaleString()}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Name *</label>
          <input required type="text" placeholder="Sarah Jenkins" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Work / Personal Email *</label>
          <input required type="email" placeholder="sarah@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
          <input required type="tel" placeholder="+1 (555) 019-2834" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Avg Monthly Bill ($)</label>
          <input type="number" value={formData.monthlyBill} onChange={(e) => setFormData({ ...formData, monthlyBill: e.target.value })} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Installation Address *</label>
        <div style={{ position: 'relative' }}>
          <input required type="text" placeholder="742 Evergreen Terrace, Springfield" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} style={{ ...inputStyle, paddingLeft: '34px' }} />
          <MapPin size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '13px' }} />
        </div>
      </div>

      <Button variant="primary" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }} type="submit">
        Generate My Engineering Dossier <ArrowRight size={16} />
      </Button>
    </form>
  );
}
