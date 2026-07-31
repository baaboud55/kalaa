import React, { useState, useRef } from 'react';
import { Scan, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../constants';

const images = [
  '/phase-1.jpg',
  '/phase-2.jpg',
  '/phase-3.jpg',
  '/phase-4.jpg',
  '/phase-5.jpg',
  '/phase-6.jpg'
];

const SolutionSection: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const t = content[lang].solution;
  const [activeStep, setActiveStep] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const yCircle1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yCircle2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section ref={ref} id="solution" className="py-24 bg-brand-900 text-white relative overflow-hidden">
      {/* Decorative Circles */}
      <motion.div 
        style={{ y: yCircle1 }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none"
      ></motion.div>
      <motion.div 
        style={{ y: yCircle2 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3 pointer-events-none"
      ></motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-brand-300 font-bold tracking-widest uppercase text-sm mb-2 block">{t.label}</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-normal md:leading-tight">{t.title}</h2>
          <p className="text-brand-100 text-lg leading-relaxed">
            {t.desc}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Process Navigation (Tabs) */}
          <div className="lg:col-span-5 space-y-3 relative">
            <h3 className="text-2xl font-bold mb-6">{t.process_title}</h3>
            
            <div className="space-y-4">
              {t.steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-start p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                      isActive 
                        ? 'bg-brand-500/20 border-brand-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-brand-500/10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex items-start gap-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-bold transition-colors ${
                        isActive ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-lg mb-1 transition-colors ${isActive ? 'text-brand-300' : 'text-white'}`}>
                          {step.title}
                        </h4>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-brand-100/90 leading-relaxed pt-2">
                                {step.desc}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Display */}
          <div className="lg:col-span-7 relative sticky top-32">
            <div className="aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl relative group">
              
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={images[activeStep]}
                  alt={t.steps[activeStep].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/20 to-transparent pointer-events-none" />

              {/* Image Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between z-10 pointer-events-none">
                <div className="max-w-xl">
                  <motion.div
                    key={`caption-${activeStep}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-500/30 border border-brand-400/50 text-brand-300 text-xs font-bold mb-3 backdrop-blur-md">
                      {isRTL ? `المرحلة 0${activeStep + 1}` : `Phase 0${activeStep + 1}`}
                    </span>
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                      {t.steps[activeStep].title}
                    </h3>
                  </motion.div>
                </div>
              </div>

              {/* Manual Nav Controls (Mobile overlay style) */}
              <button 
                onClick={() => setActiveStep(prev => prev > 0 ? prev - 1 : 5)}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all z-20 md:opacity-0 group-hover:opacity-100`}
              >
                {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
              </button>
              
              <button 
                onClick={() => setActiveStep(prev => prev < 5 ? prev + 1 : 0)}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all z-20 md:opacity-0 group-hover:opacity-100`}
              >
                {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </button>
            </div>
            
            {/* AI Callout Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 bg-brand-800/50 backdrop-blur-md rounded-2xl p-6 border border-brand-500/20 shadow-lg flex gap-5 items-center"
            >
              <div className="shrink-0 w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1 text-white">{t.ai_title}</h4>
                <p className="text-sm text-brand-100 opacity-90">{t.ai_desc}</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;