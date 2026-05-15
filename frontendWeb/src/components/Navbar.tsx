'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, User, Menu, X, Globe, Sun, Moon, Home, Building2, Bed, Calendar, Info, FileText } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from './I18nProvider';
import { useTheme } from './ThemeProvider';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAuthPage = pathname === '/login' || pathname === '/register';

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
    document.dir = newLocale === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = newLocale;
  };

  const mainLinks = [
    { href: '/', icon: Home, label: t('nav.home') },
    { href: '/hotels', icon: Building2, label: t('nav.hotels') },
    { href: '/rooms', icon: Bed, label: t('nav.rooms') },
    { href: '/bookings', icon: Calendar, label: t('nav.bookings') },
    { href: '/about', icon: Info, label: t('nav.about') },
    { href: '/terms', icon: FileText, label: t('nav.terms') },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (isAuthPage) {
    return (
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Winsome
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                {locale === 'en' ? 'عربي' : 'English'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Winsome
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                      pathname === link.href 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                {locale === 'en' ? 'عربي' : 'English'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {isAuthenticated ? (
                <>
                  <div className="hidden md:flex items-center gap-2 ml-4">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">({user?.role})</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">{t('nav.register')}</Button>
                  </Link>
                </div>
              )}

              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar */}
          <div className={`absolute top-0 ${locale === 'ar' ? 'left-0' : 'right-0'} h-full w-80 bg-background shadow-xl transform transition-transform duration-300 ease-in-out`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2" onClick={closeMobileMenu}>
                  <Building2 className="h-5 w-5" />
                  Winsome
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 hover:bg-muted rounded-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1 px-4">
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        pathname === link.href 
                          ? 'text-primary bg-primary/10' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Auth Section */}
                <div className="border-t mt-4 pt-4 px-4">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{user?.name}</div>
                          <div className="text-xs text-muted-foreground">({user?.role})</div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start px-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        {t('nav.logout')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link 
                        href="/login" 
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5"
                        onClick={closeMobileMenu}
                      >
                        {t('nav.login')}
                      </Link>
                      <Link 
                        href="/register" 
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                        onClick={closeMobileMenu}
                      >
                        {t('nav.register')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    {locale === 'en' ? 'عربي' : 'English'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}