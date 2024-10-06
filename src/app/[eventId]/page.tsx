'use client';

import { useParams, notFound } from 'next/navigation';
import ViewEvent from '@/components/ViewEvent/ViewEvent';

const EditEvent: React.FC = () => {
  const params = useParams();
  const eventId = params.eventId;

  notFound();

  return (
    <div>
      <p>{eventId}</p>
      <ViewEvent />
    </div>
  );
};

export default EditEvent;
