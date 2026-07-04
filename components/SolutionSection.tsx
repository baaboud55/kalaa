import React, { useRef } from 'react';
import { Truck, Scan, Factory, Sprout, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../constants';

const SolutionSection: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const t = content[lang].solution;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const yCircle1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yCircle2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const steps = [
    { icon: Truck, title: t.step1, desc: "Factory Organic Waste" },
    { icon: Scan, title: t.step2, desc: "Image Recognition & Dehydration" },
    { icon: Factory, title: t.step3, desc: "High Heat & Pellet Formation" },
    { icon: Sprout, title: t.step4, desc: "Pathogen-free Livestock Feed" },
  ];

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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand-300 font-bold tracking-widest uppercase text-sm mb-2 block">{t.label}</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{t.title}</h2>
            <p className="text-brand-100 text-lg mb-8 leading-relaxed">
              {t.desc}
            </p>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-6 hover:bg-white/10 transition-colors shadow-lg"
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <Scan className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">{t.ai_title}</h4>
                  <p className="text-sm text-brand-100 opacity-80">{t.ai_desc}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Process Flow */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-black/20 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative"
          >
            <h3 className="text-2xl font-bold mb-8 text-center">{t.process_title}</h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-500 before:to-transparent">
              {steps.map((step, idx) => (
                <motion.div key={idx} variants={itemVariants} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-brand-900 bg-brand-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-brand-300">{step.title}</h4>
                      <CheckCircle2 className="w-4 h-4 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-brand-100 opacity-70">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default SolutionSection;