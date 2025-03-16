'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';

import { useTimeFormatContext } from '@/providers/TimeFormatContext';

import { getEventHistory, clearEventHistory } from '@/utils/event-history';
import { TransitionLink } from '@/components/TransitionLink';

import { type EventGet } from '@/types/Event';

import { FaRegTrashAlt } from 'react-icons/fa';

import { daysOfWeekKeys } from '@/constants/days';
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'http://localhost:3000';

function EventCard({ event }: { event: EventGet }) {
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
    <article className="flex flex-col rounded border border-grayCustom">
      <h2 className="truncate px-3 py-3 text-lg font-medium">{event.title}</h2>

      <table className="w-full border-t border-grayCustom">
        <tbody>
          <tr className="flex flex-col sm:table-row">
            <td className="whitespace-nowrap border-grayCustom px-3 pt-3 align-top font-medium sm:border-r">
              {t('dateLabel')}
            </td>
            <td className="px-3 sm:pt-3">
              {event.dates && (
                <>
                  {formatDates(event.dates, 'specific').slice(0, 14).join(', ')}
                  {event.dates.length > 14 && (
                    <>
                      {' '}
                      <span className="whitespace-nowrap">
                        {t('more', { count: event.dates.length - 14 })}
                      </span>
                    </>
                  )}
                </>
              )}
              {event.daysOfWeek && formatDaysOfWeek(event.daysOfWeek).join(', ')}
            </td>
          </tr>

          <tr className="flex flex-col sm:table-row">
            <td className="whitespace-nowrap border-grayCustom px-3 font-medium sm:border-r">
              {t('timeLabel')}
            </td>
            <td className="px-3 pt-1">
              {`${formatTimeDisplay(event.timeRangeStart)} - ${formatTimeDisplay(event.timeRangeEnd)}`}
            </td>
          </tr>

          <tr className="flex flex-col sm:table-row">
            <td className="whitespace-nowrap border-grayCustom px-3 font-medium sm:border-r">
              {t('timezoneLabel')}
            </td>
            <td className="px-3 pt-1">{timezoneT(event.timezone)}</td>
          </tr>

          <tr className="flex flex-col sm:table-row">
            <td className="whitespace-nowrap border-grayCustom px-3 font-medium sm:border-r">
              {t('createdAtLabel')}
            </td>
            <td className="px-3 pt-1">
              {formatDate(event.createdAt.toISOString().split('T')[0], 'specific')}
            </td>
          </tr>

          <tr className="flex flex-col sm:table-row">
            <td className="whitespace-nowrap border-grayCustom px-3 align-top font-medium sm:border-r">
              {t('urlLabel')}
            </td>
            <td className="overflow-wrap-anywhere break-all px-3 pb-3 pt-1">
              <TransitionLink href={`/e/${event.id}`} className="text-primary underline">
                {getEventUrl(event.id)}
              </TransitionLink>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}

export function EventHistory() {
  const t = useTranslations('History');

  const [eventHistory, setEventHistory] = useState<EventGet[]>([]);
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
    <div className="flex w-full flex-col items-center space-y-8">
      <div className="max-w-full space-y-4">
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
        <p className="font-medium">{t('clearHistory')}</p>
      </button>
    </div>
  );
}
