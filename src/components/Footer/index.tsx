'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';

import { AppSettings } from './AppSettings';
import { FooterContact } from './FooterContact';
import { Demo } from './Demo';

export function Footer() {
  const t = useTranslations('Footer');
  const pathname = usePathname();

  return (
    <footer className="border-t border-grayCustom py-8">
      <div className="mx-auto flex max-w-7xl flex-col space-y-6 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Image src="/logo/main-logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold">{t('appName')}</span>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <article className="flex w-full flex-col space-y-4">
            <h4 className="font-semibold">{t('About.title')}</h4>
            <p className="text-sm">{t('About.description')}</p>
          </article>

          {pathname !== '/guide' && <Demo />}

          {pathname !== '/contact' && <FooterContact />}

          {/* for xl screens, always on the right regardless of conditional renders above */}
          <div className="xl:col-start-4">
            <AppSettings />
          </div>
        </div>
      </div>
    </footer>
  );
}
