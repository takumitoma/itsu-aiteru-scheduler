'use client';

import { useState, useMemo } from 'react';
import { Event } from '@/types/Event';
import { Participant } from '@/types/Participant';
import AvailabilityChart from './AvailabilityChart';
import ParticipantEditor from './ParticipantEditor';
import EventLinkSharer from './EventLinkSharer';
import AvailabilityEditor from './AvailabilityEditor';
import AvailabilityViewer from './AvailabilityViewer';
import ColorScale from './ColorScale';
import { updateAvailability } from '@/lib/api-client/availability';

const QUARTERS_PER_HOUR = 4;

interface RGB {
  R: number;
  G: number;
  B: number;
}

const NO_PARTICIPANT_COLOR: RGB = { R: 255, G: 255, B: 255 };
const MAX_PARTICIPANT_COLOR: RGB = { R: 74, G: 144, B: 226 };

interface ViewEditEventProps {
  event: Event;
  participants: Participant[];
}

const ViewEditEvent: React.FC<ViewEditEventProps> = ({ event, participants }) => {
  const [participantsState, setParticipants] = useState<Participant[]>(participants);

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
  const numSlots = numDays * numHours * QUARTERS_PER_HOUR;

  // the heat map for AvailabilityViewer, each index is the saturation for respective timeslot
  // adds every participants availability array together, example:
  // participant 1: [0, 0, 1, 1, 0, 1]
  // participant 2: [0, 1, 1, 0, 0, 0]
  // heat map:      [0, 1, 2, 1, 0, 1]
  const heatMap: number[] = useMemo(() => {
    const availabilites: number[][] = participantsState.map(
      (participant) => participant.availability,
    );
    const result: number[] = new Array(numSlots).fill(0);
    for (let i = 0; i < availabilites.length; ++i) {
      for (let j = 0; j < availabilites[i].length; ++j) {
        result[j] += availabilites[i][j];
      }
    }
    return result;
  }, [numSlots, participantsState]);

  // used for colorScale
  function rgbToString(rgb: RGB): string {
    return `rgb(${rgb.R},${rgb.G},${rgb.B})`;
  }

  // defines the color scale legend for AvailabilityViewer
  const colorScale: string[] = useMemo(() => {
    const numParticipants = participantsState.length;
    const numColors = numParticipants + 1;
    if (numColors === 1) {
      return [rgbToString(NO_PARTICIPANT_COLOR)];
    } else if (numColors === 2) {
      return [rgbToString(NO_PARTICIPANT_COLOR), rgbToString(MAX_PARTICIPANT_COLOR)];
    } else {
      const result = [rgbToString(NO_PARTICIPANT_COLOR)];

      for (let i = 1; i < numColors - 1; ++i) {
        const ratio = i / (numColors - 1);

        const r = Math.round(
          NO_PARTICIPANT_COLOR.R + ratio * (MAX_PARTICIPANT_COLOR.R - NO_PARTICIPANT_COLOR.R),
        );
        const g = Math.round(
          NO_PARTICIPANT_COLOR.G + ratio * (MAX_PARTICIPANT_COLOR.G - NO_PARTICIPANT_COLOR.G),
        );
        const b = Math.round(
          NO_PARTICIPANT_COLOR.B + ratio * (MAX_PARTICIPANT_COLOR.B - NO_PARTICIPANT_COLOR.B),
        );

        result.push(rgbToString({ R: r, G: g, B: b }));
      }

      result.push(rgbToString(MAX_PARTICIPANT_COLOR));
      return result;
    }
  }, [participantsState]);

  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>(new Array(numSlots).fill(0));

  function clearSelectedTimeslots() {
    setSelectedTimeSlots(new Array(numSlots).fill(0));
  }

  async function handleSaveAvailability(participantId: string) {
    try {
      setIsLoading(true);
      await updateAvailability(participantId, selectedTimeSlots);
      setIsEditing(false);
      clearSelectedTimeslots();
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancelEditing() {
    setIsEditing(false);
    clearSelectedTimeslots();
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
        onCancelEditing={handleCancelEditing}
      />
      <ColorScale colorScale={colorScale} numParticipants={participantsState.length} />
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
          <AvailabilityViewer
            heatMap={heatMap}
            numDays={numDays}
            numHours={numHours}
            colorScale={colorScale}
          />
        )}
      </AvailabilityChart>
      <EventLinkSharer link={`http://localhost:3000/${event.id}`} />
    </div>
  );
};

export default ViewEditEvent;
