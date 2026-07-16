import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import ImpactSection from './components/ImpactSection';
import VisionSection from './components/VisionSection';
import Footer from './components/Footer';
import FeedCalculator from './components/FeedCalculator';
import { Language } from './types';

import { useLanguage } from './contexts/LanguageContext';
import CustomCursor from './components/CustomCursor';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { lang, isRTL } = useLanguage();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen bg-brand-sand-50 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <CustomCursor />
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#064e3b',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '12px',
        },
      }} />
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <ProblemSection />
                <SolutionSection />
                <ImpactSection />
                <VisionSection />
              </>
            } />
            <Route path="/calculator" element={<FeedCalculator />} />
          </Routes>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;