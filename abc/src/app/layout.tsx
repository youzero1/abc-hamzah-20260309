import 'reflect-metadata';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'abc',
  description: 'A Notes App with e-commerce-inspired organization features',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
