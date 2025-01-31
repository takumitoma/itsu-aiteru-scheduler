import { SignUpForm } from '@/components/SignUpForm';
import { getTranslations } from 'next-intl/server';
import { TransitionLink } from '@/components/TransitionLink';

export default async function SignUpPage() {
  const t = await getTranslations('SignUp');

  return (
    <section
      className="flex flex-col items-center justify-center space-y-8 max-w-md 
        w-full mx-auto"
    >
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        {t('createAccount')}
      </h1>
      <section className="w-full space-y-2">
        <p>{t('accountOptional')}</p>
        <ul className="list-disc list-outside ml-8 space-y-2">
          <li>{t('featureNotification')}</li>
          <li>{t('featurePassword')}</li>
          <li>{t('featureHistory')}</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">{t('comingSoon')}</p>
      </section>
      <SignUpForm />
      <div className="flex justify-between text-primary w-full">
        <p className="text-gray-500">Forgot password?</p>
        <TransitionLink href="/login">Log in</TransitionLink>
      </div>
    </section>
  );
}
