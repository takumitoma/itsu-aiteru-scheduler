'use client';

import { useState, useRef } from 'react';

const FORM_LIMITS = {
  name: 50,
  email: 254,
  message: 500,
};

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

const ContactPage: React.FC = () => {
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
      throw Error('お名前を入力してください。');
    }
    if (formData.name.length > FORM_LIMITS.name) {
      throw Error(`お名前は${FORM_LIMITS.name}文字以内で入力してください。`);
    }
    if (formData.email && formData.email.length > FORM_LIMITS.email) {
      throw Error(`メールアドレスは${FORM_LIMITS.email}文字以内で入力してください。`);
    }
    if (!formData.message) {
      throw Error('お問い合わせ詳細を入力してください。');
    }
    if (formData.message.length > FORM_LIMITS.message) {
      throw Error(`お問い合わせ詳細は${FORM_LIMITS.message}文字以内で入力してください。`);
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
        お問い合わせ
      </h1>
      <div className="space-y-4">
        <p>
          {`当サイトをご利用いただき、誠にありがとうございます。サービス向上のため、皆様からのご意見・ご感想をお待ちしております。
            いただいたフィードバックは一つ一つ丁寧に確認させていただき、できる限り対応させていただきます。`}
        </p>
        <p>その他のお問い合わせにつきましても、フォームをご利用ください。</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        <label htmlFor="name" className="block">
          <div className="flex items-center gap-2">
            お名前
            <span className="text-sm bg-red-500 px-1 text-white rounded-md">必須</span>
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
          メールアドレス
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
            お問い合わせ詳細
            <span className="text-sm bg-red-500 px-1 text-white rounded-md">必須</span>
          </div>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            maxLength={FORM_LIMITS.message}
            required
            rows={7}
            className="w-full px-3 py-2 border rounded-md shadow-sm mt-4 font-normal text-base 
              bg-primaryVeryLight focus:outline-none focus:ring-2 focus:ring-primary 
              border-primary"
          />
          <div className="text-sm text-gray-500">
            {form.message.length}/{FORM_LIMITS.message}文字
          </div>
        </label>
        {errorMsg && <div className="text-red-500 text-center">{errorMsg}</div>}
        {showSuccess && (
          <div className="text-green-500 text-center">
            お問い合わせを受け付けました。ありがとうございます。
          </div>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`three-d w-[140px] sm:w-[152px] mt-4 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? '送信中' : 'お問い合わせ'}
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
};

export default ContactPage;
