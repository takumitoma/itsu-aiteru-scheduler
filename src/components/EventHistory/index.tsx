'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';

import { clearEventHistory } from '@/app/actions/event-history';
import { TransitionLink } from '@/components/TransitionLink';
import { Event } from '@/types/Event';

import { FaRegTrashAlt } from 'react-icons/fa';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'http://localhost:3000';

function EventCard({ event }: { event: Event }) {
  const locale = useLocale();

  function getEventUrl(eventId: string) {
    if (locale === 'ja') {
      return `${BASE_URL}/e/${eventId}`;
    }
    return `${BASE_URL}${locale}/e/${eventId}`;
  }

  return (
    <article className="flex flex-col space-y-2 rounded border border-grayCustom p-3">
      <h2 className="text-lg font-medium">{event.title}</h2>
      <dl>
        <div className="flex space-x-1">
          <dt className="font-medium">Event dates:</dt>
          {event.dates && <dd>{event.dates.join(', ')}</dd>}
          {event.daysOfWeek && <dd>{event.daysOfWeek.join(', ')}</dd>}
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Event time:</dt>
          <dd>{`${event.timeRangeStart} - ${event.timeRangeEnd}`}</dd>
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Event timezone:</dt>
          <dd>{event.timezone}</dd>
        </div>
        <div className="flex space-x-1">
          <dt className="font-medium">Created at:</dt>
          <dd>{event.createdAt.toDateString()}</dd>
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

interface EventHistoryProps {
  eventHistory: Event[];
}

export function EventHistory({ eventHistory }: EventHistoryProps) {
  const [isPending, startTransition] = useTransition();

  async function handleClearHistory() {
    startTransition(async () => {
      await clearEventHistory();
    });
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
        disabled={isPending}
        className={
          'flex items-center space-x-2 rounded border border-grayCustom p-2 hover:bg-grayCustom' +
          'disabled:cursor-not-allowed disabled:opacity-50'
        }
      >
        <FaRegTrashAlt />
        <p className="font-medium">{isPending ? 'Clearing...' : 'Clear all view history'}</p>
      </button>
    </>
  );
}
