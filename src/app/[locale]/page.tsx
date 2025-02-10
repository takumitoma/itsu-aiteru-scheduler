import { getTranslations } from 'next-intl/server';
import { CreateEventForm } from '@/components/CreateEventForm';
import { LoginOutMessage } from '@/components/LoginMessage';

export default async function CreateEventPage() {
  const t = await getTranslations('CreateEvent');

  return (
    <div className="flex flex-col items-center space-y-8">
      <LoginOutMessage />
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        {t('pageTitle')}
      </h1>
      <CreateEventForm />
    </div>
  );
}
