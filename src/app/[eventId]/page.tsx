import { notFound } from 'next/navigation';
import ViewEditEvent from '@/components/ViewEditEvent/ViewEditEvent';
import { getEvent } from '@/lib/api-client/event';
import { getParticipants } from '@/lib/api-client/participant';

interface EventPageProps {
  params: { eventId: string };
}

const EventPage: React.FC<EventPageProps> = async ({ params }) => {
  const eventId = params.eventId;

  // catch errors with error.tsx
  try {
    const { event, isFromCache } = await getEvent(eventId);

    if (!event) {
      notFound();
    }

    console.log(`GET event ${event.id} from cache: ${isFromCache}`);

    const participants = await getParticipants(eventId);

    return (
      <div className="container mx-auto py-8 flex flex-col items-center px-4 sm:px-0">
        <ViewEditEvent event={event} participants={participants} />
      </div>
    );
  } catch (error) {
    if ((error as Error).message === 'Event not found') {
      notFound();
    }
    throw error;
  }
};

export default EventPage;
