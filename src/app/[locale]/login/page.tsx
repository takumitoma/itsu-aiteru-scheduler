import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/LoginForm';

export default async function LoginPage() {
  const t = await getTranslations('Login');

  return (
    <section
      className="flex flex-col items-center justify-center space-y-8 max-w-xl 
      w-full mx-auto"
    >
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        {t('login')}
      </h1>
      <LoginForm />
    </section>
  );
}
