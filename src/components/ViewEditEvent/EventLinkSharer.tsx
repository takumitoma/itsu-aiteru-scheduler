import { useState, useEffect, useRef } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface EventLinkSharerProps {
  link: string;
}

export function EventLinkSharer({ link }: EventLinkSharerProps) {
  const t = useTranslations('ViewEditEvent.EventLinkSharer');
  const [copied, setCopied] = useState(false);

  // used to unfocus buttons on click
  const buttonRef = useRef<HTMLButtonElement>(null);

  function copyToClipboard() {
    buttonRef.current?.blur();
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
      })
      .catch(() => {});
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <section className="w-full space-y-2">
      <label htmlFor="event-link">{t('label')}</label>
      <p className="text-xs text-gray-600 sm:text-sm">{t('description')}</p>
      <div
        id="event-link-container"
        className="flex w-full items-center justify-between rounded border border-primary bg-primaryVeryLight p-2 px-3"
      >
        <input
          type="text"
          id="event-link"
          value={link}
          readOnly
          className="mr-4 w-full border-none bg-transparent text-sm outline-none sm:text-lg"
        />
        <button
          ref={buttonRef}
          className="btn-primary flex flex-shrink-0 items-center justify-center space-x-2 px-3 text-sm sm:text-lg"
          type="button"
          onClick={copyToClipboard}
        >
          {copied ? <FaCheck /> : <IoCopyOutline />}
          <span>{copied ? t('copiedButton') : t('copyButton')}</span>
        </button>
      </div>
    </section>
  );
}
