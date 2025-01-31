'use client';

import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BsExclamationCircle } from 'react-icons/bs';
import { BiSolidShow, BiSolidHide } from 'react-icons/bi';
import { useTranslations } from 'next-intl';

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
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [signUpError, setSignUpError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(data);
    setSignUpError(false);

    try {
      // logic for sign up via supabase, return { error }
      const error = false;

      if (error) {
        setSignUpError(true);
      } else {
        reset();
      }
    } catch (err) {
      setSignUpError(true);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
      <div className="space-y-2">
        <label htmlFor="email" className="block">
          {t('email')}
        </label>
        <input
          id="email"
          type="text"
          disabled={isSubmitSuccessful}
          className="font-normal text-base w-full"
          {...register('email')}
        />
        {errors.email && (
          <div className="flex text-red-500 space-x-2 font-semibold text-lg sm:text-xl">
            <BsExclamationCircle />
            <p className="text-sm">{t('emailError')}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="block">
            {t('password')}
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="hover:bg-gray rounded-full p-1 focus:ring-2"
          >
            {showPassword ? <BiSolidHide size={24} /> : <BiSolidShow size={24} />}
          </button>
        </div>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          disabled={isSubmitSuccessful}
          className="font-normal text-base w-full"
          {...register('password')}
        />
        {errors.password && (
          <div className="flex text-red-500 space-x-2 font-semibold text-lg sm:text-xl">
            <BsExclamationCircle />
            <p className="text-sm">{t('passwordError')}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="hover:bg-gray rounded-full p-1 focus:ring-2"
          >
            {showConfirmPassword ? <BiSolidHide size={24} /> : <BiSolidShow size={24} />}
          </button>
        </div>
        <input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          disabled={isSubmitSuccessful}
          className="font-normal text-base w-full"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <div className="flex text-red-500 space-x-2 font-semibold text-lg sm:text-xl">
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
          <p className="text-sm w-full text-center text-red-500 font-semibold">
            {t('signUpError')}
          </p>
        </div>
      )}

      {isSubmitSuccessful && (
        <div className="flex">
          <p className="text-sm w-full text-center text-green-500 font-semibold">
            {t('signUpSuccess')}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isSubmitSuccessful}
        className={`three-d w-full ${
          isSubmitting || isSubmitSuccessful ? 'opacity-50 cursor-not-allowed' : ''
        }`}
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
