import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/data/store-context';

export const metadata: Metadata = {
  title: 'AgriLink Africa — From farm to market, with fewer barriers',
  description:
    'African digital operations platform unifying agricultural marketplace, farm operations, livestock ledger, worker accountability with photo proof, and logistics dispatch.',
  keywords: [
    'African agritech',
    'poultry farm management',
    'catfish farming app',
    'livestock ledger',
    'worker accountability',
    'agricultural marketplace Nigeria Kenya',
    'crop cooperative aggregation',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#15803d',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col antialiased bg-slate-50 text-slate-900">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
