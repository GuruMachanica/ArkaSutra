import React, { useState } from 'react';
import CalculatorSliders from './calculator/CalculatorSliders';
import CalculatorResults from './calculator/CalculatorResults';

export default function SavingsCalculator({ onOpenQuote }) {
  const [roofArea, setRoofArea] = useState(180);
  const [tariffRate, setTariffRate] = useState(0.16);
  const [solarGhi, setSolarGhi] = useState(1450);

  const systemKwp = (roofArea * 0.20 * 0.75).toFixed(1);
  const annualKwh = Math.round(roofArea * solarGhi * 0.21 * 0.82);
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
          <CalculatorSliders
            roofArea={roofArea} setRoofArea={setRoofArea}
            solarGhi={solarGhi} setSolarGhi={setSolarGhi}
            tariffRate={tariffRate} setTariffRate={setTariffRate}
          />
          <CalculatorResults
            systemKwp={systemKwp} annualKwh={annualKwh} annualSavings={annualSavings}
            twentyFiveYearSavings={twentyFiveYearSavings} co2Offset={co2Offset}
            onOpenQuote={onOpenQuote} roofArea={roofArea} tariffRate={tariffRate}
          />
        </div>
      </div>
    </section>
  );
}
