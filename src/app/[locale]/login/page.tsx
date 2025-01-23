'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BsExclamationCircle } from 'react-icons/bs';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Please enter your password'),
});

type FormFields = z.infer<typeof schema>;

export default function LoginPage() {
  const t = useTranslations('Login');
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [showLoginFail, setShowLoginFail] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setShowLoginFail(false);
    console.log(data);
    // mock auth
    const success = false;

    if (!success) {
      setShowLoginFail(true);
      reset({ password: '' });
      return;
    }

    // successful login below
  };

  return (
    <section
      className="flex flex-col items-center justify-center space-y-8 max-w-xl 
      w-full mx-auto"
    >
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        {t('login')}
      </h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="space-y-2">
          {showLoginFail && (
            <div className="flex text-red-500 space-x-2 font-semibold text-lg sm:text-xl pb-4">
              <BsExclamationCircle />
              <p className="text-sm">{t('loginFail')}</p>
            </div>
          )}
          <label htmlFor="email" className="block">
            {t('email')}
            <input
              id="email"
              type="text"
              className={`mt-4 font-normal text-base w-full ${
                errors.email ? 'border-red-500' : ''
              }`}
              {...register('email')}
            />
          </label>
          {errors.email && (
            <div className="flex text-red-500 space-x-2 font-semibold text-lg sm:text-xl">
              <BsExclamationCircle />
              <p className="text-sm">{t('emailError')}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block">
            {t('password')}
            <input
              id="password"
              type="password"
              className={`mt-4 font-normal text-base w-full ${
                errors.password ? 'border-red-500' : ''
              }`}
              {...register('password')}
            />
          </label>
          {errors.password && (
            <div className="flex text-red-500 space-x-2 font-semibold text-lg sm:text-xl">
              <BsExclamationCircle />
              <p className="text-sm">{t('passwordError')}</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`three-d w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? t('loggingIn') : t('login')}
        </button>

        {/* Honeypot */}
        <input
          type="checkbox"
          name="contact_me_by_fax_only"
          ref={honeypotRef}
          tabIndex={-1}
          className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
          aria-hidden="true"
        />
      </form>
    </section>
  );
}
