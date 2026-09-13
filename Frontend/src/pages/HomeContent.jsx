import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import MetricsStrip from '../components/sections/MetricsStrip';
import HowItWorks from '../components/sections/HowItWorks';
import SavingsCalculator from '../components/sections/SavingsCalculator';
import TechGrid from '../components/sections/TechGrid';
import Testimonials from '../components/sections/Testimonials';
import FinalCta from '../components/sections/FinalCta';
import Footer from '../components/sections/Footer';

export default function HomeContent({ handleLaunchStudio, handleOpenQuote, setActiveTab, onOpenReport }) {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <HeroSection onLaunchStudio={() => handleLaunchStudio('residential')} onOpenQuote={handleOpenQuote} />
      <MetricsStrip />
      <HowItWorks />
      <SavingsCalculator onOpenQuote={handleOpenQuote} />
      <TechGrid />
      <Testimonials />
      <FinalCta onOpenQuote={handleOpenQuote} onLaunchStudio={handleLaunchStudio} />
      <Footer setActiveTab={setActiveTab} onOpenReport={onOpenReport} />
    </main>
  );
}
