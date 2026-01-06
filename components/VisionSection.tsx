import React from 'react';
import { ShieldCheck, Leaf, Coins, Factory } from 'lucide-react';
import { Language } from '../types';
import { content } from '../constants';

interface VisionSectionProps {
  lang: Language;
}

const VisionSection: React.FC<VisionSectionProps> = ({ lang }) => {
  const t = content[lang].vision;

  return (
    <section id="vision" className="py-24 bg-brand-sand-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(5,150,105,0.2),transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center mb-16">
            {/* Vision Logo */}
             <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 border-[6px] border-brand-200 rounded-full"></div>
                <div className="absolute inset-0 border-t-[6px] border-brand-600 rounded-full animate-spin" style={{animationDuration: '4s'}}></div>
                <div className="absolute inset-3 border-[3px] border-slate-200/50 rounded-full"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-brand-900 tracking-tighter">2030</span>
                </div>
             </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{t.title}</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t.desc}
            </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
            
            {/* Pillar 1: Security */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand-200 transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.pillars.security.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    {t.pillars.security.desc}
                </p>
            </div>

            {/* Pillar 2: Environment */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand-200 transition-all duration-300 group">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.pillars.environment.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    {t.pillars.environment.desc}
                </p>
            </div>

            {/* Pillar 3: Economy */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand-200 transition-all duration-300 group">
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.pillars.economy.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    {t.pillars.economy.desc}
                </p>
            </div>
        </div>

        {/* Strategic Alignment Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm text-brand-900 font-bold border border-brand-100 hover:bg-brand-50 transition-colors">
            <Factory className="w-5 h-5 text-brand-600" />
            <span className="text-sm md:text-base">{t.nidlp}</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm text-brand-900 font-bold border border-brand-100 hover:bg-brand-50 transition-colors">
            <Leaf className="w-5 h-5 text-brand-600" />
            <span className="text-sm md:text-base">{t.sgi}</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VisionSection;