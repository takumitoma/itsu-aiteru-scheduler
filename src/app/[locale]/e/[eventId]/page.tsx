import { notFound } from 'next/navigation';

import { getEventPassword } from '@/lib/cookies/event-password';
import { EventPasswordForm } from '@/components/EventPasswordForm';
import { ViewEditEvent } from '@/components/ViewEditEvent';
import { getEvent } from '@/lib/api-client/event';
import { getParticipants } from '@/lib/api-client/participant';

interface EventPageProps {
  params: { eventId: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventId } = params;

  try {
    const passwordCookie = getEventPassword(eventId);

    const event = passwordCookie
      ? await getEvent(eventId, passwordCookie)
      : await getEvent(eventId);

    if (!event) {
      notFound();
    }

    const participants = await getParticipants(eventId);

    return (
      <div className="flex flex-col items-center">
        <ViewEditEvent event={event} participants={participants} />
      </div>
    );
  } catch (error) {
    if ((error as Error).message === 'Event not found') {
      notFound();
    } else if (
      (error as Error).message === 'Password required but was not provided' ||
      (error as Error).message === 'Incorrect password'
    ) {
      return (
        <EventPasswordForm
          eventId={eventId}
          passwordIncorrect={(error as Error).message === 'Incorrect password'}
        />
      );
    }
    // catch errors with error.tsx
    throw error;
  }
}
