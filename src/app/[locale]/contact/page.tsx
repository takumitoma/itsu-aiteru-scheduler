'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

const FORM_LIMITS = {
  name: 50,
  email: 254,
  message: 500,
};

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const t = useTranslations('Contact');
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setShowSuccess(false);
    setErrorMsg('');
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function formIsValid(formData: ContactForm): void {
    if (honeypotRef.current?.checked) {
      throw Error('Invalid submission');
    }
    if (!formData.name) {
      throw Error('Please enter your name.');
    }
    if (formData.name.length > FORM_LIMITS.name) {
      throw Error(`Name must be ${FORM_LIMITS.name} characters or less.`);
    }
    if (formData.email && formData.email.length > FORM_LIMITS.email) {
      throw Error(`Email must be ${FORM_LIMITS.email} characters or less.`);
    }
    if (!formData.message) {
      throw Error('Please enter your message.');
    }
    if (formData.message.length > FORM_LIMITS.message) {
      throw Error(`Message must be ${FORM_LIMITS.message} characters or less.`);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      formIsValid(form);
      setIsSubmitting(true);
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: 'a43d0e1a-51d3-422b-ac51-ce928b96f9fa',
          ...form,
        }),
      });
      setForm({ name: '', email: '', message: '' });
      setShowSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        {t('pageTitle')}
      </h1>
      <div className="space-y-4 w-full text-left">
        <p>{t('description.gratitude')}</p>
        <p>{t('description.promise')}</p>
        <p>{t('description.other')}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        <label htmlFor="name" className="block">
          <div className="flex items-center gap-2">
            {t('form.name.label')}
            <span className="text-sm bg-red-500 px-1 text-white rounded-md">
              {t('form.name.required')}
            </span>
          </div>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            maxLength={FORM_LIMITS.name}
            required
            className="mt-4 font-normal text-base"
          />
        </label>
        <label htmlFor="email" className="block">
          {t('form.email.label')}
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            maxLength={FORM_LIMITS.email}
            className="mt-4 font-normal text-base"
          />
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
            name="message"
            value={form.message}
            onChange={handleChange}
            maxLength={FORM_LIMITS.message}
            required
            rows={7}
            className="w-full mt-4 font-normal text-base"
          />
          <div className="text-sm text-gray-500">
            {`${form.message.length}/${FORM_LIMITS.message} ${t('form.message.characterCount')}`}
          </div>
        </label>
        {errorMsg && <div className="text-red-500 text-center">{errorMsg}</div>}
        {showSuccess && (
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
