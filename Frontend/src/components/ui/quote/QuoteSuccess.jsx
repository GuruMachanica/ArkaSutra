import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import Button from '../Button';

export default function QuoteSuccess({ formData, onClose }) {
  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <CheckCircle size={36} />
      </div>

      <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 800, marginBottom: '8px' }}>
        Proposal Dispatched!
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
        We have generated a custom CityGML LOD2 solar analysis for <strong>{formData.address || 'your property'}</strong>.
        Our clean energy engineer will reach out at <strong>{formData.email}</strong> within 1 business hour.
      </p>

      <div style={{
        background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <ShieldCheck size={28} color="#10b981" />
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
            Ironlogic Bankable Guarantee Applied
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Tier-1 Monocrystalline Modules + 25-Year Linear Power Output Warranty.
          </div>
        </div>
      </div>

      <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
        Done & Return to ArkaSutra
      </Button>
    </div>
  );
}
