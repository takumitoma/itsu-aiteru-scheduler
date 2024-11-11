'use client';

import Image from 'next/image';
import { useTimeFormatContext } from '@/providers/TimeFormatContext';

const Footer: React.FC = () => {
  const { timeFormat, setTimeFormat } = useTimeFormatContext();

  return (
    <footer className="py-8 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex justify-between">
        {/* 320px (minimum vw designed for) minus padding from px-4 */}
        <section className="flex flex-col w-[calc(320px-2rem)] space-y-4">
          <div className="flex items-center space-x-4">
            <Image src="/logo/main-logo.svg" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold hidden sm:block">いつ空いてる？</span>
          </div>

          <p className="text-sm">
            「いつ空いてる？」は、メンバー全員の予定をビジュアルで確認でき、最適な時間を簡単に見つけることができる無料のスケジュール調整ツールです。
          </p>
        </section>

        {/* Settings */}
        <section className="flex flex-col space-y-4">
          <h4 className="font-semibold">オプション</h4>
          <div className="flex flex-col space-y-4">
            <p className="font-semibold text-sm">時刻表示</p>
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                className={`text-left text-sm ${
                  timeFormat === 12 ? 'text-primary' : 'text-foreground hover:underline'
                }`}
                onClick={() => setTimeFormat(12)}
              >
                12時制
              </button>
              <button
                type="button"
                className={`text-left text-sm ${
                  timeFormat === 24 ? 'text-primary' : 'text-foreground hover:underline'
                }`}
                onClick={() => setTimeFormat(24)}
              >
                24時制
              </button>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
