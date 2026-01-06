import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import ImpactSection from './components/ImpactSection';
import VisionSection from './components/VisionSection';
import Footer from './components/Footer';
import { Language } from './types';

function App() {
  const [lang, setLang] = useState<Language>('en');

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen bg-brand-sand-50 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Navbar lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <ProblemSection lang={lang} />
      <SolutionSection lang={lang} />
      <ImpactSection lang={lang} />
      <VisionSection lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}

export default App;