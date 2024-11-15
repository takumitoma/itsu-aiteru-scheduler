import { notFound } from 'next/navigation';
import ViewEditEvent from '@/components/ViewEditEvent/ViewEditEvent';
import { getEvent } from '@/lib/api-client/event';
import { getParticipants } from '@/lib/api-client/participant';

interface EventPageProps {
  params: { eventId: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const eventId = params.eventId;

  // catch errors with error.tsx
  try {
    const event = await getEvent(eventId);

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
    }
    throw error;
  }
}
