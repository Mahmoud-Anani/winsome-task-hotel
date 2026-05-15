"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/lib/api";
import {
  LogOut,
  User,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  Home,
  Building2,
  Bed,
  Calendar,
  Info,
  FileText,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useI18n } from "./I18nProvider";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors and still clear client state
    }

    logout();
    router.push("/login");
    setUserDropdownOpen(false);
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    setLocale(newLocale);
    document.dir = newLocale === "en" ? "ltr" : "rtl";
    document.documentElement.lang = newLocale;
  };

  const mainLinks = [
    { href: "/", icon: Home, label: t("nav.home") },
    { href: "/hotels", icon: Building2, label: t("nav.hotels") },
    { href: "/rooms", icon: Bed, label: t("nav.rooms") },
    { href: "/bookings", icon: Calendar, label: t("nav.bookings") },
  ];

  const moreLinks = [
    { href: "/about", icon: Info, label: t("nav.about") },
    { href: "/terms", icon: FileText, label: t("nav.terms") },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (isAuthPage) {
    return (
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-primary flex items-center gap-2"
            >
              <Building2 className="h-6 w-6" />
              Winsome
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {locale === "en" ? "عربي" : "English"}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="fixed w-full z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 ">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-2">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2 shrink-0"
            >
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">Winsome</span>
            </Link>

            {/* Main Nav - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </span>
                </Link>
              ))}

              {/* More Dropdown */}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-md transition-colors"
                >
                  <Info className="h-4 w-4" />
                  {t("nav.more")}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`absolute rigth-0 top-full mt-1 w-48 bg-background border rounded-lg shadow-lg py-2 transition-all duration-200 origin-top-right ${moreDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                >
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        pathname === link.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Tablet Nav - Show limited links */}
            <div className="hidden md:flex lg:hidden items-center gap-1">
              {mainLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors px-2 py-2 rounded-md ${
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{link.label}</span>
                  </span>
                </Link>
              ))}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-2 rounded-md transition-colors"
                >
                  <Info className="h-4 w-4" />
                  <span className="hidden xl:inline">{t("nav.more")}</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`absolute right-0 top-full mt-1 w-48 bg-background border rounded-lg shadow-lg py-2 transition-all duration-200 origin-top-right ${moreDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                >
                  {mainLinks
                    .slice(3)
                    .concat(moreLinks)
                    .map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          pathname === link.href
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    ))}
                </div>
              </div>
            </div>

            {/* Spacer - pushes actions to right */}
            <div className="flex-1 lg:hidden" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Language & Theme - Always visible */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">
                  {locale === "en" ? "عربي" : "English"}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* User Menu - Desktop */}
              <div className="hidden md:flex items-center">
                <div className="relative" ref={userDropdownRef}>
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium hidden lg:inline">
                          {user?.name}
                        </span>
                        <ChevronDown
                          className={`h-3 w-3 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`absolute ${locale === "ar" ? "-right-20.5" : "right-0"} top-full mt-1 w-37.5 bg-background border rounded-lg shadow-lg py-2 transition-all duration-200 origin-top-right ${userDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                      >
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user?.role === "ADMIN"
                              ? t("roles.admin")
                              : user?.role === "HOTEL_MANAGER"
                                ? t("roles.hotel_manager")
                                : t("roles.user")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {t("nav.logout")}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        {t("nav.login")}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
        <div
          className={`absolute top-0 ${locale === "ar" ? "left-0" : "right-0"} h-full w-72 sm:w-80 bg-background shadow-xl transition-transform duration-300 ease-out ${mobileMenuOpen ? "translate-x-0" : locale === "ar" ? "-translate-x-full" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link
                href="/"
                className="text-xl font-bold text-primary flex items-center gap-2"
                onClick={closeMobileMenu}
              >
                <Building2 className="h-5 w-5" />
                Winsome
              </Link>
              <button
                onClick={closeMobileMenu}
                className="p-2 hover:bg-muted rounded-md transition-colors"
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
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}

                {/* Mobile More Section */}
                <div className="pt-2 mt-2 border-t">
                  <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("nav.more")}
                  </p>
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={closeMobileMenu}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth Section */}
              <div className="border-t mt-4 pt-4 px-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{user?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {t(`roles.${user?.role?.toLowerCase()}`)}
                        </div>
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
                      {t("nav.logout")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5"
                      onClick={closeMobileMenu}
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                      onClick={closeMobileMenu}
                    >
                      {t("nav.register")}
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
                  {locale === "en" ? "عربي" : "English"}
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
