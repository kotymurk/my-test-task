import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['cyrillic', 'latin'] });

export const metadata: Metadata = {
  title: 'FitHub — Тарифы',
  description: 'Выберите тариф',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ru'>
      <body
        className={`${inter.className} min-h-screen bg-black text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
