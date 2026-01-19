import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    shop: "SHOP",
    bath: "BATH",
    bedroom: "BEDROOM",
    living: "LIVING",
    trade: "TRADE",
    contact: "CONTACT",
    search_placeholder: "Search collections...",
    hero_eyebrow: "ESSENTIAL LUXURY",
    hero_title: "Wrapped in Quality.",
    hero_cta: "EXPLORE COLLECTIONS",
    intro_title: "We believe in the beauty of simplicity and the luxury of high-quality materials.",
    intro_subtitle: "Our collections are thoughtfully designed to bring calm and comfort to your home.",
    premium_weaves: "PREMIUM WEAVES FOR EVERY HOME",
    luxury_towels: "LUXURY TOWELS",
    heirloom_blankets: "HEIRLOOM BLANKETS",
    fine_linens: "FINE LINENS",
    the_twill_difference: "THE TWILL DIFFERENCE",
    cotton_title: "100% Organic Cotton",
    cotton_desc: "Sourced from the finest sustainable farms, our cotton ensures breathability and durability.",
    history_title: "Since 1989",
    history_desc: "Over three decades of craftsmanship dedicated to bringing you the perfect weave.",
    contact_us: "CONTACT US",
    faq: "FAQ",
    faq_q1: "Do you ship internationally?",
    faq_a1: "Yes, we ship to selected countries worldwide.",
    faq_q2: "What is your return policy?",
    faq_a2: "Returns are accepted within 30 days of purchase.",
    address: "123 Luxury Lane, Textile District",
    email: "hello@twillhome.com"
  },
  ar: {
    shop: "تسوق",
    bath: "حمام",
    bedroom: "غرفة نوم",
    living: "معيشة",
    trade: "تجاري",
    contact: "اتصل بنا",
    search_placeholder: "ابحث في المجموعات...",
    hero_eyebrow: "فخامة أساسية",
    hero_title: "ملفوف بالجودة.",
    hero_cta: "استكشف المجموعات",
    intro_title: "نؤمن بجمال البساطة وفخامة المواد عالية الجودة.",
    intro_subtitle: "تم تصميم مجموعاتنا بعناية لتجلب الهدوء والراحة لمنزلك.",
    premium_weaves: "أنسجة فاخرة لكل منزل",
    luxury_towels: "مناشف فاخرة",
    heirloom_blankets: "بطانيات عريقة",
    fine_linens: "بياضات راقية",
    the_twill_difference: "فرق تويل",
    cotton_title: "قطن عضوي 100%",
    cotton_desc: "مصدر من أجود المزارع المستدامة، لضمان التنفس والمتانة.",
    history_title: "منذ 1989",
    history_desc: "أكثر من ثلاثة عقود من الحرفية مخصصة لتقديم النسيج المثالي لك.",
    contact_us: "اتصل بنا",
    faq: "أسئلة شائعة",
    faq_q1: "هل تشحنون دولياً؟",
    faq_a1: "نعم، نشحن لبلدان مختارة حول العالم.",
    faq_q2: "ما هي سياسة الإرجاع؟",
    faq_a2: "نقبل الإرجاع خلال 30 يوماً من الشراء.",
    address: "123 شارع الفخامة، حي المنسوجات",
    email: "hello@twillhome.com"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
