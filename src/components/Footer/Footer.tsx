'use client';

import Image from 'next/image';
import { useTimeFormatContext } from '@/providers/TimeFormatContext';
import { useTheme } from 'next-themes';
import { useEffect, useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

const Footer: React.FC = () => {
  const { timeFormat, setTimeFormat } = useTimeFormatContext();
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const localActive = useLocale();

  // to fix hydration mismatch with next-themes
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (locale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

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
            <span className="text-xl font-bold">いつ空いてる？</span>
          </div>

          <p className="text-sm">
            「いつ空いてる？」は、メンバー全員の予定をビジュアルで確認でき、最適な時間を簡単に見つけることができる無料のスケジュール調整ツールです。
          </p>
        </article>

        {/* Settings */}
        <section className="flex flex-col space-y-4">
          <h4 className="font-semibold">設定</h4>
          <div className="flex space-x-8">
            <fieldset className="flex flex-col space-y-4">
              <legend className="font-semibold text-sm">言語</legend>
              <div className="flex flex-col space-y-2">
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="ja"
                    checked={localActive === 'ja'}
                    onChange={() => handleLanguageChange('ja')}
                    className="sr-only"
                    disabled={isPending}
                  />
                  <span
                    className={`text-sm ${
                      localActive === 'ja' ? 'text-primary' : 'text-foreground hover:underline'
                    }`}
                  >
                    日本語
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={localActive === 'en'}
                    onChange={() => handleLanguageChange('en')}
                    className="sr-only"
                    disabled={isPending}
                  />
                  <span
                    className={`text-left text-sm ${
                      localActive === 'en' ? 'text-primary' : 'text-foreground hover:underline'
                    }`}
                  >
                    English
                  </span>
                </label>
              </div>
            </fieldset>

            <fieldset className="flex flex-col space-y-4">
              <legend className="font-semibold text-sm">時刻表示</legend>
              <div className="flex flex-col space-y-2">
                <label>
                  <input
                    type="radio"
                    name="timeFormat"
                    value="12"
                    checked={timeFormat === 12}
                    onChange={() => setTimeFormat(12)}
                    className="sr-only"
                  />
                  <span
                    className={`text-sm ${
                      timeFormat === 12 ? 'text-primary' : 'text-foreground hover:underline'
                    }`}
                  >
                    12時制
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="timeFormat"
                    value="24"
                    checked={timeFormat === 24}
                    onChange={() => setTimeFormat(24)}
                    className="sr-only"
                  />
                  <span
                    className={`text-left text-sm ${
                      timeFormat === 24 ? 'text-primary' : 'text-foreground hover:underline'
                    }`}
                  >
                    24時制
                  </span>
                </label>
              </div>
            </fieldset>

            {mounted && (
              <fieldset className="flex flex-col space-y-4">
                <legend className="font-semibold text-sm">テーマ</legend>
                <div className="flex flex-col space-y-2">
                  <label>
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={theme === 'light'}
                      onChange={() => setTheme('light')}
                      className="sr-only"
                    />
                    <span
                      className={`text-sm ${
                        theme === 'light' ? 'text-primary' : 'text-foreground hover:underline'
                      }`}
                    >
                      ライト
                    </span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={theme === 'dark'}
                      onChange={() => setTheme('dark')}
                      className="sr-only"
                    />
                    <span
                      className={`text-sm ${
                        theme === 'dark' ? 'text-primary' : 'text-foreground hover:underline'
                      }`}
                    >
                      ダーク
                    </span>
                  </label>
                </div>
              </fieldset>
            )}
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
