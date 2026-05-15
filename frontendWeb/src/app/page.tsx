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
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t("home.hero.title")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.hero.subtitle")}
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto">
              {t("home.hero.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8">
                  {t("home.cta.book")}
                </Button>
              </Link>
              <Link href="/hotels">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  {t("home.cta.explore")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.features.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
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

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
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

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
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
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.amenities")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-md bg-card/50">
              <CardContent className="p-6 text-center space-y-2">
                <Wifi className="w-8 h-8 mx-auto text-primary" />
                <span className="font-medium">{t("home.wifi")}</span>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-card/50">
              <CardContent className="p-6 text-center space-y-2">
                <Utensils className="w-8 h-8 mx-auto text-primary" />
                <span className="font-medium">{t("home.restaurant")}</span>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-card/50">
              <CardContent className="p-6 text-center space-y-2">
                <Car className="w-8 h-8 mx-auto text-primary" />
                <span className="font-medium">{t("home.parking")}</span>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-card/50">
              <CardContent className="p-6 text-center space-y-2">
                <Users className="w-8 h-8 mx-auto text-primary" />
                <span className="font-medium">{t("home.concierge")}</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("home.gallery.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {t("home.gallery.subtitle")}
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {hotels.map((hotel, index) => (
              <Card key={index} className="border-0 shadow-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-6xl">{hotel.image}</div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">
                    {locale === "ar" ? hotel.nameAr : hotel.nameEn}
                  </h3>
                  <p className="text-muted-foreground text-sm">{hotel.city}</p>
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
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("home.testimonials.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {t("home.testimonials.subtitle")}
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md bg-card/50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">"{testimonial.text}"</p>
                  <div className="font-medium">- {testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 text-center">
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
        <div className="container px-4">
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
