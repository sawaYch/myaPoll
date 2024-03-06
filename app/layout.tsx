import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Background from '@/components/background';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import StoreProvider from '@/stores/store-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mya88🐼',
  description:
    'Youtube live stream polling app powered by Next & official data APIv3',
  applicationName: 'MyaPoll',
  authors: [{ name: 'No.159 Sawa', url: 'https://sawaych.github.io/' }],
  generator: 'Next.js',
  keywords: ['youtube', 'mya', 'vtuber', 'hkvtuber'],
  referrer: 'origin',
  creator: 'No.159 Sawa',
  publisher: 'Vercel',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#da2777' }],
  colorScheme: 'dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://myapoll.vercel.app/',
    title: 'MyaPoll🐼',
    description:
      'Youtube live stream polling app powered by Next & official data APIv3',
    siteName: 'Mya88',
    images: [
      {
        url: 'https://myapoll.vercel.app/og',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@site',
    creator: '@creator',
    images: 'https://myapoll.vercel.app/og',
  },
  icons: [
    {
      rel: 'icon',
      url: '/greeting.webp',
      type: 'image/webp',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('overflow-x-hidden', inter.className)}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <Background />
            <Toaster />
            <TooltipProvider>{children}</TooltipProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
