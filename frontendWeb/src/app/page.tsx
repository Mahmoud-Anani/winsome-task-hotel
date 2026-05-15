"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  MapPin,
  Clock,
  Shield,
  Wifi,
  Utensils,
  Car,
  Users,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function AnimatedCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const { t, locale } = useI18n();

  const hotels = [
    {
      nameEn: "Grand Palace Hotel",
      nameAr: "فندق القصر العظيم",
      city: "Dubai",
      image: "🏰",
      rating: 5,
    },
    {
      nameEn: "Seaside Resort",
      nameAr: "منتجع البحر",
      city: "Maldives",
      image: "🏝️",
      rating: 5,
    },
    {
      nameEn: "Mountain Lodge",
      nameAr: "مبنى الجبال",
      city: "Swiss Alps",
      image: "🏔️",
      rating: 4,
    },
  ];

  const testimonials = [
    {
      name: "Ahmed Al-Rashid",
      text: "Amazing experience! The staff was incredibly friendly and the rooms were spotless.",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      text: "Best hotel stay I have ever had. Will definitely come back again!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      text: "Great location, excellent service, and beautiful views. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />

        <div className="container relative z-10 px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <AnimatedSection delay={0}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-bounce-slow">
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {t("home.hero.title")}
                </span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                {t("home.hero.subtitle")}
              </p>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto">
                {t("home.hero.desc")}
              </p>
            </AnimatedSection>
            <AnimatedSection delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="text-lg px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    {t("home.cta.book")}
                  </Button>
                </Link>
                <Link href="/hotels">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    {t("home.cta.explore")}
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("home.features.title")}
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <AnimatedSection delay={0}>
              <AnimatedCard>
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                      <Star className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      {t("home.features.luxury")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("home.features.luxuryDesc")}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <AnimatedCard>
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      {t("home.features.locations")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("home.features.locationsDesc")}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <AnimatedCard>
                <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                      <Clock className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      {t("home.features.support")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("home.features.supportDesc")}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("home.amenities")}
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Wifi, label: t("home.wifi") },
              { icon: Utensils, label: t("home.restaurant") },
              { icon: Car, label: t("home.parking") },
              { icon: Users, label: t("home.concierge") },
            ].map((item, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <AnimatedCard>
                  <Card className="border-0 shadow-md bg-card/50 group-hover:shadow-lg">
                    <CardContent className="p-6 text-center space-y-2">
                      <item.icon className="w-8 h-8 mx-auto text-primary transition-transform group-hover:scale-110" />
                      <span className="font-medium">{item.label}</span>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-4">
              {t("home.gallery.title")}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <p className="text-center text-muted-foreground mb-12">
              {t("home.gallery.subtitle")}
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {hotels.map((hotel, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <AnimatedCard>
                  <Card className="border-0 shadow-lg overflow-hidden group">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                      <div className="text-6xl transition-transform duration-500 group-hover:scale-110">
                        {hotel.image}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">
                        {locale === "ar" ? hotel.nameAr : hotel.nameEn}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {hotel.city}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(hotel.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-4">
              {t("home.testimonials.title")}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <p className="text-center text-muted-foreground mb-12">
              {t("home.testimonials.subtitle")}
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <AnimatedCard>
                  <Card className="border-0 shadow-md bg-card/50">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        "{testimonial.text}"
                      </p>
                      <div className="font-medium">- {testimonial.name}</div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 text-center mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t("home.CTA.title")}</h2>
          <p className="text-lg mb-8 opacity-90">{t("home.CTA.subtitle")}</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              {locale === "ar" ? "ابدأ الآن" : "Get Started"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold text-primary">Winsome</div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Winsome Hotel. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
