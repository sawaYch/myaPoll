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

// TODO:SEO stuffs, og image
export const metadata: Metadata = {
  title: 'MyaPoll🐼',
  description: 'MyaPoll🐼',
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
