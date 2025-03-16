import { getTranslations } from 'next-intl/server';
import { CreateEventForm } from '@/components/CreateEventForm';
import { LoginOutMessage } from '@/components/LoginMessage';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function CreateEventPage() {
  const t = await getTranslations('CreateEvent');

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = user !== null;

  return (
    <div className="flex flex-col items-center space-y-8">
      <LoginOutMessage />
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        {t('pageTitle')}
      </h1>
      <CreateEventForm isLoggedIn={isLoggedIn} />
    </div>
  );
}
