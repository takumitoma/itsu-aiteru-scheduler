'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BsExclamationCircle } from 'react-icons/bs';
import { BiSolidShow, BiSolidHide } from 'react-icons/bi';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Please enter your password'),
});

type FormFields = z.infer<typeof schema>;

export function LoginForm() {
  const t = useTranslations('Login');
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setLoginError(false);
    console.log(data);
    // mock auth
    const success = false;

    if (!success) {
      setLoginError(true);
      reset({ password: '' });
      return;
    }

    // successful login below
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
      <div className="space-y-2">
        <label htmlFor="email" className="block">
          {t('email')}
        </label>
        <input
          id="email"
          type="text"
          className="w-full text-base font-normal"
          {...register('email')}
        />
        {errors.email && (
          <div className="flex space-x-2 text-lg font-semibold text-red-500 sm:text-xl">
            <BsExclamationCircle />
            <p className="text-sm">{t('emailError')}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block">
            {t('password')}
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="rounded-full p-1 hover:bg-grayCustom focus:ring-2"
          >
            {showPassword ? <BiSolidHide size={24} /> : <BiSolidShow size={24} />}
          </button>
        </div>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          className="w-full text-base font-normal"
          {...register('password')}
        />
        {errors.password && (
          <div className="flex space-x-2 text-lg font-semibold text-red-500 sm:text-xl">
            <BsExclamationCircle />
            <p className="text-sm">{t('passwordError')}</p>
          </div>
        )}
      </div>

      {loginError && (
        <div className="flex">
          <p className="w-full text-center text-sm font-semibold text-red-500">{t('loginError')}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t('loggingIn') : t('login')}
      </button>

      {/* Honeypot */}
      <input
        type="checkbox"
        name="contact_me_by_fax_only"
        ref={honeypotRef}
        tabIndex={-1}
        className="pointer-events-none absolute left-0 top-0 h-0 w-0 opacity-0"
        aria-hidden="true"
      />
    </form>
  );
}
