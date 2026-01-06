import { Translation } from './types';

export const content: Record<'en' | 'ar', Translation> = {
  en: {
    nav: {
      mission: "Mission",
      challenge: "Challenge",
      solution: "Solution",
      vision: "Vision 2030",
      partner: "Partner With Us"
    },
    hero: {
      badge: "Sustainable Agriculture Tech",
      title_prefix: "Turning Waste into ",
      title_highlight: "Value",
      subtitle_prefix: "Revolutionizing the Saudi agricultural sector by transforming industrial food waste into high-quality, nutrient-dense livestock feed through ",
      subtitle_highlight: "AI-driven manufacturing.",
      cta_primary: "Our Technology",
      cta_secondary: "Learn More",
      stat_cost: "Cost Reduction",
      stat_tech: "AI Driven Process",
      stat_waste: "Zero Landfill Goal"
    },
    problem: {
      title: "The Critical Challenge",
      subtitle: "Saudi Arabia faces a dual challenge: High food waste and expensive imported feed.",
      chart_title: "Import Dependency vs. Waste Potential",
      card1_title: "Food Waste Crisis",
      card1_desc: "Millions of tons of organic waste end up in landfills annually, releasing harmful methane.",
      card2_title: "Import Dependency",
      card2_desc: "Heavy reliance on imported barley and alfalfa creates market volatility and food security risks.",
      card3_title: "Economic Strain",
      card3_desc: "Local farmers suffer from fluctuating global feed prices, impacting meat production costs."
    },
    solution: {
      label: "Our Innovation",
      title: "Smart Manufacturing Process",
      desc: "We don't just recycle; we engineer nutrition. Our AI workflows use image recognition to analyze incoming waste batches in real-time to adjust processing parameters.",
      ai_title: "AI & Automation",
      ai_desc: "Real-time analysis of raw waste to ensure consistent nutritional output.",
      process_title: "The Kalaa Cycle",
      step1: "Collection",
      step2: "AI Analysis",
      step3: "Extrusion",
      step4: "Premium Feed"
    },
    impact: {
      title: "Impact & Opportunity",
      subtitle: "Realizing value for farmers and the Kingdom.",
      simulator: {
        title: "See the Difference",
        subtitle: "Adjust the slider to see how Kalaa processing scales impact.",
        input_label: "Monthly Waste Processed (Tons)",
        co2_label: "CO2 Emissions Saved",
        co2_unit: "tons",
        savings_label: "Farmer Savings (SAR)",
        savings_unit: "SAR",
        disclaimer: "*Estimates based on diverting industrial bakery waste from landfills and substituting imported barley at current market average prices."
      },
      eco_title: "Economic Impact",
      eco_desc: "Reducing feed costs by 30-50% for local farmers while creating new industrial jobs.",
      env_title: "Environmental Impact",
      env_desc: "Diverting waste from landfills reduces carbon footprint and methane emissions significantly."
    },
    vision: {
      title: "Aligned with Vision 2030",
      desc: "Kalaa actively drives the Kingdom's transformation by addressing critical goals in food security, sustainability, and industrial growth.",
      nidlp: "National Industrial Development (NIDLP)",
      sgi: "Saudi Green Initiative (SGI)",
      pillars: {
        security: {
          title: "Food Security",
          desc: "Establishing a sustainable local alternative to imported feed, securing the national food supply chain against global volatility."
        },
        environment: {
          title: "Sustainability",
          desc: "Directly contributing to the Saudi Green Initiative by diverting industrial organic waste from landfills and reducing methane emissions."
        },
        economy: {
          title: "Economic Growth",
          desc: "Empowering the non-oil private sector by creating industrial jobs and localizing manufacturing technologies."
        }
      }
    },
    footer: {
      desc: "Transforming the Saudi agricultural sector through circular economy principles.",
      links: "Quick Links",
      contact: "Contact",
      rights: "© 2024 Kalaa for Feed. All rights reserved."
    }
  },
  ar: {
    nav: {
      mission: "المهمة",
      challenge: "التحدي",
      solution: "الحل",
      vision: "رؤية 2030",
      partner: "شاركنا النجاح"
    },
    hero: {
      badge: "تقنيات زراعية مستدامة",
      title_prefix: "تحويل الهدر إلى ",
      title_highlight: "قيمة",
      subtitle_prefix: "إحداث نقلة نوعية في القطاع الزراعي السعودي من خلال تحويل مخلفات الطعام الصناعية إلى أعلاف عالية الجودة عبر ",
      subtitle_highlight: "التصنيع المدعوم بالذكاء الاصطناعي.",
      cta_primary: "تقنياتنا",
      cta_secondary: "اعرف المزيد",
      stat_cost: "خفض التكلفة",
      stat_tech: "معالجة ذكية",
      stat_waste: "هدف بيئي"
    },
    problem: {
      title: "التحدي الحاسم",
      subtitle: "تواجه المملكة تحدياً مزدوجاً: ارتفاع حجم الهدر الغذائي وتكلفة الأعلاف المستوردة.",
      chart_title: "الاعتماد على الاستيراد مقابل إمكانات الهدر",
      card1_title: "أزمة الهدر الغذائي",
      card1_desc: "ملايين الأطنان من النفايات العضوية تنتهي في المكبات سنوياً، مما يسبب انبعاثات ضارة.",
      card2_title: "الاعتماد على الاستيراد",
      card2_desc: "الاعتماد الكبير على الشعير والبرسيم المستورد يخلق مخاطر في الأمن الغذائي.",
      card3_title: "العبء الاقتصادي",
      card3_desc: "يعاني المزارعون المحليون من تقلب الأسعار العالمية، مما يؤثر على تكلفة إنتاج اللحوم."
    },
    solution: {
      label: "ابتكارنا",
      title: "هندسة التصنيع الذكي",
      desc: "نحن لا نعيد التدوير فحسب؛ بل نهندس التغذية. يستخدم الذكاء الاصطناعي تحليل الصور لفحص النفايات وتعديل المعايير فورياً.",
      ai_title: "الذكاء الاصطناعي والأتمتة",
      ai_desc: "تحليل فوري للمواد الخام لضمان جودة غذائية موحدة.",
      process_title: "دورة كلأ",
      step1: "الجمع",
      step2: "التحليل الذكي",
      step3: "البثق",
      step4: "أعلاف مميزة"
    },
    impact: {
      title: "الأثر والفرص",
      subtitle: "خلق قيمة للمزارعين وللمملكة.",
      simulator: {
        title: "حاسبة الأثر",
        subtitle: "حرك المؤشر لترى كيف يتضاعف الأثر مع زيادة المعالجة.",
        input_label: "النفايات المعالجة شهرياً (طن)",
        co2_label: "توفير انبعاثات كربونية",
        co2_unit: "طن",
        savings_label: "توفير للمزارعين (ريال)",
        savings_unit: "ريال",
        disclaimer: "* التقديرات مبنية على تحويل مخلفات المخابز الصناعية عن المكبات واستبدال الشعير المستورد بأسعار السوق الحالية."
      },
      eco_title: "الأثر الاقتصادي",
      eco_desc: "خفض تكلفة الأعلاف بنسبة 30-50% للمزارعين وخلق وظائف صناعية جديدة.",
      env_title: "الأثر البيئي",
      env_desc: "تحويل النفايات عن المكبات يقلل البصمة الكربونية وانبعاثات الميثان بشكل كبير."
    },
    vision: {
      title: "تماشياً مع رؤية 2030",
      desc: "يدفع كلأ عجلة التحول الوطني من خلال معالجة أهداف حيوية في الأمن الغذائي والاستدامة والنمو الصناعي.",
      nidlp: "تطوير الصناعة الوطنية (NIDLP)",
      sgi: "مبادرة السعودية الخضراء (SGI)",
      pillars: {
        security: {
          title: "الأمن الغذائي",
          desc: "توفير بديل محلي مستدام للأعلاف المستوردة، مما يحصن سلسلة الإمداد الغذائي الوطنية ضد التقلبات العالمية."
        },
        environment: {
          title: "الاستدامة البيئية",
          desc: "المساهمة المباشرة في مبادرة السعودية الخضراء عبر تحويل النفايات العضوية الصناعية عن المكبات وخفض انبعاثات الميثان."
        },
        economy: {
          title: "النمو الاقتصادي",
          desc: "تمكين القطاع الخاص غير النفطي من خلال خلق وظائف صناعية وتوطين تقنيات التصنيع المتقدمة."
        }
      }
    },
    footer: {
      desc: "إحداث نقلة نوعية في القطاع الزراعي السعودي عبر الاقتصاد الدائري.",
      links: "روابط سريعة",
      contact: "تواصل معنا",
      rights: "© 2024 كلأ للأعلاف. جميع الحقوق محفوظة."
    }
  }
};