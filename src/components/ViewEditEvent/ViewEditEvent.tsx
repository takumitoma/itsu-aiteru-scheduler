'use client';

import { useState } from 'react';
import { Event } from '@/types/Event';
import { Participant } from '@/types/Participant';
import AvailabilityChart from './AvailabilityChart';
import ParticipantEditor from './ParticipantEditor';
import EventLinkSharer from './EventLinkSharer';
import AvailabilityEditor from './AvailabilityEditor';
import AvailabilityViewer from './AvailabilityViewer';
import { updateAvailability } from '@/app/api/availability/route';

const QUARTERS_PER_HOUR = 4;

interface ViewEditEventProps {
  event: Event;
  participants: Participant[];
}

const ViewEditEvent: React.FC<ViewEditEventProps> = ({ event, participants }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const daysOfWeekLabels = ['日', '月', '火', '水', '木', '金', '土'];
  const dayLabels =
    event.surveyType === 'specific'
      ? event.dates || []
      : daysOfWeekLabels.filter((_, index) => event.daysOfWeek?.[index] === 1) || [];
  const hourLabels = Array.from(
    { length: event.timeRangeEnd - event.timeRangeStart },
    (_, index) => event.timeRangeStart + index,
  );

  const numDays = dayLabels?.length || 0;
  const numHours = event.timeRangeEnd - event.timeRangeStart;
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
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <ParticipantEditor
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setIsLoading={setIsLoading}
        eventId={event.id}
        onSaveAvailability={handleSaveAvailability}
      />
      <AvailabilityChart
        isLoading={isLoading}
        hourLabels={hourLabels}
        timeRangeEnd={event.timeRangeEnd}
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
      <EventLinkSharer link={`http://localhost:3000/${event.id}`} />
    </div>
  );
};

export default ViewEditEvent;
