'use client';

import { useState, useRef } from 'react';

interface Form {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [form, setForm] = useState<Form>({
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

  function formIsValid(formData: Form): void {
    if (honeypotRef.current?.checked) {
      throw Error('Invalid submission');
    }
    if (!formData.name) {
      throw Error('お名前を入力してください。');
    }
    if (!formData.message) {
      throw Error('お問い合わせ詳細を入力してください。');
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
          当サイトをご利用いただき、誠にありがとうございます。サービス向上のため、皆様からのご意見・ご感想をお待ちしております。いただいたフィードバックは一つ一つ丁寧に確認させていただき、できる限り対応させていただきます。
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
            required
            rows={7}
            className="w-full px-3 py-2 border rounded-md shadow-sm mt-4 font-normal text-base 
                bg-primaryVeryLight focus:outline-none focus:ring-2 focus:ring-primary 
                border-primary"
          />
        </label>
        {/* {showSuccess && <FormSuccess />}
        {showFail && <FormFail />} */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-primary text-white text-lg sm:text-xl text-center px-4 py-4 mt-4 
              rounded-md w-[140px] sm:w-[152px] outline-customBlack outline-4 three-d ${
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
