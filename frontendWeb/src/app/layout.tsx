import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Winsome Hotel - Luxury Accommodations & Resort Booking',
  description: 'Experience world-class hospitality at Winsome Hotel. Book your perfect stay at our luxury hotels and resorts. Premium accommodations, 24/7 support, and exclusive deals.',
  keywords: ['hotel', 'resort', 'booking', 'luxury', 'accommodation', 'travel', 'vacation', 'hospitality'],
  authors: [{ name: 'Winsome Hotel' }],
  openGraph: {
    title: 'Winsome Hotel - Luxury Accommodations',
    description: 'Experience luxury and comfort at Winsome Hotel. Book your perfect stay with us.',
    type: 'website',
    locale: 'ar',
    alternateLocale: 'en',
    siteName: 'Winsome Hotel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winsome Hotel - Luxury Accommodations',
    description: 'Experience luxury and comfort at Winsome Hotel. Book your perfect stay with us.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-background overflow-x-hidden">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}