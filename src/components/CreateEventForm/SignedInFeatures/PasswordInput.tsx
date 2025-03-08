// import { BsExclamationCircle } from "react-icons/bs"

interface PasswordInputProps {
  className: string;
}

export function PasswordInput({ className }: PasswordInputProps) {
  return (
    <div className={`flex w-full flex-col space-y-4 ${className}`}>
      <label htmlFor="password" className="">
        Password
      </label>
      <input type="password" id="password" className="border border-primary" />
      {/* edit error part after fixing form registers and type Event */}
      {/* {error && (
        <div className="flex items-center space-x-2 pt-4 text-red-500">
          <BsExclamationCircle size={20} />
          <p className="text-sm font-semibold">Password cannot exceed 16 characters</p>
        </div>
      )} */}
    </div>
  );
}
