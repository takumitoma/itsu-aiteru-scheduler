import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Providers from '@/providers';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import '@/styles/globals.css';

const notoSansJapanese = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '900'],
  variable: '--font-noto-sans-jp',
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout.metadata');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Layout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Ensure that the incoming `locale` is valid
  // ignore for now as this is code from official docs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale} className="light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo/main-logo.svg" sizes="any" />
        <link rel="icon" href="/favicon/fallback.ico" sizes="32x32" />
      </head>
      <body className={`${notoSansJapanese.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="relative min-h-screen w-full overflow-x-hidden">
              <Header />
              <main className="pt-20">
                <div className="container mx-auto py-8 px-4 max-w-5xl">{children}</div>
              </main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
