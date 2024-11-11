import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import TimeFormatContextProvider from '@/providers/TimeFormatContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import '@/styles/globals.css';

const notoSansJapanese = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '900'],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: 'いつ会える？',
  description: '遊び、打ち合わせ、会議などを簡単にスケジュールする',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo/main-logo.svg" sizes="any" />
        <link rel="icon" href="/favicon/fallback.ico" sizes="32x32" />
      </head>
      <body className={`${notoSansJapanese.variable} font-sans antialiased`}>
        <TimeFormatContextProvider>
          <Header />
          <main className="pt-20">
            <div className="container mx-auto py-8 px-4 max-w-5xl">{children}</div>
          </main>
          <Footer />
        </TimeFormatContextProvider>
      </body>
    </html>
  );
}
