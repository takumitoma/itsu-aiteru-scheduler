'use client';

import { useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BsExclamationCircle } from 'react-icons/bs';
import { useTranslations } from 'next-intl';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormFields = z.infer<typeof schema>;

export function SignUpForm() {
  const t = useTranslations('SignUp');
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(data);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
      <div className="space-y-2">
        <label htmlFor="email" className="block">
          {t('email')}
          <input
            id="email"
            type="text"
            className={`mt-4 font-normal text-base w-full ${errors.email ? 'border-red-500' : ''}`}
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
        {isSubmitting ? t('signingUp') : t('signUp')}
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
  );
}
