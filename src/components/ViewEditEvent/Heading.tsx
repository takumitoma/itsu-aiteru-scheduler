import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface HeadingProps {
  title: string;
  eventCreationTimeAgo: string;
}

export default function Heading({ title, eventCreationTimeAgo }: HeadingProps) {
  const t = useTranslations('ViewEditEvent.Heading');
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  return (
    <div
      className="relative flex justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative inline-block">
        <h1 className="text-center">{title}</h1>
        <div className="absolute bottom-[-8px] left-0 w-full h-1 bg-primary" />
      </div>
      {isHovered && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-background 
            border border-foreground rounded-md text-xs sm:text-sm text-gray-600 
            whitespace-nowrap"
        >
          {t('createdTimeAgo', { timeAgo: eventCreationTimeAgo })}
        </div>
      )}
    </div>
  );
}
