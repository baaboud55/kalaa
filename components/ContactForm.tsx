import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../constants';

const ContactForm: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const t = content[lang].footer;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for form submission, then open mailto
    setTimeout(() => {
      setIsSubmitting(false);
      const subject = encodeURIComponent(`Kalaa Partnership Inquiry from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
      window.location.href = `mailto:baaboud55@gmail.com?subject=${subject}&body=${body}`;
      
      toast.success(isRTL ? 'تم الإرسال بنجاح! شكراً لتواصلك معنا.' : 'Message ready to send! Thank you.', {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      });
      
      // Clear form
      setFormData({ name: '', email: '', message: '' });
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10"
    >
      <h4 className="text-xl font-bold text-white mb-6">Partner With Us</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your Name" 
            className="w-full bg-brand-900/50 border border-brand-700 text-white placeholder:text-brand-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>
        <div>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your Email" 
            className="w-full bg-brand-900/50 border border-brand-700 text-white placeholder:text-brand-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>
        <div>
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="How can we collaborate?" 
            rows={4}
            className="w-full bg-brand-900/50 border border-brand-700 text-white placeholder:text-brand-300/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none"
          ></textarea>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Send Message</span>
              <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
