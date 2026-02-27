import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import DisclaimerModal from '@/components/DisclaimerModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'JRA Legal CRM | Premium Legal Practice Management',
  description: 'A sophisticated CRM designed exclusively for legal professionals in Rajasthan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className={`${inter.className} antialiased h-full`}>
        <DisclaimerModal />
        {children}
      </body>
    </html>
  );
}
