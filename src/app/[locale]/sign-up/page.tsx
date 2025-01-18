'use client';

import { useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormFields = z.infer<typeof schema>;

export default function SignUpPage() {
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(data);
  };

  return (
    <section className="flex flex-col items-center justify-center space-y-8 max-w-xl w-full mx-auto">
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        Create a free account now
      </h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="space-y-2">
          <label htmlFor="email" className="block">
            Email
            <input
              id="email"
              type="text"
              className={`mt-4 font-normal text-base w-full ${errors.email ? 'border-red-500' : ''}`}
              {...register('email')}
            />
          </label>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block">
            Password
            <input
              id="password"
              type="password"
              className={`mt-4 font-normal text-base w-full ${errors.password ? 'border-red-500' : ''}`}
              {...register('password')}
            />
          </label>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`three-d w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </button>

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
    </section>
  );
}
