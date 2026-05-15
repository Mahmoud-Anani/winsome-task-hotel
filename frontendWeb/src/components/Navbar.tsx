'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, User, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from './I18nProvider';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAuthPage = pathname === '/login' || pathname === '/register';

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
    document.dir = locale === 'en' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale === 'en' ? 'ar' : 'en';
  };

  if (isAuthPage) {
    return (
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
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
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Winsome
            </Link>
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  href="/hotels"
                  className={`text-sm font-medium transition-colors ${pathname.startsWith('/hotels') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t('nav.hotels')}
                </Link>
                <Link
                  href="/rooms"
                  className={`text-sm font-medium transition-colors ${pathname === '/rooms' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t('nav.rooms')}
                </Link>
                <Link
                  href="/bookings"
                  className={`text-sm font-medium transition-colors ${pathname === '/bookings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t('nav.bookings')}
                </Link>
              </div>
            )}
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

            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-2">
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
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t('nav.register')}</Button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.dashboard')}
                  </Link>
                  <Link href="/hotels" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.hotels')}
                  </Link>
                  <Link href="/rooms" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.rooms')}
                  </Link>
                  <Link href="/bookings" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.bookings')}
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.login')}
                  </Link>
                  <Link href="/register" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}