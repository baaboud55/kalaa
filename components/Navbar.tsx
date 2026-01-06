import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Sprout } from 'lucide-react';
import { Language } from '../types';
import { content } from '../constants';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = content[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-brand-600 p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className={`font-bold text-2xl tracking-tight ${isScrolled ? 'text-brand-900' : 'text-white'}`}>
              Kalaa
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['Mission', 'Challenge', 'Solution', 'Vision'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`font-medium text-sm transition-colors hover:text-brand-500 ${isScrolled ? 'text-slate-600' : 'text-slate-100'}`}
              >
                {t[item.toLowerCase() as keyof typeof t]}
              </a>
            ))}
            
            <button 
              onClick={toggleLang}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold transition-all hover:bg-white/10 ${isScrolled ? 'border-brand-200 text-brand-700' : 'border-white/30 text-white'}`}
            >
              <Globe className="h-4 w-4" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <a 
              href="#contact" 
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-lg shadow-brand-600/20 transition transform hover:-translate-y-0.5 font-bold text-sm"
            >
              {t.partner}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className={`${isScrolled ? 'text-slate-800' : 'text-white'}`}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white absolute w-full border-b border-gray-100 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="px-4 py-6 space-y-4 flex flex-col items-center">
            {['Mission', 'Challenge', 'Solution', 'Vision'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-600 font-medium hover:text-brand-600 py-2"
                onClick={() => setIsOpen(false)}
              >
                {t[item.toLowerCase() as keyof typeof t]}
              </a>
            ))}
            <button 
              onClick={() => { toggleLang(); setIsOpen(false); }}
              className="w-full text-center px-4 py-3 text-brand-600 font-bold bg-brand-50 rounded-lg mt-2"
            >
              {lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;