import { type UseFormRegisterReturn } from 'react-hook-form';

interface PasswordInputProps {
  className: string;
  register: UseFormRegisterReturn;
}

export function PasswordInput({ className, register }: PasswordInputProps) {
  return (
    <div className={`flex w-full flex-col space-y-4 ${className}`}>
      <label htmlFor="password" className="">
        Password
      </label>
      <input
        type="password"
        maxLength={16}
        id="password"
        className="border border-primary"
        {...register}
      />
    </div>
  );
}
