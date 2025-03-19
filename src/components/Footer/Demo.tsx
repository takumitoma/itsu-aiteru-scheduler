import { useTranslations } from 'next-intl';

import { TransitionLink } from '@/components/TransitionLink';

export function Demo() {
  const t = useTranslations('Footer.Demo');

  return (
    <section className="flex flex-col space-y-4">
      <h4 className="font-semibold">{t('title')}</h4>
      <p className="text-sm">{t('description')}</p>
      <TransitionLink
        href={`/e/${t('demoEventLink')}`}
        className="btn-primary flex w-[120px] justify-center text-sm"
      >
        {t('buttonText')}
      </TransitionLink>
    </section>
  );
}
