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
            <div className="flex items-center gap-3 mb-6 text-white">
              <img src="/logo.jpeg" alt="Kalaa Logo" className="w-14 h-14 rounded object-contain bg-white" />
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
                  <span>info@kalaa.sa</span>
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
            <ul className="space-y-3 text-sm mb-10">
              {['Mission', 'Challenge', 'Solution', 'Vision'].map(item => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-brand-300 transition-colors inline-block">{item}</a>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-bold mb-6">{lang === 'ar' ? 'الاعتمادات الرسمية' : 'Official Certifications'}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-300 transition-colors inline-block">{lang === 'ar' ? 'السجل التجاري' : 'Commercial Registration'}</a></li>
              <li><a href="#" className="hover:text-brand-300 transition-colors inline-block">{lang === 'ar' ? 'شهادة ضريبة القيمة المضافة' : 'VAT Certificate'}</a></li>
              <li><a href="#" className="hover:text-brand-300 transition-colors inline-block">{lang === 'ar' ? 'ترخيص وزارة البيئة والمياه والزراعة' : 'MEWA License'}</a></li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <ContactForm />
          </div>
        </div>

        <div className="border-t border-brand-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs opacity-80">
          <p>{t.rights}</p>
          
          <div className="flex flex-col items-center">
            <span className="mb-2 font-semibold text-brand-300">{lang === 'ar' ? 'امسح الباركود' : 'Scan to Connect'}</span>
            <img src="/qr-theme-soft-edges.png" alt="Kalaa QR Code" className="w-24 h-24 rounded-lg bg-white p-1" />
          </div>

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