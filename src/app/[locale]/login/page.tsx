import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/LoginForm';
import { TransitionLink } from '@/components/TransitionLink';

export default async function LoginPage() {
  const t = await getTranslations('Login');

  return (
    <section
      className="flex flex-col items-center justify-center space-y-8 max-w-md 
      w-full mx-auto"
    >
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        {t('login')}
      </h1>
      <LoginForm />
      <div className="flex justify-between text-primary w-full">
        <p className="text-gray-500">Forgot password?</p>
        <TransitionLink href="/sign-up">Sign up</TransitionLink>
      </div>
    </section>
  );
}
