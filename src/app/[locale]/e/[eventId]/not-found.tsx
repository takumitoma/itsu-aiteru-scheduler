import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('ViewEditEvent.NotFound');

  return (
    <div className="container mx-auto py-8 flex flex-col items-center px-4 ">
      <h1 className="text-xl sm:text-3xl font-bold mb-8">{t('title')}</h1>
      <p className="text-xs sm:text-xl">{t('description')}</p>
    </div>
  );
}
