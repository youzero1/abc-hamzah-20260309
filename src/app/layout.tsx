import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ABC — Productivity Calculator',
  description: 'A modern productivity calculator with history tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
