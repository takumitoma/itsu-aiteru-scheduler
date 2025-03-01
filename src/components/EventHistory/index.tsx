'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';

import { useTimeFormatContext } from '@/providers/TimeFormatContext';

import { getEventHistory, clearEventHistory } from '@/utils/event-history';
import { TransitionLink } from '@/components/TransitionLink';
import { Event } from '@/types/Event';

import { FaRegTrashAlt } from 'react-icons/fa';

import { daysOfWeekKeys } from '@/constants/days';
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'http://localhost:3000';

function EventCard({ event }: { event: Event }) {
  const locale = useLocale();
  const { timeFormat } = useTimeFormatContext();
  const timezoneT = useTranslations('constants.Timezones');
  const timeT = useTranslations('ViewEditEvent.TimeLabels');
  const dowT = useTranslations('constants.DaysOfWeek');
  const t = useTranslations('History.event');

  function getEventUrl(eventId: string) {
    if (locale === 'ja') {
      return `${BASE_URL}/e/${eventId}`;
    }
    return `${BASE_URL}${locale}/e/${eventId}`;
  }

  function formatTimeDisplay(hour: number) {
    if (timeFormat === 24) {
      return timeT('time24h', { hour });
    }

    if (hour === 0 || hour === 24) {
      return timeT('midnight');
    }
    if (hour === 12) {
      return timeT('noon');
    }

    const displayHour = hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? timeT('am') : timeT('pm');

    return timeT('time12h', {
      hour: displayHour,
      period,
    });
  }

  function formatDate(date: string, dateType: 'specific' | 'week'): string {
    const [year, month, day] = date.split('-');
    return t(`date.${dateType}`, { year, month, day });
  }

  function formatDates(dates: string[], dateType: 'specific' | 'week'): string[] {
    return dates.map((date) => formatDate(date, dateType));
  }

  const daysOfWeek = daysOfWeekKeys.map((day) => dowT(day));

  function formatDaysOfWeek(selectedDaysOfWeek: number[]) {
    const selectedDOWStr = daysOfWeek.filter((_, index) => selectedDaysOfWeek?.[index] === 1) || [];
    return selectedDOWStr.map((day) => t(`date.week`, { day }));
  }

  return (
    <article className="flex flex-col space-y-2 rounded border border-grayCustom p-3">
      <h2 className="text-lg font-medium">{event.title}</h2>
      <dl>
        <div className="flex space-x-1">
          <dt className="whitespace-nowrap font-medium">Event dates:</dt>
          {event.dates && <dd>{formatDates(event.dates, 'specific').join(', ')}</dd>}
          {event.daysOfWeek && <dd>{formatDaysOfWeek(event.daysOfWeek).join(', ')}</dd>}
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Event time:</dt>
          <dd>{`${formatTimeDisplay(event.timeRangeStart)} - ${formatTimeDisplay(event.timeRangeEnd)}`}</dd>
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Event timezone:</dt>
          <dd>{timezoneT(event.timezone)}</dd>
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Created at:</dt>
          <dd>{formatDate(event.createdAt.toISOString().split('T')[0], 'specific')}</dd>
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Event URL:</dt>
          <dd>
            <TransitionLink href={`/e/${event.id}`} className="text-primary underline">
              {getEventUrl(event.id)}
            </TransitionLink>
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function EventHistory() {
  const [eventHistory, setEventHistory] = useState<Event[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setEventHistory(getEventHistory());
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  function handleClearHistory() {
    startTransition(() => {
      if (clearEventHistory()) {
        setEventHistory([]);
      }
    });
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <div className="w-full space-y-4">
        {eventHistory.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <button
        onClick={handleClearHistory}
        className={
          'flex items-center space-x-2 rounded border border-grayCustom p-2 hover:bg-grayCustom' +
          'disabled:cursor-not-allowed disabled:opacity-50'
        }
        disabled={isPending}
      >
        <FaRegTrashAlt />
        <p className="font-medium">Clear all view history</p>
      </button>
    </>
  );
}
