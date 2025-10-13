import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CortexCloud - AI-Powered Business Automation',
  description: 'Automate Smarter, Scale Faster with AI-powered workflows and intelligent document processing',
  keywords: ['automation', 'AI', 'workflow', 'business', 'productivity'],
  authors: [{ name: 'CortexCloud' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CortexCloud',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cortexcloud.online',
    title: 'CortexCloud - AI-Powered Business Automation',
    description: 'Automate Smarter, Scale Faster',
    siteName: 'CortexCloud',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CortexCloud - AI-Powered Business Automation',
    description: 'Automate Smarter, Scale Faster',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#00BFFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


