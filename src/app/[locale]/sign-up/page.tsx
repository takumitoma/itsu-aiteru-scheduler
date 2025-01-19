import { SignUpForm } from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <section
      className="flex flex-col items-center justify-center space-y-8 max-w-xl 
        w-full mx-auto"
    >
      <h1 className="underline underline-offset-[16px] decoration-primary decoration-4">
        Create a free account
      </h1>
      <section className="w-full space-y-2">
        <p>Most features work without an account. Sign up for extras:</p>
        <ul className="list-disc list-outside ml-8 space-y-2">
          <li>Get notified when event reaches X participants</li>
          <li>Add password to your events</li>
          <li>See your event history</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">More features coming soon.</p>
      </section>
      <SignUpForm />
    </section>
  );
}
