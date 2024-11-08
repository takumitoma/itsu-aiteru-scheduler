'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RxHamburgerMenu } from 'react-icons/rx';
import { LuX } from 'react-icons/lu';

const NAV_ITEMS = [
  { href: '/overview', label: 'サービス概要' },
  { href: '/how-to-use', label: '使い方' },
  { href: '/contact', label: 'お問い合わせ' },
];

const Header = () => {
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
    <header className="fixed top-0 left-0 w-full h-20 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <Image src="/logo/main-logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold hidden sm:block">いつ空いてる？</span>
        </Link>

        {/* desktop nav bar */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            {NAV_ITEMS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-primary text-lg transition-colors font-semibold"
                >
                  {label}
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
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
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
                  {NAV_ITEMS.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="hover:text-primary text-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {label}
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
};

export default Header;
