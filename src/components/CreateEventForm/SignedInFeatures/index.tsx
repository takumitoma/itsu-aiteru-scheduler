import { useState, useRef, useEffect } from 'react';

import { PasswordInput } from './PasswordInput';

import { FaChevronDown } from 'react-icons/fa';

export function SignedInFeatures() {
  const [isOpen, setIsOpen] = useState(false);

  // necessary for dropdown open close animation
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <section className="rounded border border-grayCustom p-2">
      <button
        type="button"
        className="flex w-full items-center justify-between"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-lg font-semibold sm:text-xl">Advanced options</span>
        <FaChevronDown
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out`}
        style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px' }}
      >
        <div ref={contentRef} className="grid grid-cols-1 gap-x-16 pt-6 md:grid-cols-2">
          <PasswordInput className="md:order-1" />
          <div className="hidden md:order-2 md:block" />
        </div>
      </div>
    </section>
  );
}
