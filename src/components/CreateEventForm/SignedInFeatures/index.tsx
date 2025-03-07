import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export function SignedInFeatures() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="border border-grayCustom p-2">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-lg font-semibold sm:text-xl">Advanced options</span>
        <FaChevronDown />
      </button>
      {isOpen && <div className="flex h-36 items-center justify-center">dropdown content</div>}
    </section>
  );
}
