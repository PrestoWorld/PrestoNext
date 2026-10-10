/**
 * Root Layout
 * Main layout wrapper for the entire application
 */

import type { Metadata, Viewport } from 'next';
import { Inter, Roboto_Slab } from 'next/font/google';
import { PrestoNextProvider } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-heading',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'PrestoWorld - Modern Headless CMS Frontend',
    template: '%s | PrestoWorld',
  },
  description: 'A modern headless CMS frontend built with Next.js, featuring hybrid rendering, TypeScript, and a beautiful UI.',
  keywords: ['Next.js', 'React', 'TypeScript', 'Headless CMS', 'PrestoWorld', 'Static Site Generation', 'Server-Side Rendering'],
  authors: [{ name: 'PrestoWorld Team' }],
  creator: 'PrestoWorld',
  publisher: 'PrestoWorld',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'PrestoWorld',
    title: 'PrestoWorld - Modern Headless CMS Frontend',
    description: 'A modern headless CMS frontend built with Next.js',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PrestoWorld',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrestoWorld - Modern Headless CMS Frontend',
    description: 'A modern headless CMS frontend built with Next.js',
    images: ['/og-image.png'],
    creator: '@prestoworld',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoSlab.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={process.env.PRESTOWORLD_API_URL || 'http://localhost:8000'} />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
        <PrestoNextProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="pt-16 min-h-[calc(100vh-16rem)]">
            {children}
          </main>
          <Footer />
        </PrestoNextProvider>
      </body>
    </html>
  );
}