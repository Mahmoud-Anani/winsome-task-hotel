import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Winsome Hotel - Luxury Accommodations',
  description: 'Experience luxury and comfort at Winsome Hotel. Book your perfect stay with us.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          <main className="min-h-screen bg-background">
            <Navbar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}