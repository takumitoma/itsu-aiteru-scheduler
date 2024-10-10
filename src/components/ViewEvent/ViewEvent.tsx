import { useState, useCallback } from 'react';
import { EventData } from '@/types/EventData';
import AvailabilityChart from './AvailabilityChart';
import ParticipantEditor from './ParticipantEditor';
import EventLinkSharer from './EventLinkSharer';

interface ViewEventProps {
  eventData: EventData;
}

const ViewEvent: React.FC<ViewEventProps> = ({ eventData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [viewBoxes, setViewBoxes] = useState<Set<number>[]>(
    new Array(7).fill(0).map(() => new Set<number>()),
  );
  // Each Set represents a day and each number in a Set represents the time of the day starting at
  // timeRangeStart and in 15 minute intervals. for example, if timeRangeStart is 9, timeRangeEnd
  // is 11, and daysOfWeek is [1, 0, 0, 0, 0, 0, 0] and selectedDates is
  // [Set {3, 4, 5, 7}, Set {}, Set {}, Set {}, Set {}, Set {}, Set {}] the selected dates and
  // times are 9:45-10:30 and 10:45-11:00 of Sunday.
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Set<number>[]>(
    new Array(7).fill(0).map(() => new Set<number>()),
  );

  const handleSave = useCallback(
    async (participantId: string) => {
      try {
        const newAvailability = selectedTimeSlots.map((daySet) => Array.from(daySet));
        // todo: add logic to update availability using endpoint here
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating availability:', error);
      }
    },
    [selectedTimeSlots],
  );

  return (
    <div className="container mx-auto flex flex-col items-center max-w-[762px] w-full">
      <h1 className="text-3xl font-bold">{eventData.title}</h1>
      <ParticipantEditor
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        eventId={eventData.id}
        onSave={handleSave}
      />
      <AvailabilityChart
        isEditing={isEditing}
        viewBoxes={viewBoxes}
        selectedTimeSlots={selectedTimeSlots}
        setSelectedTimeSlots={setSelectedTimeSlots}
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
