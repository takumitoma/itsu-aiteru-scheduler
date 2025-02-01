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
    <footer className="py-8 border-t border-grayCustom">
      <div className="flex flex-col max-w-7xl mx-auto px-4 space-y-6">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Image src="/logo/main-logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold">{t('appName')}</span>
        </div>

        <div
          className="flex flex-col lg:flex-row lg:justify-between 
            space-y-8 lg:space-y-0"
        >
          <div
            className="flex flex-col md:flex-row md:justify-between space-y-8 
              md:space-y-0 md:space-x-8"
          >
            {/* About */}
            <article className="flex flex-col w-full lg:w-[320px] space-y-4">
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
