'use client';

import { useLocale } from 'next-intl';

import { TransitionLink } from '@/components/TransitionLink';
import { Event } from '@/types/Event';

import { FaRegTrashAlt } from 'react-icons/fa';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'http://localhost:3000';

const events: Event[] = [
  {
    id: '123456',
    title: 'Event 1',
    surveyType: 'specific',
    timezone: 'Asia/Tokyo',
    timeRangeStart: 9,
    timeRangeEnd: 18,
    dates: ['4/1/2025', '4/2/2025', '4/3/2025'],
    daysOfWeek: null,
    createdAt: new Date(2025, 4, 1),
  },
  {
    id: '222222',
    title: 'Event 2',
    surveyType: 'specific',
    timezone: 'Asia/Tokyo',
    timeRangeStart: 9,
    timeRangeEnd: 13,
    dates: ['4/17/2025', '4/18/2025', '4/19/2025'],
    daysOfWeek: null,
    createdAt: new Date(2025, 2, 5),
  },
  {
    id: '333333',
    title: 'Event 3',
    surveyType: 'specific',
    timezone: 'Asia/Tokyo',
    timeRangeStart: 10,
    timeRangeEnd: 21,
    dates: ['5/1/2025', '5/2/2025'],
    daysOfWeek: null,
    createdAt: new Date(2025, 3, 25),
  },
];

export function EventCard({ event }: { event: Event }) {
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

export default function HistoryPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center space-y-8">
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        View History
      </h1>
      <div className="w-full space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <button className="flex items-center space-x-2 rounded border border-grayCustom p-2 hover:bg-grayCustom">
        <FaRegTrashAlt />
        <p className="font-medium">Clear all view history</p>
      </button>
    </section>
  );
}
