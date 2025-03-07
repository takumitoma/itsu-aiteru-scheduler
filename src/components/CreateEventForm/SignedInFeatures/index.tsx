import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export function SignedInFeatures() {
  const [isOpen, setIsOpen] = useState(false);

  // necessary for dropdown open close animation
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  return (
    <section className="border border-grayCustom p-2">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded"
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
        <div ref={contentRef} className="flex items-center justify-center py-8">
          dropdown content
        </div>
      </div>
    </section>
  );
}
