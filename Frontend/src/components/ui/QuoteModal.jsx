import React, { useState } from 'react';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';
import QuoteForm from './quote/QuoteForm';
import QuoteSuccess from './quote/QuoteSuccess';

export default function QuoteModal({ isOpen, onClose, initialData = {} }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
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
      particleCount: 100, spread: 70, origin: { y: 0.5 },
      colors: ['#f59e0b', '#38bdf8', '#10b981', '#ffffff']
    });
  };

  const calculated7YearSavings = Math.round(Number(formData.monthlyBill || 280) * 12 * 7 * 0.95);

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000,
        background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          background: 'rgba(15, 23, 42, 0.96)', border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '28px', padding: '36px', maxWidth: '540px', width: '100%',
          position: 'relative', boxShadow: '0 25px 70px rgba(0,0,0,0.75)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '18px', right: '18px',
            background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#94a3b8',
            width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {!submitted ? (
          <QuoteForm
            formData={formData} setFormData={setFormData}
            onSubmit={handleSubmit} calculated7YearSavings={calculated7YearSavings}
          />
        ) : (
          <QuoteSuccess formData={formData} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
