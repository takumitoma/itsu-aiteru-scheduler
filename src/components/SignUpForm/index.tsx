'use client';

import { useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/browser-client';

import { BsExclamationCircle } from 'react-icons/bs';
import { BiSolidShow, BiSolidHide } from 'react-icons/bi';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'http://localhost:3000';

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormFields = z.infer<typeof schema>;

export function SignUpForm() {
  const t = useTranslations('SignUp');
  const locale = useLocale();

  const [signUpError, setSignUpError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const honeypotRef = useRef<HTMLInputElement>(null);

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
      confirmPassword: '',
    },
  });

  function getRedirectUrl() {
    if (locale === 'ja') {
      return `${BASE_URL}/confirm`;
    } else {
      return `${BASE_URL}/${locale}/confirm`;
    }
  }

  async function signUpUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });

    return { data, error };
  }

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    setSignUpError(false);
    setSignUpSuccess(false);

    return;

    const { data: authData, error } = await signUpUser(formData.email, formData.password);

    if (error) {
      setSignUpError(true);
      return;
    }

    if (authData) {
      console.log(authData);
      setSignUpSuccess(true);
      reset();
    }
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
          disabled={signUpSuccess}
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
          disabled={signUpSuccess}
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="rounded-full p-1 hover:bg-grayCustom focus:ring-2"
          >
            {showConfirmPassword ? <BiSolidHide size={24} /> : <BiSolidShow size={24} />}
          </button>
        </div>
        <input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          disabled
          // disabled={signUpSuccess}
          className="w-full text-base font-normal"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <div className="flex space-x-2 text-lg font-semibold text-red-500 sm:text-xl">
            <BsExclamationCircle />
            {errors.confirmPassword.message === 'Passwords do not match' ? (
              <p className="text-sm">{t('passwordMismatchError')}</p>
            ) : (
              <p className="text-sm">{t('passwordError')}</p>
            )}
          </div>
        )}
      </div>

      {signUpError && (
        <div className="flex">
          <p className="w-full text-center text-sm font-semibold text-red-500">
            {t('signUpError')}
          </p>
        </div>
      )}

      {signUpSuccess && (
        <div className="flex">
          <p className="w-full text-center text-sm font-semibold text-green-500">
            {t('signUpSuccess')}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || signUpSuccess}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t('signingUp') : t('signUp')}
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
