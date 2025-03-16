import { SignUpForm } from '@/components/SignUpForm';
import { getTranslations } from 'next-intl/server';
import { TransitionLink } from '@/components/TransitionLink';

export default async function SignUpPage() {
  const t = await getTranslations('SignUp');

  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-8">
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        {t('createAccount')}
      </h1>
      <section className="w-full space-y-2">
        <p>{t('accountOptional')}</p>
        <ul className="ml-8 list-outside list-disc space-y-2">
          <li>{t('featurePassword')} </li>
          <li>{t('featureHistory')}</li>
          <li>{t('featureNotification')} (coming soon)</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">{t('comingSoon')}</p>
      </section>
      <SignUpForm />
      <div className="flex w-full flex-col space-y-4 text-primary sm:flex-row sm:justify-between sm:space-y-0">
        <p className="text-gray-500">{t('forgotPassword')}</p>
        <TransitionLink href="/sign-up">{t('login')}</TransitionLink>
      </div>
    </section>
  );
}
