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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex w-full flex-col space-y-4 ${className}`}>
      <div className="flex justify-between">
        <label htmlFor="password" className="">
          {t('label')}
        </label>
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="rounded-full p-1 hover:bg-grayCustom"
        >
          {showPassword ? <BiSolidHide size={24} /> : <BiSolidShow size={24} />}
        </button>
      </div>
      <input
        type={showPassword ? 'text' : 'password'}
        maxLength={16}
        id="password"
        className="border border-primary"
        {...register}
      />
    </div>
  );
}
