import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { parseDate, getDateDuration } from '@/utils/date-calculations';

interface HeadingProps {
  title: string;
  createdAt: string | Date;
}

export function Heading({ title, createdAt }: HeadingProps) {
  const t = useTranslations('ViewEditEvent.Heading');
  const [isHovered, setIsHovered] = useState(false);

  const createdTimeAgoText = useMemo(() => {
    const dateEventCreated = parseDate(createdAt);
    const dateNow = new Date();
    const duration = getDateDuration(dateEventCreated, dateNow);

    // in some languages singular and plural are different
    // example: "1 day ago" instead of "1 days ago"
    return t(`createdTimeAgo.${duration.unit}${duration.value === 1 ? '1' : 'X'}`, {
      count: duration.value,
    });
  }, [createdAt, t]);

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
          {createdTimeAgoText}
        </div>
      )}
    </div>
  );
}
