import React from 'react';
import { ArrowRight, Leaf, Recycle, TrendingDown } from 'lucide-react';
import { Language } from '../types';
import { content } from '../constants';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = content[lang].hero;
  const isRTL = lang === 'ar';

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-900">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/id/429/1920/1080" 
          alt="Agriculture Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/90 via-brand-800/80 to-brand-900/95"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/10 text-brand-100 border border-white/10 text-sm font-semibold mb-8 backdrop-blur-sm animate-float">
          <Leaf className="w-4 h-4" />
          <span>{t.badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          {t.title_prefix}
          <span className="text-brand-300">{t.title_highlight}</span>
        </h1>

        {/* Subhead */}
        <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-100 mb-10 leading-relaxed opacity-90">
          {t.subtitle_prefix}
          <span className="font-bold text-white">{t.subtitle_highlight}</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#solution" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-900 font-bold rounded-lg shadow-lg hover:bg-emerald-50 transition transform hover:-translate-y-1 group">
            <span>{t.cta_primary}</span>
            {isRTL ? <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />}
          </a>
          <a href="#vision" className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition backdrop-blur-sm">
            {t.cta_secondary}
          </a>
        </div>
      </div>
      
      {/* Stats Strip */}
      <div className="absolute bottom-0 w-full bg-black/20 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1 text-brand-300">
              <TrendingDown className="w-5 h-5" />
              <span className="text-2xl font-bold">30-50%</span>
            </div>
            <div className="text-xs opacity-70 uppercase tracking-wider">{t.stat_cost}</div>
          </div>
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-2 mb-1 text-brand-300">
              <Leaf className="w-5 h-5" />
              <span className="text-2xl font-bold">AI</span>
            </div>
            <div className="text-xs opacity-70 uppercase tracking-wider">{t.stat_tech}</div>
          </div>
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-2 mb-1 text-brand-300">
              <Recycle className="w-5 h-5" />
              <span className="text-2xl font-bold">ZERO</span>
            </div>
            <div className="text-xs opacity-70 uppercase tracking-wider">{t.stat_waste}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;