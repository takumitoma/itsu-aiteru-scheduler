'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import ViewEvent from '@/components/ViewEvent/ViewEvent';
import Loading from '@/components/Loading/Loading';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { getEvent } from '../api/get-event/route';
import { EventData } from '@/types/EventData';

const EventPage: React.FC = () => {
  const params = useParams();
  const eventId = params.eventId as string;
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // useEffect(() => {
  //   async function fetchEventData() {
  //     try {
  //       console.log("called")
  //       const { event } = await getEvent(eventId);
  //       setEventData(event);
  //     } catch (err) {
  //       setError(err instanceof Error ? err : new Error('An unknown error occurred'));
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   fetchEventData();
  // }, [eventId]);

  // if (isLoading) {
  //   return <Loading />;
  // }

  if (error) {
    if (error.message === 'Event not found') {
      notFound();
    } else {
      return (
        <ErrorMessage message={`An error occurred while fetching the event: ${error.message}`} />
      );
    }
  }

  if (!eventData) {
    setEventData({
      id: 'dingding',
      title: 'tester',
      surveyType: 'week',
      timezone: 'Japan',
      timeRangeStart: 10,
      timeRangeEnd: 13,
      dates: null,
      daysOfWeek: [1, 1, 1, 1, 1, 1, 1],
    });
    return <div>No event data available.</div>;
  }

  return (
    <div className="container mx-auto py-8 flex flex-col items-center px-4 sm:px-0">
      <ViewEvent eventData={eventData} />
    </div>
  );
};

export default EventPage;
