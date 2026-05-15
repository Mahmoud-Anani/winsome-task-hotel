'use client';

import { useI18n } from '@/components/I18nProvider';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, Shield, Calendar } from 'lucide-react';

export default function TermsPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen py-20 mt-4">
      <div className="container px-4">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('terms.subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Acceptance */}
          <Card className="border-0 shadow-lg bg-card/50">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t('terms.acceptance')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.acceptanceText')}
              </p>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="border-0 shadow-lg bg-card/50">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t('terms.privacy')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.privacyText')}
              </p>
            </CardContent>
          </Card>

          {/* Booking */}
          <Card className="border-0 shadow-lg bg-card/50">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t('terms.booking')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.bookingText')}
              </p>
            </CardContent>
          </Card>

          {/* Cancellation */}
          <Card className="border-0 shadow-lg bg-card/50">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t('terms.cancellation')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.cancellationText')}
              </p>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-0 shadow-lg bg-primary/5">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-xl font-bold">Questions about our Terms?</h3>
              <p className="text-muted-foreground">
                Contact us at support@winsomehotel.com or call +1 800 123 4567
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}