import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../constants';

const Navbar: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const location = useLocation();
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
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.jpeg" alt="Kalaa Logo" className="h-10 w-auto object-contain rounded bg-white" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['Mission', 'Challenge', 'Solution', 'Vision'].map((item) => (
              <Link 
                key={item}
                to={`/#${item.toLowerCase()}`}
                className={`relative font-medium text-sm transition-colors hover:text-brand-500 group ${isScrolled || location.pathname !== '/' ? 'text-slate-600' : 'text-slate-100'}`}
              >
                {t[item.toLowerCase() as keyof typeof t]}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
            
            <Link 
              to="/calculator"
              className={`relative font-medium text-sm transition-colors hover:text-brand-500 group ${isScrolled || location.pathname !== '/' ? 'text-slate-600' : 'text-slate-100'}`}
            >
              {t.calculator}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
            </Link>

            <button 
              onClick={toggleLang}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold transition-all hover:bg-white/10 ${isScrolled || location.pathname !== '/' ? 'border-brand-200 text-brand-700' : 'border-white/30 text-white'}`}
            >
              <Globe className="h-4 w-4" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/#contact" 
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-lg shadow-brand-600/20 transition-colors font-bold text-sm"
            >
              {t.partner}
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className={`${isScrolled || location.pathname !== '/' ? 'text-slate-800' : 'text-white'}`}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white absolute w-full border-b border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col items-center">
              {['Mission', 'Challenge', 'Solution', 'Vision'].map((item) => (
                <Link 
                  key={item}
                  to={`/#${item.toLowerCase()}`}
                  className="text-slate-600 font-medium hover:text-brand-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t[item.toLowerCase() as keyof typeof t]}
                </Link>
              ))}
              <Link 
                to="/calculator"
                className="text-slate-600 font-medium hover:text-brand-600 py-2"
                onClick={() => setIsOpen(false)}
              >
                {t.calculator}
              </Link>
              <button 
                onClick={() => { toggleLang(); setIsOpen(false); }}
                className="w-full text-center px-4 py-3 text-brand-600 font-bold bg-brand-50 rounded-lg mt-2"
              >
                {lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
