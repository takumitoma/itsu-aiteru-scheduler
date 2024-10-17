'use client';

import { useState, useMemo } from 'react';
import SubHeading from './SubHeading';
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
  r: number;
  g: number;
  b: number;
}

const NO_PARTICIPANT_COLOR: RGB = { r: 255, g: 255, b: 255 };
const MAX_PARTICIPANT_COLOR: RGB = { r: 74, g: 144, b: 226 };

interface ViewEditEventProps {
  event: Event;
  participants: Participant[];
}

const ViewEditEvent: React.FC<ViewEditEventProps> = ({ event, participants }) => {
  const [participantsState, setParticipants] = useState<Participant[]>(participants);

  const [selectedColorScaleIndex, setSelectedColorScaleIndex] = useState<number | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState('');

  const [editingParticipant, setEditingParticipant] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const daysOfWeekLabels = ['日', '月', '火', '水', '木', '金', '土'];
  const dayLabels: string[] =
    event.surveyType === 'specific'
      ? event.dates || []
      : daysOfWeekLabels.filter((_, index) => event.daysOfWeek?.[index] === 1) || [];
  const hourLabels: number[] = Array.from(
    { length: event.timeRangeEnd - event.timeRangeStart },
    (_, index) => event.timeRangeStart + index,
  );

  const numDays: number = dayLabels.length;
  const numHours: number = event.timeRangeEnd - event.timeRangeStart;
  const numSlots: number = numDays * numHours * QUARTERS_PER_HOUR;

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
  const numParticipants: number = participantsState.length;
  const numColors: number = numParticipants + 1;
  function rgbToString(rgb: RGB): string {
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
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
        NO_PARTICIPANT_COLOR.r + ratio * (MAX_PARTICIPANT_COLOR.r - NO_PARTICIPANT_COLOR.r),
      );
      const g = Math.round(
        NO_PARTICIPANT_COLOR.g + ratio * (MAX_PARTICIPANT_COLOR.g - NO_PARTICIPANT_COLOR.g),
      );
      const b = Math.round(
        NO_PARTICIPANT_COLOR.b + ratio * (MAX_PARTICIPANT_COLOR.b - NO_PARTICIPANT_COLOR.b),
      );

      colorScale.push(rgbToString({ r, g, b }));
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
  const getColorIndex = (index: number): number => {
    if (colorScale.length <= MAX_VISIBLE_COLORS) {
      return index;
    }
    const groupSize = Math.ceil(colorScale.length / MAX_VISIBLE_COLORS);
    return Math.min(Math.floor(index / groupSize), MAX_VISIBLE_COLORS - 1);
  };

  const participantNames: string[] = participantsState.map(participant => participant.name);

  // get the range of colorScale indices (in string format) by displayColors index
  function getColorRangeText(index: number): string {
    // determine size of each color group, take ceiling to ensure all colors are covered
    const groupSize = Math.ceil(colorScale.length / displayColors.length);
    const start = index * groupSize;
    // get the last colorScake index in this display color's group
    // naively it is the start of the next group minus 1, but with edge case,
    // take the min of naive solution and last color index to avoid going out of bounds
    const end = Math.min((index + 1) * groupSize - 1, colorScale.length - 1);
    return start === end ? `${start}` : `${start}-${end}`;
  }

  // the heat map when participant is selected
  function getAvailabilityByName(name: string): number[] {
    // O(n) but ok for now bc number of participants is capped at 100
    const participantObject = participantsState.find((participant) => participant.name === name);
    return participantObject?.availability || [];
  }

  // the heat map when color scale index is selected
  function getColorScaleHeatMap(): number[] {
    if (selectedColorScaleIndex === null) {
      return new Array(numSlots).fill(0);
    }

    const groupSize = Math.ceil(colorScale.length / MAX_VISIBLE_COLORS);
    const minValue = selectedColorScaleIndex * groupSize;
    const maxValue = Math.min((selectedColorScaleIndex + 1) * groupSize - 1, colorScale.length - 1);

    return heatMap.map((value) => (value >= minValue && value <= maxValue ? 1 : 0));
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
    <div className="container mx-auto flex flex-col items-center max-w-[762px] w-full space-y-6">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <SubHeading
        isEditing={isEditing}
        selectedParticipant={selectedParticipant}
        getColorRangeText={getColorRangeText}
        selectedColorScaleIndex={selectedColorScaleIndex}
        editingParticipant={editingParticipant}
      />
      {!isEditing && (
        <ColorScale
          displayColors={displayColors}
          numParticipants={numParticipants}
          getColorRangeText={getColorRangeText}
          selectedColorScaleIndex={selectedColorScaleIndex}
          setSelectedColorScaleIndex={setSelectedColorScaleIndex}
          setSelectedParticipant={setSelectedParticipant}
        />
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
            isColorScaleIndexSelected={selectedColorScaleIndex !== null}
            colorScaleHeatMap={getColorScaleHeatMap()}
          />
        )}
      </AvailabilityChart>
      <ParticipantEditor
        isEditing={isEditing}
        setParticipantName={setEditingParticipant}
        setIsEditing={setIsEditing}
        setIsLoading={setIsLoading}
        eventId={event.id}
        onSaveAvailability={handleSaveAvailability}
        onCancelEditing={handleCancelEditing}
      />
      {!isEditing && (
        <ParticipantsList
          participantNames={participantNames}
          selectedParticipant={selectedParticipant}
          setSelectedParticipant={setSelectedParticipant}
          setSelectedColorScaleIndex={setSelectedColorScaleIndex}
        />
      )}
      <EventLinkSharer link={`http://localhost:3000/${event.id}`} />
    </div>
  );
};

export default ViewEditEvent;
