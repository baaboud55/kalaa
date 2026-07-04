import React from 'react';
import { Mail, MapPin, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../constants';
import ContactForm from './ContactForm';

const Footer: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const t = content[lang].footer;

  return (
    <footer id="contact" className="bg-brand-900 text-brand-100 pt-24 pb-8 border-t border-brand-800 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 mb-16 items-start">
          
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="bg-brand-500 p-1.5 rounded">
                 <Sprout className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl">Kalaa</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed opacity-80 mb-8">
              {t.desc}
            </p>
            <div>
              <h4 className="text-white font-bold mb-4">{t.contact}</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-400" />
                  <span>baaboud55@gmail.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  <span>Riyadh, Saudi Arabia</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6">{t.links}</h4>
            <ul className="space-y-3 text-sm">
              {['Mission', 'Challenge', 'Solution', 'Vision'].map(item => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-brand-300 transition-colors inline-block">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <ContactForm />
          </div>
        </div>

        <div className="border-t border-brand-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>{t.rights}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;