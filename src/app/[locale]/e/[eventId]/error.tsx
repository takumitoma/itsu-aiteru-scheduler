'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  const t = useTranslations('ViewEditEvent.Error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  function reloadPage() {
    window.location.reload();
  }

  return (
    <div className="container mx-auto py-8 flex flex-col items-center px-4 space-y-8">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p>{error.message}</p>
      <p>{t('tryAgain')}</p>
      <button
        onClick={reloadPage}
        className="px-4 py-2 bg-primary text-white rounded hover:brightness-90"
      >
        {t('reload')}
      </button>
    </div>
  );
}
