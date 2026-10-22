import type { Metadata } from 'next';
import './globals.css';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Laxman Phool Bhandar — Artisanal Floral Couture & Celebration Décor',
  description: 'Premier florist in Patna offering luxury wedding mandap styling, fresh car decoration, handcrafted rose bouquets, haldi & mehendi florals, and custom event decor.',
  keywords: [
    'flower decoration',
    'wedding flowers',
    'car decoration',
    'mandap decor',
    'rose bouquets',
    'Laxman Phool Bhandar',
    'Patna florist',
    'haldi flower decor'
  ],
  openGraph: {
    title: 'Laxman Phool Bhandar — Luxury Floral Design & Event Decor',
    description: 'Transform your celebrations with fresh farm blooms, handcrafted varmalas, wedding mandap styling, and luxury car decoration.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AnnouncementBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
