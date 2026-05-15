'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'ar';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.hotels': 'Hotels',
    'nav.rooms': 'Rooms',
    'nav.bookings': 'Bookings',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'home.hero.title': 'Welcome to Winsome Hotel',
    'home.hero.subtitle': 'Experience luxury and comfort in the heart of the city',
    'home.hero.desc': 'Discover our collection of premium hotels and book your perfect stay',
    'home.cta.book': 'Book Now',
    'home.cta.explore': 'Explore Hotels',
    'home.features.title': 'Why Choose Us',
    'home.features.luxury': 'Luxury Accommodations',
    'home.features.luxuryDesc': 'Experience world-class amenities and exceptional service',
    'home.features.locations': 'Prime Locations',
    'home.features.locationsDesc': 'Hotels in the most desirable locations',
    'home.features.support': '24/7 Support',
    'home.features.supportDesc': 'Round-the-clock assistance for all your needs',
    'auth.login.title': 'Login',
    'auth.login.subtitle': 'Enter your credentials to access your account',
    'auth.register.title': 'Register',
    'auth.register.subtitle': 'Create your account to get started',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.role': 'Role',
    'auth.submit': 'Submit',
    'auth.loginBtn': 'Login',
    'auth.registerBtn': 'Register',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginFailed': 'Login failed. Please try again.',
    'auth.registerFailed': 'Registration failed. Please try again.',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.hotels': 'الفنادق',
    'nav.rooms': 'الغرف',
    'nav.bookings': 'الحجوزات',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.logout': 'تسجيل الخروج',
    'home.hero.title': 'مرحباً بك في فندق وينسوم',
    'home.hero.subtitle': 'استمتع بالرفاهية والراحة في قلب المدينة',
    'home.hero.desc': 'اكتشف مجموعتنا من الفنادق المميزة واحجز إقامتك المثالية',
    'home.cta.book': 'احجز الآن',
    'home.cta.explore': 'استكشف الفنادق',
    'home.features.title': 'لماذا تختارنا',
    'home.features.luxury': 'إقامة فاخرة',
    'home.features.luxuryDesc': 'استمتع بخدمات عالمية ومرافق استثنائية',
    'home.features.locations': 'مواقع مميزة',
    'home.features.locationsDesc': 'فنادق في أفضل المواقع',
    'home.features.support': 'دعم على مدار الساعة',
    'home.features.supportDesc': 'مساعدة مستمرة لجميع احتياجاتك',
    'auth.login.title': 'تسجيل الدخول',
    'auth.login.subtitle': 'أدخل بياناتك للوصول إلى حسابك',
    'auth.register.title': 'إنشاء حساب',
    'auth.register.subtitle': 'أنشئ حسابك للبدء',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل',
    'auth.role': 'الدور',
    'auth.submit': 'إرسال',
    'auth.loginBtn': 'تسجيل الدخول',
    'auth.registerBtn': 'إنشاء حساب',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'auth.loginFailed': 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.',
    'auth.registerFailed': 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored && (stored === 'en' || stored === 'ar')) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}