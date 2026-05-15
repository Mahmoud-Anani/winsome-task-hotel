"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Locale = "en" | "ar";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.hotels": "Hotels",
    "nav.rooms": "Rooms",
    "nav.bookings": "Bookings",
    "nav.about": "About",
    "nav.terms": "Terms",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "nav.more": "More",
    "home.hero.title": "Welcome to Winsome Hotel",

    "home.CTA.title": "Book Your Stay",
    "home.CTA.subtitle": "Experience luxury and comfort with us",

    "home.amenities": "Our Amenities",
    "home.concierge": "Concierge Services",
    "home.parking": "Parking",
    "home.restaurant": "Restaurant",
    "home.wifi": "Free WiFi",

    "home.hero.subtitle":
      "Experience luxury and comfort in the heart of the city",
    "home.hero.desc":
      "Discover our collection of premium hotels and book your perfect stay",
    "home.cta.book": "Book Now",
    "home.cta.explore": "Explore Hotels",
    "home.features.title": "Why Choose Us",
    "home.features.luxury": "Luxury Accommodations",
    "home.features.luxuryDesc":
      "Experience world-class amenities and exceptional service",
    "home.features.locations": "Prime Locations",
    "home.features.locationsDesc": "Hotels in the most desirable locations",
    "home.features.support": "24/7 Support",
    "home.features.supportDesc":
      "Round-the-clock assistance for all your needs",
    "home.gallery.title": "Our Hotels",
    "home.gallery.subtitle": "Explore our beautiful properties",
    "home.testimonials.title": "What Our Guests Say",
    "home.testimonials.subtitle": "Hear from our satisfied customers",
    "auth.login.title": "Login",
    "auth.login.subtitle": "Enter your credentials to access your account",
    "auth.register.title": "Register",
    "auth.register.subtitle": "Create your account to get started",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full Name",
    "auth.role": "Role",
    "auth.submit": "Submit",
    "auth.loginBtn": "Login",
    "auth.registerBtn": "Register",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.loginFailed": "Login failed. Please try again.",
    "auth.registerFailed": "Registration failed. Please try again.",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "about.title": "About Winsome Hotel",
    "about.subtitle": "Your trusted partner in luxury hospitality",
    "about.description":
      "Winsome Hotel is a premier hospitality brand dedicated to providing exceptional accommodation experiences across the region. With a focus on luxury, comfort, and personalized service, we have become the preferred choice for travelers seeking the finest hotels.",
    "about.mission": "Our Mission",
    "about.missionText":
      "To provide world-class hospitality services that exceed our guests expectations while creating memorable experiences.",
    "about.vision": "Our Vision",
    "about.visionText":
      "To be the leading hotel brand known for excellence in service, innovation, and guest satisfaction.",
    "about.values": "Our Values",
    "about.valuesList":
      "Excellence, Integrity, Innovation, Guest First, Sustainability",
    "terms.title": "Terms and Conditions",
    "terms.subtitle": "Please read our terms carefully",
    "terms.description":
      "By using Winsome Hotel services, you agree to the following terms and conditions.",
    "terms.acceptance": "Acceptance of Terms",
    "terms.acceptanceText":
      "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.",
    "terms.privacy": "Privacy Policy",
    "terms.privacyText":
      "We are committed to protecting your privacy. Your personal information will be used in accordance with our privacy policy.",
    "terms.booking": "Booking Terms",
    "terms.bookingText":
      "All bookings are subject to availability and confirmation. Please review your booking details before confirming.",
    "terms.cancellation": "Cancellation Policy",
    "terms.cancellationText":
      "Cancellations made 24 hours before check-in will receive a full refund. Late cancellations may incur a fee.",
    "dashboard.title": "Dashboard",
    "dashboard.totalHotels": "Total Hotels",
    "dashboard.totalBookings": "Total Bookings",
    "dashboard.confirmed": "Confirmed",
    "dashboard.pending": "Pending",
    "dashboard.totalRevenue": "Total Revenue",
    "dashboard.recentBookings": "Recent Bookings",
    "dashboard.hotel": "Hotel",
    "dashboard.guest": "Guest",
    "dashboard.checkIn": "Check In",
    "dashboard.checkOut": "Check Out",
    "dashboard.total": "Total",
    "dashboard.status": "Status",
    "dashboard.noBookings": "No recent bookings",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.dashboard": "لوحة التحكم",
    "nav.hotels": "الفنادق",
    "nav.rooms": "الغرف",
    "nav.bookings": "الحجوزات",
    "nav.about": "من نحن",
    "nav.terms": "الشروط",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",
    "nav.logout": "تسجيل الخروج",
    "nav.more": "المزيد",
    "home.CTA.title": "احجز إقامتك",
    "home.CTA.subtitle": "استمتع بالرفاهية والراحة معنا",

    "home.concierge": "خدمات الكونسيرج",
    "home.parking": "موقف سيارات",
    "home.restaurant": "مطعم",
    "home.wifi": " الواي فاي المجاني",

    "home.amenities": "مرافقنا",
    "home.hero.title": "مرحباً بك في فندق وينسوم",
    "home.hero.subtitle": "استمتع بالرفاهية والراحة في قلب المدينة",
    "home.hero.desc": "اكتشف مجموعتنا من الفنادق المميزة واحجز إقامتك المثالية",
    "home.cta.book": "احجز الآن",
    "home.cta.explore": "استكشف الفنادق",
    "home.features.title": "لماذا تختارنا",
    "home.features.luxury": "إقامة فاخرة",
    "home.features.luxuryDesc": "استمتع بخدمات عالمية ومرافق استثنائية",
    "home.features.locations": "مواقع مميزة",
    "home.features.locationsDesc": "فنادق في أفضل المواقع",
    "home.features.support": "دعم على مدار الساعة",
    "home.features.supportDesc": "مساعدة مستمرة لجميع احتياجاتك",
    "home.gallery.title": "فنادقنا",
    "home.gallery.subtitle": "استكشف منشآتنا الجميلة",
    "home.testimonials.title": "ماذا يقول ضيوفنا",
    "home.testimonials.subtitle": "استمع إلى عملائنا",
    "auth.login.title": "تسجيل الدخول",
    "auth.login.subtitle": "أدخل بياناتك للوصول إلى حسابك",
    "auth.register.title": "إنشاء حساب",
    "auth.register.subtitle": "أنشئ حسابك للبدء",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.name": "الاسم الكامل",
    "auth.role": "الدور",
    "auth.submit": "إرسال",
    "auth.loginBtn": "تسجيل الدخول",
    "auth.registerBtn": "إنشاء حساب",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.hasAccount": "لديك حساب بالفعل؟",
    "auth.loginFailed": "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
    "auth.registerFailed": "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.",
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "about.title": "عن فندق وينسوم",
    "about.subtitle": "شريكك الموثوق في الضيافة الفاخرة",
    "about.description":
      "فندق وينسوم هو علامة تجارية رائدة في مجال الضيافة مكرسة لتقديم تجارب إقامة استثنائية في جميع أنحاء المنطقة.",
    "about.mission": "مهمتنا",
    "about.missionText":
      "تقديم خدمات ضيافة عالمية المستوى تتجاوز توقعات ضيوفنا مع خلق تجارب لا تُنسى.",
    "about.vision": "رؤيتنا",
    "about.visionText":
      "أن نكون العلامة التجارية الرائدة في مجال الضيافة.",
    "about.values": "قيمنا",
    "about.valuesList": "التميز، النزاهة، الابتكار، الضيف أولاً، الاستدامة",
    "terms.title": "الشروط والأحكام",
    "terms.subtitle": "يرجى قراءة شروطنا بعناية",
    "terms.description":
      "باستخدام خدمات فندق وينسوم، أنت توافق على الشروط والأحكام التالية.",
    "terms.acceptance": "قبول الشروط",
    "terms.acceptanceText":
      "من خلال الوصول إلى هذا الموقع واستخدامه، فإنك تقبل وتوافق على الالتزام بشروط وأحكام هذا الاتفاق.",
    "terms.privacy": "سياسة الخصوصية",
    "terms.privacyText":
      "نحن ملزمون بحماية خصوصيتك. سيتم استخدام معلوماتك الشخصية وفقًا لسياسة الخصوصية لدينا.",
    "terms.booking": "شروط الحجز",
    "terms.bookingText":
      "جميع الحجوزات تخضع للتوفر والتأكيد. يرجى مراجعة تفاصيل الحجز قبل التأكيد.",
    "terms.cancellation": "سياسة الإلغاء",
    "terms.cancellationText":
      "إذا قمت بالإلغاء قبل 24 ساعة من تسجيل الوصول، ستسترد المبلغ بالكامل. قد رسوم للإلغاء المتأخر.",
    "dashboard.title": "لوحة التحكم",
    "dashboard.totalHotels": "إجمالي الفنادق",
    "dashboard.totalBookings": "إجمالي الحجوزات",
    "dashboard.confirmed": "مؤكد",
    "dashboard.pending": "معلق",
    "dashboard.totalRevenue": "إجمالي الإيرادات",
    "dashboard.recentBookings": "الحجوزات الأخيرة",
    "dashboard.hotel": "الفندق",
    "dashboard.guest": "الضيف",
    "dashboard.checkIn": "تسجيل الوصول",
    "dashboard.checkOut": "تسجيل المغادرة",
    "dashboard.total": "الإجمالي",
    "dashboard.status": "الحالة",
    "dashboard.noBookings": "لا توجد حجوزات حديثة",
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored && (stored === "en" || stored === "ar")) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
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
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
