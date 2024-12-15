import { useTranslations } from 'next-intl';

export function ErrorMessage() {
  const t = useTranslations('CreateEvent.ErrorMessage');

  return (
    <div className="mt-4 flex flex-col items-center">
      <h1 className="font-bold text-red-500">{t('error')}</h1>
    </div>
  );
}
