import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LocaleContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<string, Record<Language, string>> = {
  shopPops: { en: 'Shop Pops', ar: 'تسوق البوبس' },
  buildBox: { en: 'Build Your Box', ar: 'اصنع صندوقك' },
  subscriptions: { en: 'Subscribe & Save', ar: 'اشتراكات التوفير' },
  rewards: { en: 'Eco Rewards', ar: 'مكافآت الاستدامة' },
  stores: { en: 'Find Stores', ar: 'مواقع المتاجر' },
  corporate: { en: 'Corporate & Events', ar: 'الشركات والفعاليات' },
  support: { en: 'Concierge Support', ar: 'خدمة العملاء' },
  admin: { en: 'Admin Hub', ar: 'لوحة التحكم' },
  account: { en: 'My Account', ar: 'حسابي' },
  cart: { en: 'Bag', ar: 'الحقيبة' },
  currency: { en: 'AED', ar: 'د.إ' },
  heroTitle: { en: '100% Natural. 100% Plant-Based.', ar: '١٠٠٪ طبيعي. ١٠٠٪ نباتي.' },
  heroSubtitle: { en: 'Artisanal ice pops handcrafted with cold-pressed real fruits. Free from refined sugar, artificial flavors, and plastics.', ar: 'آيس بوبس حرفية محضرة من فواكه طبيعية معصورة على البارد. خالية تماماً من السكر المكرر والنكهات الصناعية والبلاستيك.' },
  orderNow: { en: 'Order Fresh Pops', ar: 'اطلب الآن طازجاً' },
  boxOffer: { en: 'Save Up to 20% on Custom Boxes', ar: 'وفر حتى ٢٠٪ عند تصميم صندوقك' },
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('hop_lang', newLang);
  };

  useEffect(() => {
    const saved = localStorage.getItem('hop_lang') as Language | null;
    if (saved === 'ar' || saved === 'en') {
      setLang(saved);
    }
  }, []);

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LocaleContext.Provider
      value={{
        lang,
        setLang,
        t,
        isRtl: lang === 'ar',
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within a LocaleProvider');
  return context;
};
