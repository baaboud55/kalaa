import React, { useState } from 'react';
import { Leaf, Coins, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../constants';

const ImpactSection: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const t = content[lang].impact;
  
  const [wasteProcessed, setWasteProcessed] = useState(100);

  const CO2_FACTOR = 1.9;
  const SAVINGS_FACTOR = 450;

  const co2Saved = Math.round(wasteProcessed * CO2_FACTOR);
  const farmerSavings = Math.round(wasteProcessed * SAVINGS_FACTOR);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US').format(num);
  };

  return (
    <section id="impact" className="py-24 bg-brand-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.title}</h2>
          <p className="text-lg text-slate-600">{t.subtitle}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden hover:shadow-3xl transition-shadow"
        >
          <div className="grid lg:grid-cols-5 h-full">
            
            {/* Left/Top: The Controls */}
            <div className="lg:col-span-2 p-8 md:p-12 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-200 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
              <div className="mb-8 relative z-10">
                <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-2 block">
                  Impact Simulator
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t.simulator.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.simulator.subtitle}
                </p>
              </div>

              <div className="mb-8 relative z-10">
                <label htmlFor="waste-slider" className="block text-sm font-bold text-slate-700 mb-4">
                  {t.simulator.input_label}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    id="waste-slider"
                    min="10"
                    max="1000"
                    step="10"
                    value={wasteProcessed}
                    onChange={(e) => setWasteProcessed(Number(e.target.value))}
                    className={`w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all ${isRTL ? 'rtl-slider' : ''}`}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400 font-mono">
                  <span>10</span>
                  <motion.span 
                    key={wasteProcessed}
                    initial={{ scale: 1.2, color: '#10b981' }}
                    animate={{ scale: 1, color: '#059669' }}
                    className="font-bold text-lg"
                  >
                    {formatNumber(wasteProcessed)}
                  </motion.span>
                  <span>1000</span>
                </div>
              </div>
            </div>

            {/* Right/Bottom: The Results */}
            <div className="lg:col-span-3 p-8 md:p-12 bg-white flex flex-col justify-center">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                
                {/* CO2 Card */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100 flex flex-col justify-between min-h-[160px] shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-bold text-brand-700">{t.simulator.co2_label}</span>
                    <Leaf className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <motion.span 
                      key={co2Saved}
                      initial={{ y: 5, opacity: 0.5 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-4xl md:text-5xl font-bold text-brand-900 block mb-1"
                    >
                      {formatNumber(co2Saved)}
                    </motion.span>
                    <span className="text-sm text-brand-600 font-medium uppercase tracking-wider">
                      {t.simulator.co2_unit}
                    </span>
                  </div>
                </motion.div>

                {/* Savings Card */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 flex flex-col justify-between min-h-[160px] shadow-sm hover:shadow-md transition-all"
                >
                   <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-bold text-amber-800">{t.simulator.savings_label}</span>
                    <Coins className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <motion.span 
                      key={farmerSavings}
                      initial={{ y: 5, opacity: 0.5 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-4xl md:text-5xl font-bold text-amber-900 block mb-1"
                    >
                      {formatNumber(farmerSavings)}
                    </motion.span>
                    <span className="text-sm text-amber-700 font-medium uppercase tracking-wider">
                      {t.simulator.savings_unit}
                    </span>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-400 italic">
                <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{t.simulator.disclaimer}</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
      
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #059669;
          margin-top: -10px;
          box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.2);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 8px rgba(5, 150, 105, 0.3);
          transform: scale(1.1);
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: #e2e8f0;
          border-radius: 2px;
        }
      `}</style>
    </section>
  );
};

export default ImpactSection;