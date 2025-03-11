import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { type UseFormRegisterReturn } from 'react-hook-form';

import { BiSolidShow, BiSolidHide } from 'react-icons/bi';

interface PasswordInputProps {
  className: string;
  register: UseFormRegisterReturn;
}

export function PasswordInput({ className, register }: PasswordInputProps) {
  const t = useTranslations('CreateEvent.SignedInFeatures.PasswordInput');

  const [hidePassword, setHidePassword] = useState(true);

  return (
    <div className={`flex w-full flex-col space-y-4 ${className}`}>
      <div className="flex justify-between">
        <label htmlFor="event-password" className="">
          {t('label')}
        </label>
        <button
          type="button"
          onClick={() => setHidePassword((prev) => !prev)}
          className="rounded-full p-1 hover:bg-grayCustom"
        >
          {hidePassword ? <BiSolidShow size={24} /> : <BiSolidHide size={24} />}
        </button>
      </div>
      <input
        type="text"
        maxLength={16}
        id="event-password"
        className={`border border-primary ${hidePassword && 'hide-password'}`}
        autoComplete="off"
        {...register}
      />
    </div>
  );
}
