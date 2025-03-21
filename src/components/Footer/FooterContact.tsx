import { useRef } from 'react';
import { Link } from '@/i18n/routing';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BsExclamationCircle } from 'react-icons/bs';

const FORM_LIMIT = 500;

const schema = z.object({
  message: z.string().min(1).max(FORM_LIMIT),
});

type FormFields = z.infer<typeof schema>;

export function FooterContact() {
  const t = useTranslations('Footer.FooterContact');
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
    <div className="flex flex-col space-y-4">
      <h4 className="font-semibold">{t('title')}</h4>
      <p className="text-sm">
        <span>{t('description.linkPrefix')} </span>
        <Link href="/contact" className="text-primary">
          {t('description.linkText')}
        </Link>
        <span> {t('description.linkSuffix')}</span>
      </p>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="relative">
          <textarea
            rows={3}
            className="w-full resize-none rounded border p-2 text-sm"
            {...register('message')}
          />
          <p className="absolute bottom-2 right-2 text-xs text-gray-500">
            {t('form.message.characterCount', {
              current: messageLength,
              limit: FORM_LIMIT,
            })}
          </p>
        </div>

        {errors.message && (
          <div className="flex items-center space-x-1 text-red-500">
            <BsExclamationCircle />
            <p className="text-xs font-semibold">
              {errors.message.type === 'too_small'
                ? t('form.errors.required')
                : t('form.errors.maxLength', { limit: FORM_LIMIT })}
            </p>
          </div>
        )}

        {isSubmitSuccessful && (
          <div className="text-xs text-green-500">{t('form.response.success')}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-[100px] text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? t('form.submit.sending') : t('form.submit.button')}
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
    </div>
  );
}
