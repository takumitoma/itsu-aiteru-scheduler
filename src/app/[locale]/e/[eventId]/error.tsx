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
    <div className="container mx-auto flex flex-col items-center space-y-8 px-4 py-8">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p>{error.message}</p>
      <p>{t('tryAgain')}</p>
      <button
        onClick={reloadPage}
        className="rounded bg-primary px-4 py-2 text-white hover:brightness-90"
      >
        {t('reload')}
      </button>
    </div>
  );
}
