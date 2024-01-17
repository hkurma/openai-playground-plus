import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { APP_DESCRIPTION, APP_TITLE } from '@/lib/constants';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://openai-playground-plus.vercel.app'),
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  keywords: [
    'openai',
    'api',
    'playground',
    'ai',
    'chat completion',
    'image generation',
    'assistants',
    'text moderations',
    'tokenizer',
    'nextjs',
    'tailwindcss',
    'shadcn/ui',
  ],
  openGraph: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    siteName: APP_TITLE,
    url: '/',
    images: ['/screenshot.png'],
    type: 'website',
    locale: 'en-US',
  },
  twitter: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: ['/screenshot.png'],
    card: 'summary_large_image',
  },
  icons: [
    {
      type: 'image/svg+xml',
      url: '/favicon.svg',
    },
    {
      type: 'image/png',
      url: '/favicon.png',
    },
  ],
};

const RootLayout = (props: PropsWithChildren) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {props.children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
