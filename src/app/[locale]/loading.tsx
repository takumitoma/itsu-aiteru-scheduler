import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('Loading');

  return (
    <h1 className="flex h-[calc(100vh-5rem)] items-center justify-center text-xl font-bold sm:text-4xl">
      {t('message')}
    </h1>
  );
}
