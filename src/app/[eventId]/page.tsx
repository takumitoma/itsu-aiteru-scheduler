import { notFound } from 'next/navigation';
import ViewEditEvent from '@/components/ViewEditEvent/ViewEditEvent';
import { getEvent } from '../api/event/route';

interface EventPageProps {
  params: { eventId: string };
}

const EventPage: React.FC<EventPageProps> = async ({ params }) => {
  const eventId = params.eventId;

  try {
    const { event } = await getEvent(eventId);

    if (!event) {
      notFound();
    }

    return (
      <div className="container mx-auto py-8 flex flex-col items-center px-4 sm:px-0">
        <ViewEditEvent eventData={event} />
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
