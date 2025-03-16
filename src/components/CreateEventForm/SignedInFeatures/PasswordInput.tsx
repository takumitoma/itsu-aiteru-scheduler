import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { type UseFormRegisterReturn } from 'react-hook-form';

import { BiSolidShow, BiSolidHide } from 'react-icons/bi';

interface PasswordInputProps {
  className: string;
  register: UseFormRegisterReturn;
  disabled: boolean;
}

export function PasswordInput({ className, register, disabled }: PasswordInputProps) {
  const t = useTranslations('CreateEvent.SignedInFeatures.PasswordInput');

  const [hidePassword, setHidePassword] = useState(true);

  return (
    <div className={`flex w-full flex-col space-y-4 ${className} ${disabled && 'opacity-50'}`}>
      <div className="flex justify-between">
        <label htmlFor="event-password" className="">
          {t('label')}
        </label>
        <button
          type="button"
          onClick={() => setHidePassword((prev) => !prev)}
          className="rounded-full p-1 hover:bg-grayCustom disabled:cursor-not-allowed"
          disabled={disabled}
        >
          {hidePassword ? <BiSolidShow size={24} /> : <BiSolidHide size={24} />}
        </button>
      </div>
      <input
        type="text"
        maxLength={16}
        id="event-password"
        className={`border border-primary disabled:cursor-not-allowed ${hidePassword && 'hide-password'}`}
        autoComplete="off"
        {...register}
        disabled={disabled}
      />
    </div>
  );
}
