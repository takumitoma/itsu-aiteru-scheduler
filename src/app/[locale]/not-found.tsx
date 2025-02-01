import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold sm:text-6xl md:text-8xl">404</h1>
      <h2 className="text-base font-bold sm:text-lg md:text-2xl">{t('message')}</h2>
    </div>
  );
}
