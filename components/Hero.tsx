import React, { useRef } from 'react';
import { ArrowRight, Leaf, Recycle, TrendingDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../constants';

const Hero: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const t = content[lang].hero;
  
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    },
  };

  return (
    <section ref={ref} className="relative pt-24 pb-16 md:pt-32 md:pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-900">
      {/* Background Animated Blob & Overlay */}
      <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-brand-500 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-300 blur-[120px]"
        />
        <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-[2px]"></div>
      </motion.div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/10 text-brand-100 border border-white/10 text-sm font-semibold mb-8 backdrop-blur-sm animate-float">
          <Leaf className="w-4 h-4" />
          <span>{t.badge}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          {t.title_prefix}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-emerald-200">{t.title_highlight}</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p variants={itemVariants} className="mt-4 max-w-2xl mx-auto text-xl text-brand-100 mb-10 leading-relaxed opacity-90">
          {t.subtitle_prefix}
          <span className="font-bold text-white">{t.subtitle_highlight}</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#solution" 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-900 font-bold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-shadow group"
          >
            <span>{t.cta_primary}</span>
            {isRTL ? <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />}
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            href="#vision" 
            className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-lg transition backdrop-blur-sm"
          >
            {t.cta_secondary}
          </motion.a>
        </motion.div>
      </motion.div>
      
      {/* Stats Strip */}
      <div className="absolute bottom-0 w-full bg-black/20 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white divide-y md:divide-y-0 md:divide-x divide-white/10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1 text-brand-300">
              <TrendingDown className="w-5 h-5" />
              <span className="text-2xl font-bold">30-50%</span>
            </div>
            <div className="text-xs opacity-70 uppercase tracking-wider">{t.stat_cost}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex flex-col items-center">
             <div className="flex items-center gap-2 mb-1 text-brand-300">
              <Leaf className="w-5 h-5" />
              <span className="text-2xl font-bold">AI</span>
            </div>
            <div className="text-xs opacity-70 uppercase tracking-wider">{t.stat_tech}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="flex flex-col items-center">
             <div className="flex items-center gap-2 mb-1 text-brand-300">
              <Recycle className="w-5 h-5" />
              <span className="text-2xl font-bold">ZERO</span>
            </div>
            <div className="text-xs opacity-70 uppercase tracking-wider">{t.stat_waste}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;