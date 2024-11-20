'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import AppSettings from './AppSettings';
import FooterContact from './FooterContact';

export default function Footer() {
  const t = useTranslations('Footer');
  const pathname = usePathname();

  return (
    <footer className="py-8 border-t border-borderGray">
      <div
        className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:justify-between 
          space-y-8 md:space-y-0"
      >
        {/* Logo and website summary */}
        <article className="flex flex-col w-full md:w-[320px] space-y-4">
          <div className="flex items-center space-x-4">
            <Image src="/logo/main-logo.svg" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold">{t('appName')}</span>
          </div>

          <p className="text-sm">{t('description')}</p>
        </article>

        {pathname !== '/contact' && (
          <section className="w-full md:w-[320px]">
            <FooterContact />
          </section>
        )}

        <AppSettings />
      </div>
    </footer>
  );
}
