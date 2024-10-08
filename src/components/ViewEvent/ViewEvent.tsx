import { useState } from 'react';
import { EventData } from '@/types/EventData';
import AvailabilityChart from './AvailabilityChart';
import ParticipantEditor from './ParticipantEditor';
import EventLinkSharer from './EventLinkSharer';

interface ViewEventProps {
  eventData: EventData;
}

const ViewEvent: React.FC<ViewEventProps> = ({ eventData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const viewBoxes: Set<number>[] = new Array(7).fill(0).map(() => new Set<number>());

  return (
    <div className="container mx-auto flex flex-col items-center max-w-[762px] w-full">
      <h1 className="text-3xl font-bold">{eventData.title}</h1>
      <ParticipantEditor isEditing={isEditing} setIsEditing={setIsEditing} id={eventData.id} />
      <AvailabilityChart
        isEditing={isEditing}
        viewBoxes={viewBoxes}
        timezone={eventData.timezone}
        timeRangeStart={eventData.timeRangeStart}
        timeRangeEnd={eventData.timeRangeEnd}
        daysOfWeek={eventData.daysOfWeek}
      />
      <EventLinkSharer link={`http://localhost:3000/${eventData.id}`} />
    </div>
  );
};

export default ViewEvent;
