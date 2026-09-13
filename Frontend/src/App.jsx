import React, { useState } from 'react';
import Navbar from './components/sections/Navbar';
import HomeContent from './pages/HomeContent';
import StudioPage from './pages/StudioPage';
import QuoteModal from './components/ui/QuoteModal';
import ReportModal from './components/studio/ReportModal';
import { useSolarSimulation } from './hooks/useSolarSimulation';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteData, setQuoteData] = useState({});
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const solar = useSolarSimulation();

  const handleOpenQuote = (data = {}) => {
    setQuoteData(data);
    setQuoteModalOpen(true);
  };

  const handleLaunchStudio = (preset = 'commercial') => {
    solar.setScenePreset(preset);
    setActiveTab('studio');
  };

  return (
    <div className="app-root" style={{ minHeight: '100vh', position: 'relative', background: '#090d16', color: '#f8fafc' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'home' ? (
        <HomeContent
          handleLaunchStudio={handleLaunchStudio}
          handleOpenQuote={handleOpenQuote}
          setActiveTab={setActiveTab}
          onOpenReport={() => setReportModalOpen(true)}
        />
      ) : (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
          <StudioPage
            {...solar}
            onBackToHome={() => setActiveTab('home')}
          />
        </div>
      )}

      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} initialData={quoteData} />
      <ReportModal
        isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)}
        stats={solar.meshStats} elevation={solar.elevation} azimuth={solar.azimuth} scenePreset={solar.scenePreset}
      />
    </div>
  );
}
