import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('ViewEditEvent.NotFound');

  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-8">
      <h1 className="mb-8 text-xl font-bold sm:text-3xl">{t('title')}</h1>
      <p className="text-xs sm:text-xl">{t('description')}</p>
    </div>
  );
}
