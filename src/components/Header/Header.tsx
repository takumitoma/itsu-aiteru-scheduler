'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RxHamburgerMenu } from 'react-icons/rx';
import { LuX } from 'react-icons/lu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // disable body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  function toggleMenu() {
    setIsMenuOpen((prevState) => !prevState);
  }

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <Image src="/logo/main-logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold hidden sm:block">いつ空いてる？</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            <li>
              <Link href="/overview" className="hover:text-primary text-xl transition-colors">
                サービス概要
              </Link>
            </li>
            <li>
              <Link href="/how-to-use" className="hover:text-primary text-xl transition-colors">
                使い方
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`block md:hidden ${isMenuOpen ? 'text-background z-50' : 'text-foreground'}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <LuX size={30} /> : <RxHamburgerMenu size={30} />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu */}
            <div className="fixed top-20 inset-x-0 bottom-4 md:hidden z-50">
              <nav className="bg-background mx-4 h-full rounded-md">
                <ul className="flex flex-col space-y-4 p-4">
                  <li>
                    <Link
                      href="/overview"
                      className="hover:text-primary text-xl transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      サービス概要
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/how-to-use"
                      className="hover:text-primary text-xl transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      使い方
                    </Link>
                  </li>
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
