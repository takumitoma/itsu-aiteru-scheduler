import { getTranslations } from 'next-intl/server';

import { EventHistory } from '@/components/EventHistory';

export default async function HistoryPage() {
  const t = await getTranslations('History');

  return (
    <section className="mx-auto flex max-w-[470px] flex-col items-center space-y-12">
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        {t('title')}
      </h1>
      <EventHistory />
    </section>
  );
}
