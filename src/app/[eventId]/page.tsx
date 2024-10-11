import { notFound } from 'next/navigation';
import ViewEditEvent from '@/components/ViewEditEvent/ViewEditEvent';
import { getEvent } from '../api/event/route';
import { getParticipants } from '../api/participant/route';

interface EventPageProps {
  params: { eventId: string };
}

const EventPage: React.FC<EventPageProps> = async ({ params }) => {
  const eventId = params.eventId;

  // catch errors with error.tsx
  try {
    const eventData = await getEvent(eventId);

    if (!eventData) {
      notFound();
    }

    const participantsData = await getParticipants(eventId);

    return (
      <div className="container mx-auto py-8 flex flex-col items-center px-4 sm:px-0">
        <ViewEditEvent eventData={eventData} participantsData={participantsData} />
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
