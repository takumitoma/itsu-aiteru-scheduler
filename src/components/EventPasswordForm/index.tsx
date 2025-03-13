'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';

import { submitEventPassword } from '@/app/actions/event-password';

import { BiSolidShow, BiSolidHide } from 'react-icons/bi';

interface EventPasswordFormProps {
  eventId: string;
  passwordIncorrect: boolean;
}

export function EventPasswordForm({ eventId, passwordIncorrect }: EventPasswordFormProps) {
  const router = useRouter();

  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(passwordIncorrect);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (showError) {
      setShowError(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitEventPassword(eventId, password);

      if (result.success) {
        router.refresh();
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col items-center space-y-4">
      <label htmlFor="event-password">Event password</label>

      <p className="w-full">Enter password to view or edit event</p>

      <div className="relative flex w-full">
        <input
          // intentional to prevent browser from storing password
          // the password to store should be user password rather than event password
          maxLength={16}
          id="event-password"
          value={password}
          onChange={handleChange}
          className={`w-full border border-primary pr-10 ${hidePassword && 'hide-password'}`}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setHidePassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full p-1 hover:bg-grayCustom"
        >
          {hidePassword ? <BiSolidShow size={20} /> : <BiSolidHide size={20} />}
        </button>
      </div>

      {showError && <p className="w-full text-sm font-semibold text-red-500">Incorrect password</p>}

      <button
        type="submit"
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        disabled={password.length === 0 || isSubmitting}
      >
        Submit
      </button>
    </form>
  );
}
