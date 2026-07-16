import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ar: {
    app_title: "حاسبة تركيب الأعلاف من قلعة",
    app_subtitle: "احسب وقم بتحسين تركيبة علفك بسهولة ودقة.",
    select_livestock: "اختر نوع الحيوان",
    select_formula_type: "نوع التركيبة المطلوبة",
    bag_weight: "وزن كيس العلف (كجم)",
    select_materials: "اختر المواد الخام المتوفرة لديك",
    custom_formula: "تركيبة مخصصة (أدخل الكميات يدوياً)",
    optimized_formula: "أقل تكلفة (حساب تلقائي بأقل سعر للطن)",
    optimized_suitable: "تركيبة مناسبة (حساب تلقائي متوازن)",
    optimized_perfect: "الأنسب غذائياً (حساب تلقائي لأفضل جودة)",
    calculate_button: "حساب تركيبة العلف",
    results_title: "النتائج والتحليل",
    formula_per_bag: "تركيبة العلف لكل كيس",
    nutrients_per_bag: "المحتوى الغذائي للتركيبة",
    cost_per_bag: "التكلفة التقديرية",
    cost_sar: "ريال",
    suggestions: "توصيات لتحسين التركيبة",
    error_no_materials: "الرجاء اختيار مادة واحدة على الأقل لإنشاء التركيبة.",
    add_custom_material: "+ إضافة مادة خام جديدة",
    name_placeholder: "اسم المادة (مثال: شعير)",
    price_placeholder: "السعر/كجم",
    protein: "البروتين",
    energy: "الطاقة",
    fiber: "الألياف",
    calcium: "الكالسيوم",
    phosphorus: "الفوسفور",
    lysine: "اللايسين",
    methionine: "الميثيونين",
    cancel: "إلغاء",
    save: "حفظ المادة",
    unit_kg: "كجم",
    unit_percent: "%",
    unit_kcal: "كيلو كالوري/كجم",
    within_perfect: "ضمن النطاق المثالي",
    within_acceptable: "ضمن النطاق المقبول",
    too_low: "منخفض جداً!",
    too_high: "مرتفع جداً!",
    actual: "الفعلي",
    target: "الهدف",
    suggest_add: "لزيادة",
    suggest_reduce: "لخفض",
    try_adding: "حاول إضافة حوالي",
    try_reducing: "حاول تقليل حوالي",
    from: "من",
    cost: "تكلفة",
    sar_per_kg: "ريال/كجم",
    quality_excellent: "ممتاز",
    quality_good: "جيد",
    quality_moderate: "مقبول",
    quality_poor: "ضعيف",
    material_type: "طبيعة المادة",
    type_raw: "خام",
    type_waste: "مخلفات",
    ready_materials: "قائمة المواد الخام الجاهزة",
    custom_materials: "قائمة المواد المخصصة",
    add_material_hint: "أضف مادة جديدة من إعدادات المواد",
    custom_quantity: "الكمية بالتركيبة المخصصة",
    bag_weight_label: "وزن الكيس",
    nutritional_analysis: "تحليل المحتوى الغذائي للتركيبة",
    estimated_cost: "التكلفة التقديرية للتركيبة",
    notes_recommendations: "ملاحظات وتوصيات",
    required_weight: "الوزن المطلوب",
    selected: "تم اختيار",
    materials_count: "مواد",
    overall_quality: "جودة التركيبة العامة",
    estimated_bag_cost: "تكلفة الكيس التقديرية",
    sar: "ريال",

  },
  en: {
    app_title: "Kalaa Feed Formula Calculator",
    app_subtitle: "Calculate and optimize your feed formula easily and accurately.",
    select_livestock: "Select Livestock Type",
    select_formula_type: "Required Formula Type",
    bag_weight: "Feed Bag Weight (kg)",
    select_materials: "Select Available Raw Materials",
    custom_formula: "Custom Formula (Manual Input)",
    optimized_formula: "Least Cost (Automatic Calculation)",
    optimized_suitable: "Suitable Formula (Balanced Calculation)",
    optimized_perfect: "Best Nutritional Quality (Optimal)",
    calculate_button: "Calculate Formula",
    results_title: "Results & Analysis",
    formula_per_bag: "Formula Per Bag",
    nutrients_per_bag: "Nutritional Content",
    cost_per_bag: "Estimated Cost",
    cost_sar: "SAR",
    suggestions: "Suggestions for Improvement",
    error_no_materials: "Please select at least one material to create the formula.",
    add_custom_material: "+ Add Custom Material",
    name_placeholder: "Material Name (e.g. Barley)",
    price_placeholder: "Price/kg",
    protein: "Protein",
    energy: "Energy",
    fiber: "Fiber",
    calcium: "Calcium",
    phosphorus: "Phosphorus",
    lysine: "Lysine",
    methionine: "Methionine",
    cancel: "Cancel",
    save: "Save Material",
    unit_kg: "kg",
    unit_percent: "%",
    unit_kcal: "kcal/kg",
    within_perfect: "Within Perfect Range",
    within_acceptable: "Within Acceptable Range",
    too_low: "Too Low!",
    too_high: "Too High!",
    actual: "Actual",
    target: "Target",
    suggest_add: "To increase",
    suggest_reduce: "To reduce",
    try_adding: "try adding about",
    try_reducing: "try reducing about",
    from: "of",
    cost: "cost",
    sar_per_kg: "SAR/kg",
    quality_excellent: "Excellent",
    quality_good: "Good",
    quality_moderate: "Moderate",
    quality_poor: "Poor",
    material_type: "Material Type",
    type_raw: "Raw Material",
    type_waste: "Byproduct / Waste",
    ready_materials: "Ready Raw Materials",
    custom_materials: "Custom Materials",
    add_material_hint: "Add a new material from Material Manager",
    custom_quantity: "Quantity in Custom Formula",
    bag_weight_label: "Bag Weight",
    nutritional_analysis: "Nutritional Content Analysis",
    estimated_cost: "Estimated Formula Cost",
    notes_recommendations: "Notes and Recommendations",
    required_weight: "Required Weight",
    selected: "Selected",
    materials_count: "materials",
    overall_quality: "Overall Quality",
    estimated_bag_cost: "Estimated Bag Cost",
    sar: "SAR",

  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('kalaa_language') as Language;
    if (savedLang === 'ar' || savedLang === 'en') {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kalaa_language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
