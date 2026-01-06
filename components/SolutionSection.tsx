import React from 'react';
import { Truck, Scan, Factory, Sprout, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { content } from '../constants';

interface SolutionSectionProps {
  lang: Language;
}

const SolutionSection: React.FC<SolutionSectionProps> = ({ lang }) => {
  const t = content[lang].solution;

  const steps = [
    { icon: Truck, title: t.step1, desc: "Factory Organic Waste" },
    { icon: Scan, title: t.step2, desc: "Image Recognition & Dehydration" },
    { icon: Factory, title: t.step3, desc: "High Heat & Pellet Formation" },
    { icon: Sprout, title: t.step4, desc: "Pathogen-free Livestock Feed" },
  ];

  return (
    <section id="solution" className="py-24 bg-brand-900 text-white relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <span className="text-brand-300 font-bold tracking-widest uppercase text-sm mb-2 block">{t.label}</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{t.title}</h2>
            <p className="text-brand-100 text-lg mb-8 leading-relaxed">
              {t.desc}
            </p>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center">
                    <Scan className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">{t.ai_title}</h4>
                  <p className="text-sm text-brand-100 opacity-80">{t.ai_desc}</p>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-brand-100">
                <CheckCircle2 className="w-5 h-5 text-brand-400" />
                <span>Localized Makkah & Madinah Operations</span>
              </li>
              <li className="flex items-center gap-3 text-brand-100">
                <CheckCircle2 className="w-5 h-5 text-brand-400" />
                <span>Extrusion Technology for Shelf Stability</span>
              </li>
            </ul>
          </div>

          {/* Process Visualization */}
          <div className="relative">
            <h3 className="text-2xl font-bold mb-8 text-center lg:text-start">{t.process_title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/20 transition duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-900 group-hover:scale-110 transition-transform">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-bold text-white/10">0{index + 1}</span>
                  </div>
                  <h4 className="text-lg font-bold mb-1">{step.title}</h4>
                  <p className="text-sm text-brand-200">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SolutionSection;