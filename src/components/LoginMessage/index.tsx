'use client';

import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function LoginMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('LoginMessage');
  const isLoggedIn = searchParams.get('login') === 'true';
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setShowMessage(true);
      router.replace('/');
    }
  }, [isLoggedIn, router]);

  if (!showMessage) return null;

  return <div className="w-full text-center text-green-500">{t('message')}</div>;
}
