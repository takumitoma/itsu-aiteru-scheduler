'use client';
import { useState } from 'react';
import { BiSolidShow, BiSolidHide } from 'react-icons/bi';

export function EventPasswordForm() {
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted with password:', password);
  };

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
          onChange={(e) => setPassword(e.target.value)}
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

      <button
        type="submit"
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit
      </button>
    </form>
  );
}
