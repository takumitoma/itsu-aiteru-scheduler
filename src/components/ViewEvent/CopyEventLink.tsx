'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';

interface CopyEventLinkProps {
  link: string;
}

const CopyEventLink: React.FC<CopyEventLinkProps> = ({ link }) => {
  const [copied, setCopied] = useState(false);

  // used to unfocus buttons on click
  const buttonRef = useRef<HTMLButtonElement>(null);

  const copyToClipboard = useCallback(() => {
    buttonRef.current?.blur();
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
      })
      .catch(() => {});
  }, [link]);

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
    <section className="max-w-3xl w-full">
      <label htmlFor="event-link" className="text-xl font-medium">
        このイベントのリンク
      </label>
      <p className="text-sm mt-2 text-gray-600">
        リンクを共有して、他の参加者が空いている時間を入力できるようにしましょう。
      </p>
      <div
        className="border border-primary w-full rounded-md shadow-sm bg-primaryVeryLight 
          text-customBlack flex justify-between items-center py-2 px-4 mt-2"
      >
        <input
          type="text"
          id="event-link"
          value={link}
          readOnly
          className="bg-transparent border-none outline-none w-full mr-4"
        />
        <button
          ref={buttonRef}
          className="text-white bg-primary px-4 py-2 rounded-md flex-shrink-0 w-[136px] 
            flex items-center space-x-2 hover:bg-primaryHover focus:bg-primaryHover"
          type="button"
          onClick={copyToClipboard}
        >
          {copied ? <FaCheck /> : <IoCopyOutline />}
          <span>{copied ? 'コピー完了' : 'コピーする'}</span>
        </button>
      </div>
    </section>
  );
};

export default CopyEventLink;
