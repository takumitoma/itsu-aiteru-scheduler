'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { RxHamburgerMenu } from 'react-icons/rx';
import { LuX } from 'react-icons/lu';
import { useTranslations } from 'next-intl';

const NAV_ITEMS = [
  { href: '/overview', translationKey: 'overview' },
  { href: '/guide', translationKey: 'guide' },
  { href: '/contact', translationKey: 'contact' },
] as const;

export default function Header() {
  const t = useTranslations('Header');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // disable body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  function toggleMenu() {
    setIsMobileMenuOpen((prevState) => !prevState);
  }

  return (
    <header
      className="fixed top-0 left-0 w-full h-20 bg-background z-50 border-b 
        border-borderGray"
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <Image src="/logo/main-logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold hidden sm:block">{t('appName')}</span>
        </Link>

        {/* desktop nav bar */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            {NAV_ITEMS.map(({ href, translationKey }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-primary text-lg transition-colors font-semibold"
                >
                  {t(`nav.${translationKey}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* buttons to open or close mobile nav */}
        <button
          className={`block md:hidden ${
            isMobileMenuOpen ? 'text-background z-50' : 'text-foreground'
          }`}
          onClick={toggleMenu}
          aria-label={isMobileMenuOpen ? t('aria.closeMenu') : t('aria.openMenu')}
        >
          {isMobileMenuOpen ? <LuX size={30} /> : <RxHamburgerMenu size={30} />}
        </button>

        {/* mobile nav bar */}
        {isMobileMenuOpen && (
          <>
            {/* overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <div className="fixed top-20 inset-x-0 bottom-4 md:hidden z-50">
              <nav className="bg-background mx-4 h-full rounded-md">
                <ul className="flex flex-col space-y-4 p-4">
                  {NAV_ITEMS.map(({ href, translationKey }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="hover:text-primary text-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t(`nav.${translationKey}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
