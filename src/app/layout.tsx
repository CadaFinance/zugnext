import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ContextProvider from '@/context'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZUG Chain - Fastest Ethereum Layer 2 Solution",
  description: "ZUG is the fastest Ethereum Layer 2 chain enabling lightning-fast transactions, staking, and DeFi applications. Join the future of decentralized finance.",
  keywords: ['ZUG', 'Ethereum', 'Layer 2', 'Blockchain', 'Crypto', 'DeFi', 'Staking', 'Scalability'],
  authors: [{ name: 'ZUG Chain' }],
  creator: 'ZUG Chain',
  publisher: 'ZUG Chain',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zugchain.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ZUG Chain - Fastest Ethereum Layer 2 Solution',
    description: 'ZUG is the fastest Ethereum Layer 2 chain enabling lightning-fast transactions, staking, and DeFi applications.',
    url: 'https://zugchain.org',
    siteName: 'ZUG Chain',
    images: [
      {
        url: '/zug_logo.svg',
        width: 55,
        height: 46,
        alt: 'ZUG Chain Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'ZUG Chain - Fastest Ethereum Layer 2 Solution',
    description: 'ZUG is the fastest Ethereum Layer 2 chain enabling lightning-fast transactions, staking, and DeFi applications.',
    images: ['/invite.png'],
    creator: '@ZugChain_org',
    site: '@ZugChain_org',
  },
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Baumans&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-baumans` }
      >
        <ContextProvider>
          {children}
          <Toaster position="top-right" />
        </ContextProvider>
      </body>
    </html>
  );
}
