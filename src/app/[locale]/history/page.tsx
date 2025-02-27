import { cookies } from 'next/headers';

import { EventHistory } from '@/components/EventHistory';
import { Event } from '@/types/Event';

import { EVENT_HISTORY_COOKIE_NAME } from '@/constants/event-history-cookie';

export default function HistoryPage() {
  const cookieStore = cookies();
  const historyCookie = cookieStore.get(EVENT_HISTORY_COOKIE_NAME);
  let eventHistory: Event[] = [];

  if (historyCookie) {
    try {
      // parse the cookie and convert createdAt to a date object
      const parsedHistory: Event[] = JSON.parse(historyCookie.value);
      eventHistory = parsedHistory.map((event) => ({
        ...event,
        createdAt: new Date(event.createdAt),
      }));
    } catch (error) {
      console.error('Event history cookie is broken', error);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col items-center space-y-8">
      <h1 className="underline decoration-primary decoration-4 underline-offset-[16px]">
        View History
      </h1>
      <EventHistory eventHistory={eventHistory} />
    </section>
  );
}
