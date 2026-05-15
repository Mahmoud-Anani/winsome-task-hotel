"use client";

import { useI18n } from "@/components/I18nProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Eye, Heart } from "lucide-react";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen py-20 mt-10">
      <div className="container px-4">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("about.title")}
          </h1>
          <p className="text-xl text-muted-foreground">{t("about.subtitle")}</p>
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("about.description")}
              </p>
            </div>
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🏨</div>
                <div className="text-xl font-semibold">Since 2010</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <Card className="border-0 shadow-lg bg-card/50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t("about.mission")}</h3>
              <p className="text-muted-foreground">{t("about.missionText")}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t("about.vision")}</h3>
              <p className="text-muted-foreground">{t("about.visionText")}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/50">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t("about.values")}</h3>
              <p className="text-muted-foreground">{t("about.valuesList")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="bg-muted/30 rounded-2xl p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Happy Guests</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Properties</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">15+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
