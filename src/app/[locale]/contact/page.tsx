'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, FieldError } from 'react-hook-form';
import { z } from 'zod';
import { BsExclamationCircle } from 'react-icons/bs';

const FORM_LIMITS = {
  name: 50,
  email: 254,
  message: 500,
} as const;

const schema = z.object({
  name: z.string().max(FORM_LIMITS.name).optional().or(z.literal('')),
  email: z.string().email().max(FORM_LIMITS.email).optional().or(z.literal('')),
  message: z.string().min(1).max(FORM_LIMITS.message),
});

type FormFields = z.infer<typeof schema>;

function FormErrorMessage({
  error,
  field,
}: {
  error?: FieldError;
  field: 'name' | 'email' | 'message';
}) {
  const t = useTranslations('Contact.form.errors');

  if (!error) return null;

  const getMessage = () => {
    switch (error.type) {
      case 'too_small':
        return t(`${field}.required`);
      case 'too_big':
        return t(`${field}.maxLength`, { limit: FORM_LIMITS[field] });
      case 'invalid_string':
        return t(`${field}.invalid`);
      default:
        return error.message;
    }
  };

  return (
    <div className="flex text-red-500 pt-2 space-x-2">
      <BsExclamationCircle />
      <p className="text-sm">{getMessage()}</p>
    </div>
  );
}

export default function ContactPage() {
  const t = useTranslations('Contact');
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const messageLength = watch('message')?.length || 0;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (honeypotRef.current?.checked) {
      return;
    }

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: 'a43d0e1a-51d3-422b-ac51-ce928b96f9fa',
          ...data,
        }),
      });

      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        {t('pageTitle')}
      </h1>
      <div className="space-y-4 w-full text-left">
        <p>{t('description.gratitude')}</p>
        <p>{t('description.promise')}</p>
        <p>{t('description.other')}</p>
        <p>{t('description.optional')}</p>
      </div>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
        <label htmlFor="name" className="block">
          {t('form.name.label')}
          <input
            id="name"
            type="text"
            className="mt-4 font-normal text-base"
            {...register('name')}
          />
          <FormErrorMessage error={errors.name} field="name" />
        </label>

        <label htmlFor="email" className="block">
          {t('form.email.label')}
          <input
            id="email"
            type="email"
            className="mt-4 font-normal text-base"
            {...register('email')}
          />
          <FormErrorMessage error={errors.email} field="email" />
        </label>

        <label htmlFor="message" className="block">
          <div className="flex items-center gap-2">
            {t('form.message.label')}
            <span className="text-sm bg-red-500 px-1 text-white rounded-md">
              {t('form.message.required')}
            </span>
          </div>
          <textarea
            id="message"
            rows={7}
            className="w-full mt-4 font-normal text-base"
            {...register('message')}
          />
          <div className="text-sm text-gray-500">
            {t('form.message.characterCount', {
              current: messageLength,
              limit: FORM_LIMITS.message,
            })}
          </div>
          <FormErrorMessage error={errors.message} field="message" />
        </label>

        {isSubmitSuccessful && (
          <div className="text-green-500 text-center">{t('form.response.success')}</div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`three-d w-[152px] sm:w-[164px] mt-4 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? t('form.submit.sending') : t('form.submit.button')}
          </button>
        </div>

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
    </div>
  );
}
