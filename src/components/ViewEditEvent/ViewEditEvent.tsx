'use client';

import { useState, useMemo, useEffect } from 'react';
import AvailabilityChart from './AvailabilityChart';
import ParticipantEditor from './ParticipantEditor';
import EventLinkSharer from './EventLinkSharer';
import AvailabilityEditor from './AvailabilityEditor';
import AvailabilityViewer from './AvailabilityViewer';
import ColorScale from './ColorScale';
import ParticipantsList from './ParticipantsList';
import { updateAvailability } from '@/lib/api-client/availability';
import { Event } from '@/types/Event';
import { Participant } from '@/types/Participant';

const QUARTERS_PER_HOUR = 4;
const MAX_VISIBLE_COLORS = 20;

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
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');

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
    const result: number[] = new Array(numSlots).fill(0);
    for (const participant of participantsState) {
      for (let i = 0; i < participant.availability.length; ++i) {
        result[i] += participant.availability[i];
      }
    }
    return result;
  }, [numSlots, participantsState]);

  // date-time labels for each time slot to be used in each slot's tooltip
  const dateTimeLabels: string[] = [];
  for (let i = 0; i < dayLabels.length; ++i) {
    for (let j = 0; j < hourLabels.length; ++j) {
      dateTimeLabels.push(`${dayLabels[i]}曜日 ${hourLabels[j]}:00`);
      dateTimeLabels.push(`${dayLabels[i]}曜日 ${hourLabels[j]}:15`);
      dateTimeLabels.push(`${dayLabels[i]}曜日 ${hourLabels[j]}:30`);
      dateTimeLabels.push(`${dayLabels[i]}曜日 ${hourLabels[j]}:45`);
    }
  }

  // list of available participants and unavailable participants to be used in each slot's tooltip
  const [availableParticipantsPerSlot, unavailableParticipantsPerSlot] = useMemo(() => {
    const available: string[][] = Array.from({ length: numSlots }, () => []);
    const unavailable: string[][] = Array.from({ length: numSlots }, () => []);

    for (const participant of participantsState) {
      for (let i = 0; i < numSlots; ++i) {
        if (participant.availability[i]) {
          available[i].push(participant.name);
        } else {
          unavailable[i].push(participant.name);
        }
      }
    }

    return [available, unavailable];
  }, [numSlots, participantsState]);

  //  used to define colorScale
  const numParticipants = participantsState.length;
  const numColors = numParticipants + 1;
  function rgbToString(rgb: RGB): string {
    return `rgb(${rgb.R},${rgb.G},${rgb.B})`;
  }

  // the color scale legend in that would be used if MAX_VISIBLE_COLORS did not exist
  // the literal color scale
  const colorScale: string[] = [];
  if (numColors === 1) {
    colorScale.push(rgbToString(NO_PARTICIPANT_COLOR));
  } else if (numColors === 2) {
    colorScale.push(rgbToString(NO_PARTICIPANT_COLOR), rgbToString(MAX_PARTICIPANT_COLOR));
  } else {
    colorScale.push(rgbToString(NO_PARTICIPANT_COLOR));

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

      colorScale.push(rgbToString({ R: r, G: g, B: b }));
    }

    colorScale.push(rgbToString(MAX_PARTICIPANT_COLOR));
  }

  // the color scale that factors in MAX_VISIBLE_COLORS
  // if color scale is length <= MAX_VISIBLE_COLORS, let each index represent X people
  // otherwise, let each index represent X-Y people
  const displayColors =
    colorScale.length <= MAX_VISIBLE_COLORS
      ? colorScale
      : colorScale.filter(
          (_, index) => index % Math.ceil(colorScale.length / MAX_VISIBLE_COLORS) === 0,
        );

  // get the displayColor index based on the colorScale index
  const getColorIndex = (value: number) => {
    if (colorScale.length <= MAX_VISIBLE_COLORS) {
      return value;
    }
    const groupSize = Math.ceil(colorScale.length / MAX_VISIBLE_COLORS);
    return Math.min(Math.floor(value / groupSize), MAX_VISIBLE_COLORS - 1);
  };

  // to be used in ParticipantsList
  const participantNames: string[] = [];
  for (const participant of participantsState) {
    participantNames.push(participant.name);
  }

  function getAvailabilityByName(name: string): number[] {
    // O(n) but ok for now bc number of participants is capped at 100
    const participantObject = participantsState.find((participant) => participant.name === name);
    return participantObject?.availability || [];
  }

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
        selectedParticipant={selectedParticipant}
        onSaveAvailability={handleSaveAvailability}
        onCancelEditing={handleCancelEditing}
      />
      {!isEditing && (
        <ColorScale
          colorScale={colorScale}
          displayColors={displayColors}
          numParticipants={numParticipants}
        />
      )}
      {!isEditing && (
        <p className="text-xs sm:text-lg font-bold">
          スケジュール表をマウスオーバーもしくはタップで詳細を確認
        </p>
      )}
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
            displayColors={displayColors}
            getColorIndex={getColorIndex}
            dateTimeLabels={dateTimeLabels}
            availableParticipantsPerSlot={availableParticipantsPerSlot}
            unavailableParticipantsPerSlot={unavailableParticipantsPerSlot}
            isParticipantSelected={selectedParticipant !== ''}
            participantHeatMap={getAvailabilityByName(selectedParticipant)}
          />
        )}
      </AvailabilityChart>
      <ParticipantsList
        participantNames={participantNames}
        selectedParticipant={selectedParticipant}
        setSelectedParticipant={setSelectedParticipant}
      />
      <EventLinkSharer link={`http://localhost:3000/${event.id}`} />
    </div>
  );
};

export default ViewEditEvent;
