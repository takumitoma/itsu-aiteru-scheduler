import { useState, useEffect, useRef } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';

interface EventLinkSharerProps {
  link: string;
}

const EventLinkSharer: React.FC<EventLinkSharerProps> = ({ link }) => {
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
      <label htmlFor="event-link">このイベントのリンク</label>
      <p className="text-xs sm:text-sm text-gray-600">
        リンクを共有して、他の参加者がそれぞれ空き時間を記入できるようにしよう!
      </p>
      <div
        className="border border-primary w-full rounded-md shadow-sm bg-primaryVeryLight 
          text-customBlack flex justify-between items-center py-2 px-3"
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
          className="text-white bg-primary px-2 py-1 sm:px-4 sm:py-2 rounded-md flex-shrink-0 
            flex items-center sm:space-x-2 hover:bg-primaryHover focus:bg-primaryHover 
            justify-center"
          type="button"
          onClick={copyToClipboard}
        >
          <div className="hidden sm:block">{copied ? <FaCheck /> : <IoCopyOutline />}</div>
          <span>{copied ? 'コピー完了' : 'コピーする'}</span>
        </button>
      </div>
    </section>
  );
};

export default EventLinkSharer;
