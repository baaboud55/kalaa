import React, { useState } from 'react';
import { Leaf, Coins, Zap } from 'lucide-react';
import { Language } from '../types';
import { content } from '../constants';

interface ImpactSectionProps {
  lang: Language;
}

const ImpactSection: React.FC<ImpactSectionProps> = ({ lang }) => {
  const t = content[lang].impact;
  const isRTL = lang === 'ar';
  
  // State for the simulation slider
  const [wasteProcessed, setWasteProcessed] = useState(100);

  // Constants for calculation
  // 1.9 tons CO2e per ton of food waste diverted (EPA Estimate / General organic waste average)
  const CO2_FACTOR = 1.9;
  
  // Savings Calculation:
  // Assuming 1 ton of industrial bakery waste (low moisture) produces approx 0.8 tons of feed.
  // Market price of imported feed (Barley/Alfalfa) ~1500 SAR/ton.
  // Kalaa Savings (~40%) = 600 SAR/ton of feed.
  // Savings per ton of waste = 0.8 * 600 = 480 SAR. 
  // We use 450 SAR to be conservative and match the visual reference.
  const SAVINGS_FACTOR = 450;

  const co2Saved = Math.round(wasteProcessed * CO2_FACTOR);
  const farmerSavings = Math.round(wasteProcessed * SAVINGS_FACTOR);

  // Number formatter
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US').format(num);
  };

  return (
    <section id="impact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.title}</h2>
          <p className="text-lg text-slate-600">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="grid lg:grid-cols-5 h-full">
            
            {/* Left/Top: The Controls */}
            <div className="lg:col-span-2 p-8 md:p-12 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center">
              <div className="mb-8">
                <span className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-2 block">
                  Impact Simulator
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t.simulator.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.simulator.subtitle}
                </p>
              </div>

              <div className="mb-8">
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
                    className={`w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${isRTL ? 'rtl-slider' : ''}`}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400 font-mono">
                  <span>10</span>
                  <span className="font-bold text-brand-600 text-lg">{formatNumber(wasteProcessed)}</span>
                  <span>1000</span>
                </div>
              </div>
            </div>

            {/* Right/Bottom: The Results */}
            <div className="lg:col-span-3 p-8 md:p-12 bg-white flex flex-col justify-center">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                
                {/* CO2 Card */}
                <div className="p-6 rounded-2xl bg-brand-50 border border-brand-100 flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-bold text-brand-700">{t.simulator.co2_label}</span>
                    <Leaf className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <span className="text-4xl md:text-5xl font-bold text-brand-900 block mb-1">
                      {formatNumber(co2Saved)}
                    </span>
                    <span className="text-sm text-brand-600 font-medium uppercase tracking-wider">
                      {t.simulator.co2_unit}
                    </span>
                  </div>
                </div>

                {/* Savings Card */}
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:shadow-md">
                   <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-bold text-amber-800">{t.simulator.savings_label}</span>
                    <Coins className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-4xl md:text-5xl font-bold text-amber-900 block mb-1">
                      {formatNumber(farmerSavings)}
                    </span>
                    <span className="text-sm text-amber-700 font-medium uppercase tracking-wider">
                      {t.simulator.savings_unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-400 italic">
                <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{t.simulator.disclaimer}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #059669;
          margin-top: -10px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
          box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.2);
          transition: box-shadow 0.2s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 6px rgba(5, 150, 105, 0.3);
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