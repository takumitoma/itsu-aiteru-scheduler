'use client';

import Image from 'next/image';
import { useTimeFormatContext } from '@/providers/TimeFormatContext';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Footer: React.FC = () => {
  const { timeFormat, setTimeFormat } = useTimeFormatContext();
  const { theme, setTheme } = useTheme();

  // to fix hydration mismatch with next-themes
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="py-8 border-t border-borderGray">
      <div className="max-w-7xl mx-auto px-4 flex justify-between">
        {/* 320px (minimum vw designed for) minus padding from px-4 */}
        <article className="flex flex-col w-[calc(320px-2rem)] space-y-4">
          <div className="flex items-center space-x-4">
            <Image src="/logo/main-logo.svg" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold hidden sm:block">いつ空いてる？</span>
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
                <label className="">
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
