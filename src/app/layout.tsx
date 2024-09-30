import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import Header from '@/components/Header';
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
      <body className={`${notoSansJapanese.variable} font-sans antialiased`}>
        <Header />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
