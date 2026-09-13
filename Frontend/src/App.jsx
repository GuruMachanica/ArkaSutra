import React, { useState, useMemo } from 'react';
import Navbar from './components/sections/Navbar';
import HeroSection from './components/sections/HeroSection';
import MetricsStrip from './components/sections/MetricsStrip';
import HowItWorks from './components/sections/HowItWorks';
import SavingsCalculator from './components/sections/SavingsCalculator';
import TechGrid from './components/sections/TechGrid';
import Testimonials from './components/sections/Testimonials';
import FinalCta from './components/sections/FinalCta';
import Footer from './components/sections/Footer';
import QuoteModal from './components/ui/QuoteModal';

// High-precision Studio and Feasibility Modals
import StudioPage from './pages/StudioPage';
import ReportModal from './components/studio/ReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteData, setQuoteData] = useState({});
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // 3D Studio State
  const [timeOfDay, setTimeOfDay] = useState(12.0);
  const [season, setSeason] = useState('summer');
  const [scenePreset, setScenePreset] = useState('commercial');
  const [shadingMode, setShadingMode] = useState('realistic');
  const [isPlaying, setIsPlaying] = useState(false);
  const [panelTilt, setPanelTilt] = useState(25);

  const [meshStats, setMeshStats] = useState({
    totalRooftopArea: 210.0,
    panelsCount: 120
  });

  const { elevation, azimuth, baseIrradiance } = useMemo(() => {
    const maxElev = season === 'summer' ? 72 : season === 'equinox' ? 50 : 28;
    const hourDelta = timeOfDay - 12.0;
    const rawElev = Math.max(0, maxElev * Math.cos((hourDelta / 6.5) * (Math.PI / 2)));
    const rawAzim = 180 + (hourDelta / 6.5) * 85;
    const rad = (rawElev * Math.PI) / 180;
    const baseIrr = Math.round(1000 * Math.sin(rad));

    return {
      elevation: rawElev,
      azimuth: rawAzim,
      baseIrradiance: Math.max(0, baseIrr)
    };
  }, [timeOfDay, season]);

  const handleOpenQuote = (data = {}) => {
    setQuoteData(data);
    setQuoteModalOpen(true);
  };

  const handleLaunchStudio = (preset = 'commercial') => {
    setScenePreset(preset);
    setActiveTab('studio');
  };

  return (
    <div className="app-root" style={{ minHeight: '100vh', position: 'relative', background: '#090d16', color: '#f8fafc' }}>
      {/* 1. Universal Glassmorphic Header */}
      <Navbar
    activeTab={activeTab}
    setActiveTab={setActiveTab}
  />

      {activeTab === 'home' ? (
        <main style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
          {/* 2. Hero Section (Photorealistic 4-State Architectural Media + Mode Toggle) */}
          <HeroSection onLaunchStudio={() => handleLaunchStudio('residential')} onOpenQuote={handleOpenQuote} />

          {/* 3. Social Proof / Metrics Ribbon */}
          <MetricsStrip />

          {/* 4. How It Works (3-Step Interactive Process) */}
          <HowItWorks />

          {/* 5. Savings & ROI Calculator (Interactive Slider Widget) */}
          <SavingsCalculator onOpenQuote={handleOpenQuote} />

          {/* 6. Technology & Smart Controller Features (Bento Grid) */}
          <TechGrid />

          {/* 7. Case Studies / Customer Testimonials */}
          <Testimonials />

          {/* 8. Final CTA & Lead Capture */}
          <FinalCta onOpenQuote={handleOpenQuote} onLaunchStudio={handleLaunchStudio} />

          {/* 9. Footer */}
          <Footer setActiveTab={setActiveTab} onOpenReport={() => setReportModalOpen(true)} />
        </main>
      ) : (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
          <StudioPage
            timeOfDay={timeOfDay}
            setTimeOfDay={setTimeOfDay}
            season={season}
            setSeason={setSeason}
            scenePreset={scenePreset}
            setScenePreset={setScenePreset}
            shadingMode={shadingMode}
            setShadingMode={setShadingMode}
            elevation={elevation}
            azimuth={azimuth}
            baseIrradiance={baseIrradiance}
            meshStats={meshStats}
            setMeshStats={setMeshStats}
            onBackToHome={() => setActiveTab('home')}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            panelTilt={panelTilt}
            setPanelTilt={setPanelTilt}
          />
        </div>
      )}

      {/* Instant Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialData={quoteData}
      />

      {/* Engineering Feasibility Audit Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        stats={meshStats}
        elevation={elevation}
        azimuth={azimuth}
        scenePreset={scenePreset}
      />
    </div>
  );
}
