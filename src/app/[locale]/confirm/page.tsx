import { getTranslations } from 'next-intl/server';

export default async function ConfirmEmailPage() {
  const t = await getTranslations('ConfirmEmail');

  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-8">
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        {t('title')}
      </h1>
      <section className="w-full space-y-4">
        <p>{t('description')}</p>
        <p>{t('newFeatures')}</p>
        <ul className="ml-8 list-outside list-disc space-y-2">
          <li>{t('featureNotification')}</li>
          <li>{t('featurePassword')}</li>
          <li>{t('featureHistory')}</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">{t('comingSoon')}</p>
      </section>
    </section>
  );
}
