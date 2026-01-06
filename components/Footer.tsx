import React from 'react';
import { Mail, MapPin, Sprout } from 'lucide-react';
import { Language } from '../types';
import { content } from '../constants';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = content[lang].footer;

  return (
    <footer id="contact" className="bg-brand-900 text-brand-100 pt-16 pb-8 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="bg-brand-500 p-1.5 rounded">
                 <Sprout className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl">Kalaa</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed opacity-80">
              {t.desc}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{t.links}</h4>
            <ul className="space-y-3 text-sm">
              {['Mission', 'Solution', 'Vision'].map(item => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-brand-300 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{t.contact}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>info@kalaafeed.sa</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>Jeddah, Saudi Arabia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-800 pt-8 text-center text-xs opacity-60">
          {t.rights}
        </div>
      </div>
    </footer>
  );
};

export default Footer;