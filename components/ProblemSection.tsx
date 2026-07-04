import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../constants';

const data = [
  { name: 'Import Dependency', value: 85, color: '#f87171' }, 
  { name: 'Local Production', value: 15, color: '#fbbf24' },  
  { name: 'Food Waste', value: 65, color: '#60a5fa' },        
];

const ProblemSection: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const t = content[lang].problem;

  const cardVariants = {
    hidden: { opacity: 0, x: isRTL ? -20 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  return (
    <section id="challenge" className="py-24 bg-brand-sand-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.title}</h2>
          <p className="text-lg text-slate-600">{t.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Infographic / Chart Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white h-96 flex flex-col hover:shadow-2xl transition-shadow"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-600" />
              {t.chart_title}
            </h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{fontSize: 12, fill: '#475569'}} 
                    orientation={isRTL ? 'right' : 'left'}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-center text-slate-400 mt-4">
              * Indicative metrics representing the gap in local resources vs potential waste utilization.
            </div>
          </motion.div>

          {/* Text Cards */}
          <div className="grid gap-6">
            <motion.div 
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="flex gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border-l-4 border-red-400 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="shrink-0">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{t.card1_title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t.card1_desc}</p>
              </div>
            </motion.div>

            <motion.div 
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="flex gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border-l-4 border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="shrink-0">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                  <Anchor className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{t.card2_title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t.card2_desc}</p>
              </div>
            </motion.div>

             <motion.div 
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="flex gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border-l-4 border-brand-500 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="shrink-0">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{t.card3_title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t.card3_desc}</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSection;