'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { AppSettings } from './AppSettings';
import { FooterContact } from './FooterContact';

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

        <div className="flex flex-col space-y-8 lg:flex-row lg:justify-between lg:space-y-0">
          <div className="flex flex-col space-y-8 md:flex-row md:justify-between md:space-x-8 md:space-y-0">
            {/* About */}
            <article className="flex w-full flex-col space-y-4 lg:w-[320px]">
              <h4 className="font-semibold">{t('About.title')}</h4>
              <p className="text-sm">{t('About.description')}</p>
            </article>

            {/* Contact */}
            {pathname !== '/contact' && (
              <section className="w-full lg:w-[320px]">
                <FooterContact />
              </section>
            )}
          </div>

          <AppSettings />
        </div>
      </div>
    </footer>
  );
}
