'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from '@/i18n/routing';
import { RxHamburgerMenu } from 'react-icons/rx';
import { LuX } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { TransitionLink } from '@/components/TransitionLink';

const NAV_ITEMS = [
  { href: '/overview', translationKey: 'overview' },
  { href: '/guide', translationKey: 'guide' },
  { href: '/contact', translationKey: 'contact' },
] as const;

export function Header() {
  const t = useTranslations('Header');
  const pathName = usePathname();
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
    <header className="fixed left-0 top-0 z-50 h-20 w-full border-b border-grayCustom bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <TransitionLink href="/" className="flex items-center space-x-4">
          <Image src="/logo/main-logo.svg" alt="Logo" width={40} height={40} />
          <span className="hidden text-xl font-bold xs:block">{t('appName')}</span>
        </TransitionLink>

        {/* desktop nav bar */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            {NAV_ITEMS.map(({ href, translationKey }) => (
              <li key={href}>
                <TransitionLink
                  href={href}
                  className={`text-lg font-semibold transition-colors hover:text-primary ${
                    pathName === href ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {t(`nav.${translationKey}`)}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* buttons to open or close mobile nav */}
        <button
          className={`block md:hidden ${
            isMobileMenuOpen ? 'z-50 text-background' : 'text-foreground'
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
              className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <div className="fixed inset-x-0 bottom-4 top-20 z-50 md:hidden">
              <nav className="mx-4 h-full rounded-md bg-background">
                <ul className="flex flex-col space-y-4 p-4">
                  {NAV_ITEMS.map(({ href, translationKey }) => (
                    <li key={href}>
                      <TransitionLink
                        href={href}
                        className={`text-xl transition-colors hover:text-primary ${
                          pathName === href ? 'text-primary' : 'text-foreground'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t(`nav.${translationKey}`)}
                      </TransitionLink>
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
