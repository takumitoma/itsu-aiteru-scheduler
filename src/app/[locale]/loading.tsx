import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('Loading');

  return (
    <h1
      className="h-[calc(100vh-5rem)] flex items-center justify-center 
        font-bold text-xl sm:text-4xl"
    >
      {t('message')}
    </h1>
  );
}
