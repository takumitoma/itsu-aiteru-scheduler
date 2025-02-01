'use client';

import { useTimeFormatContext } from '@/providers/TimeFormatContext';
import { useTheme } from 'next-themes';
import { useEffect, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export function AppSettings() {
  const t = useTranslations('Footer.AppSettings');
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

  function handleLanguageChange(locale: string) {
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <section className="flex flex-col space-y-4">
      <h4 className="font-semibold">{t('title')}</h4>
      <div className="flex space-x-8">
        <fieldset className="flex flex-col space-y-2">
          <legend className="text-sm font-semibold">{t('language.label')}</legend>
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
                className={`text-sm font-normal ${
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
                className={`text-sm font-normal ${
                  localActive === 'en' ? 'text-primary' : 'text-foreground hover:underline'
                }`}
              >
                English
              </span>
            </label>
          </div>
        </fieldset>

        <fieldset className="flex flex-col space-y-2">
          <legend className="text-sm font-semibold">{t('timeFormat.label')}</legend>
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
                className={`text-sm font-normal ${
                  timeFormat === 12 ? 'text-primary' : 'text-foreground hover:underline'
                }`}
              >
                {t('timeFormat.12hour')}
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
                className={`text-sm font-normal ${
                  timeFormat === 24 ? 'text-primary' : 'text-foreground hover:underline'
                }`}
              >
                {t('timeFormat.24hour')}
              </span>
            </label>
          </div>
        </fieldset>

        {mounted && (
          <fieldset className="flex flex-col space-y-2">
            <legend className="text-sm font-semibold">{t('theme.label')}</legend>
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
                  className={`text-sm font-normal ${
                    theme === 'light' ? 'text-primary' : 'text-foreground hover:underline'
                  }`}
                >
                  {t('theme.light')}
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
                  className={`text-sm font-normal ${
                    theme === 'dark' ? 'text-primary' : 'text-foreground hover:underline'
                  }`}
                >
                  {t('theme.dark')}
                </span>
              </label>
            </div>
          </fieldset>
        )}
      </div>
    </section>
  );
}
