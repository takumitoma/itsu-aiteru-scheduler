import { getTranslations } from 'next-intl/server';

export default async function ErrorMessage() {
  const t = await getTranslations('CreateEvent.ErrorMessage');

  return (
    <div className="mt-4 flex flex-col items-center">
      <h1 className="font-bold text-red-500">{t('error')}</h1>
    </div>
  );
}
