import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/LoginForm';
import { TransitionLink } from '@/components/TransitionLink';

export default async function LoginPage() {
  const t = await getTranslations('Login');

  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-8">
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        {t('login')}
      </h1>
      <LoginForm />
      <div className="flex w-full flex-col space-y-4 text-primary sm:flex-row sm:justify-between sm:space-y-0">
        <p className="text-gray-500">{t('forgotPassword')}</p>
        <TransitionLink href="/sign-up">{t('signUp')}</TransitionLink>
      </div>
    </section>
  );
}
