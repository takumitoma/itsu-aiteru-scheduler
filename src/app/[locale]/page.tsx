import { getTranslations } from 'next-intl/server';
import CreateEventForm from '@/components/CreateEventForm/CreateEventForm';

export default async function CreateEvent() {
  const t = await getTranslations('CreateEvent');

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        {t('pageTitle')}
      </h1>
      <CreateEventForm />
    </div>
  );
}
