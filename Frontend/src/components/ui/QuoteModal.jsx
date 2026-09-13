import React, { useState } from 'react';
import { X, CheckCircle, Sun, ShieldCheck, ArrowRight, Zap, MapPin } from 'lucide-react';
import Button from './Button';
import confetti from 'canvas-confetti';

export default function QuoteModal({ isOpen, onClose, initialData = {} }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: initialData.address || '',
    postcode: initialData.postcode || '2000',
    monthlyBill: initialData.monthlyBill || 280,
    roofType: 'pitched'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#38bdf8', '#10b981', '#ffffff']
    });
  };

  const calculated7YearSavings = Math.round(Number(formData.monthlyBill || 280) * 12 * 7 * 0.95);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '28px',
          padding: '40px',
          maxWidth: '540px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.75), 0 0 50px rgba(245, 158, 11, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '22px',
            right: '22px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#94a3b8',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ background: '#f59e0b', color: '#fff', borderRadius: '10px', padding: '8px', display: 'flex' }}>
                <Sun size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.45rem', color: '#fff', fontWeight: 800 }}>
                  Get Your $0 Bill Proposal
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                  ● 7-Year Fixed Guarantee Assessment
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '14px 0 24px', lineHeight: 1.5 }}>
              Enter your property info to lock in guaranteed $0 electricity bills for the next 7 years.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+61 400 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Property Address</label>
                  <input
                    type="text"
                    required
                    placeholder="42 Solar Avenue"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Postcode</label>
                  <input
                    type="text"
                    required
                    placeholder="2000"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Current Monthly Bill ($)</label>
                  <input
                    type="number"
                    min="50"
                    max="1500"
                    required
                    value={formData.monthlyBill}
                    onChange={(e) => setFormData({ ...formData, monthlyBill: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Roof Geometry</label>
                  <select
                    value={formData.roofType}
                    onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="pitched" style={{ background: '#0f172a' }}>Pitched Roof</option>
                    <option value="flat" style={{ background: '#0f172a' }}>Flat Roof</option>
                    <option value="tile" style={{ background: '#0f172a' }}>Tile / Terracotta</option>
                  </select>
                </div>
              </div>

              {/* Estimated Savings Preview */}
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>7-Year Guaranteed Savings</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                  ${calculated7YearSavings.toLocaleString()}
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                icon={ArrowRight}
                style={{ padding: '15px' }}
              >
                Generate Guaranteed Proposal
              </Button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle size={38} />
            </div>
            <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '8px', fontWeight: 800 }}>
              Proposal Generated!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
              We have locked in your 7-year $0 bill calculation of <strong style={{ color: '#10b981' }}>${calculated7YearSavings.toLocaleString()}</strong> and sent full engineering specifications to <strong style={{ color: '#fff' }}>{formData.email}</strong>.
            </p>
            <Button variant="secondary" size="md" onClick={onClose}>
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  color: '#cbd5e1',
  marginBottom: '6px',
  fontWeight: 600
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'inherit'
};
