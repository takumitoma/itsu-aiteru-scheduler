'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export function LoginOutMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('LoginOutMessage');
  const isLoggedIn = searchParams.get('login') === 'true';
  const isLoggedOut = searchParams.get('logout') === 'true';
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setShowLogoutMessage(false);
      setShowLoginMessage(true);
      router.replace('/');
    } else if (isLoggedOut) {
      setShowLoginMessage(false);
      setShowLogoutMessage(true);
      router.replace('/');
    }
  }, [isLoggedIn, isLoggedOut, router]);

  if (!showLoginMessage && !showLogoutMessage) return null;

  if (showLoginMessage) {
    return <div className="w-full text-center text-green-500">{t('login')}</div>;
  }

  return <div className="w-full text-center text-green-500">{t('logout')}</div>;
}
