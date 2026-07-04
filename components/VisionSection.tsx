import React, { useRef } from 'react';
import { ShieldCheck, Leaf, Coins, Factory } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../constants';

const VisionSection: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const t = content[lang].vision;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section ref={ref} id="vision" className="py-24 bg-brand-sand-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
         <motion.div style={{ y: yBg }} className="absolute -top-1/2 left-0 w-full h-[200%] bg-[radial-gradient(circle_at_50%_50%,_rgba(5,150,105,0.2),transparent_70%)]"></motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16"
        >
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
        </motion.div>

        {/* Pillars Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
            
            {/* Pillar 1: Security */}
            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 hover:border-brand-200 transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.pillars.security.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    {t.pillars.security.desc}
                </p>
            </motion.div>

            {/* Pillar 2: Environment */}
            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 hover:border-brand-200 transition-all duration-300 group">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.pillars.environment.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    {t.pillars.environment.desc}
                </p>
            </motion.div>

            {/* Pillar 3: Economy */}
            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 hover:border-brand-200 transition-all duration-300 group">
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.pillars.economy.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                    {t.pillars.economy.desc}
                </p>
            </motion.div>
        </motion.div>

        {/* Strategic Alignment Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm text-brand-900 font-bold border border-brand-100 hover:shadow-md transition-shadow cursor-default">
            <Factory className="w-5 h-5 text-brand-600" />
            <span className="text-sm md:text-base">{t.nidlp}</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm text-brand-900 font-bold border border-brand-100 hover:shadow-md transition-shadow cursor-default">
            <Leaf className="w-5 h-5 text-brand-600" />
            <span className="text-sm md:text-base">{t.sgi}</span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default VisionSection;