'use client';

import { useState } from 'react';
import { EventData } from '@/types/EventData';
import AvailabilityChart from './AvailabilityChart';
import ParticipantEditor from './ParticipantEditor';
import EventLinkSharer from './EventLinkSharer';
import AvailabilityEditor from './AvailabilityEditor';
import AvailabilityViewer from './AvailabilityViewer';
import { updateAvailability } from '@/app/api/availability/route';

const QUARTERS_PER_HOUR = 4;

interface ViewEditEventProps {
  eventData: EventData;
}

const ViewEditEvent: React.FC<ViewEditEventProps> = ({ eventData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const daysOfWeekLabels = ['日', '月', '火', '水', '木', '金', '土'];
  const dayLabels =
    eventData.surveyType === 'specific'
      ? eventData.dates || []
      : daysOfWeekLabels.filter((_, index) => eventData.daysOfWeek?.[index] === 1) || [];
  const hourLabels = Array.from(
    { length: eventData.timeRangeEnd - eventData.timeRangeStart },
    (_, index) => eventData.timeRangeStart + index,
  );

  const numDays = dayLabels?.length || 0;
  const numHours = eventData.timeRangeEnd - eventData.timeRangeStart;
  const numSlots = numHours * QUARTERS_PER_HOUR;

  const [viewBoxes, setViewBoxes] = useState<Set<number>[]>(
    new Array(numDays).fill(0).map(() => new Set<number>()),
  );
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Set<number>[]>(
    new Array(numDays).fill(0).map(() => new Set<number>()),
  );

  const clearSelectedTimeslots = () => {
    setSelectedTimeSlots(new Array(7).fill(0).map(() => new Set<number>()));
  };

  async function handleSaveAvailability(participantId: string) {
    try {
      setIsLoading(true);
      await updateAvailability(participantId, selectedTimeSlots, numSlots);
      setIsEditing(false);
      clearSelectedTimeslots();
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex flex-col items-center max-w-[762px] w-full">
      <h1 className="text-3xl font-bold">{eventData.title}</h1>
      <ParticipantEditor
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setIsLoading={setIsLoading}
        eventId={eventData.id}
        onSaveAvailability={handleSaveAvailability}
      />
      <AvailabilityChart
        isLoading={isLoading}
        hourLabels={hourLabels}
        timeRangeEnd={eventData.timeRangeEnd}
        dayLabels={dayLabels}
      >
        {isEditing ? (
          <AvailabilityEditor
            selectedTimeSlots={selectedTimeSlots}
            setSelectedTimeSlots={setSelectedTimeSlots}
            numDays={numDays}
            numHours={numHours}
          />
        ) : (
          <AvailabilityViewer viewBoxes={viewBoxes} numDays={numDays} numHours={numHours} />
        )}
      </AvailabilityChart>
      <EventLinkSharer link={`http://localhost:3000/${eventData.id}`} />
    </div>
  );
};

export default ViewEditEvent;
