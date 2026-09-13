import React, { useState, useEffect } from 'react';
import NavBrand from './navbar/NavBrand';
import NavLinks from './navbar/NavLinks';
import NavActions from './navbar/NavActions';

export default function Navbar({ activeTab, setActiveTab }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => setTimeStr(new Date().toTimeString().split(' ')[0] + ' UTC');
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateHome = () => {
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '76px', maxWidth: '1280px', margin: '0 auto', padding: '0 24px'
        }}
      >
        <NavBrand onNavigateHome={handleNavigateHome} />
        <NavLinks scrollToSection={scrollToSection} />
        <NavActions activeTab={activeTab} setActiveTab={setActiveTab} timeStr={timeStr} />
      </div>
    </header>
  );
}
