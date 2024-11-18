'use client';

import { useState, useMemo } from 'react';
import Heading from './Heading';
import SubHeading from './SubHeading';
import AvailabilityChart from './AvailabilityChart';
import ParticipantEditor from './ParticipantEditor';
import EventLinkSharer from './EventLinkSharer';
import AvailabilityEditor from './AvailabilityEditor';
import AvailabilityViewer from './AvailabilityViewer';
import AvailabilityDeleteViewer from './AvailabilityDeleteViewer';
import ColorScale from './ColorScale';
import TimezoneDisplay from './TimezoneDisplay';
import ParticipantsList from './ParticipantsList';
import { updateAvailability } from '@/lib/api-client/availability';
import { Event } from '@/types/Event';
import { Participant } from '@/types/Participant';
import {
  calculateHeatMap,
  generateDateTimeLabels,
  generateParticipantLists,
  generateColorScale,
} from '@/utils/availability-calculations';
import { useTimeFormatContext } from '@/providers/TimeFormatContext';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl';

const QUARTERS_PER_HOUR = 4;
const MAX_VISIBLE_COLORS = 20;
import { daysOfWeekKeys } from '@/constants/days';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

interface ViewEditEventProps {
  event: Event;
  participants: Participant[];
}

export default function ViewEditEvent({ event, participants }: ViewEditEventProps) {
  const t = useTranslations('ViewEditEvent.ViewEditEvent');
  const dowT = useTranslations('constants.DaysOfWeek');
  const locale = useLocale() as 'ja' | 'en';
  const { timeFormat } = useTimeFormatContext();
  const { theme } = useTheme();

  const [allParticipants, setAllParticipants] = useState<Participant[]>(participants);

  const [selectedColorScaleIndex, setSelectedColorScaleIndex] = useState<number | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  const [mode, setMode] = useState<'view' | 'edit' | 'delete'>('view');
  const [isLoading, setIsLoading] = useState(false);

  const daysOfWeek = daysOfWeekKeys.map(day => dowT(day));

  const dayLabels: string[] = useMemo(
    () =>
      event.surveyType === 'specific'
        ? event.dates || []
        : daysOfWeek.filter((_, index) => event.daysOfWeek?.[index] === 1) || [],
    [event.surveyType, event.dates, event.daysOfWeek, daysOfWeek],
  );
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
  const heatMap: number[] = useMemo(
    () => calculateHeatMap(allParticipants, numSlots),
    [allParticipants, numSlots],
  );

  // date-time labels for each time slot to be used in each slot's tooltip
  const dateTimeLabels: string[] = useMemo(() => {
    const labels = generateDateTimeLabels(event.surveyType, dayLabels, hourLabels);

    return labels.map(({ date, time }) => {
      let datePart: string;
      if (date.type === 'specific') {
        const specificDate = date.value as { year: string; month: string; day: string };
        datePart = t('time.dateFormat.specific', specificDate);
      } else {
        const weekDay = date.value as string;
        datePart = t('time.dateFormat.week', { day: weekDay });
      }

      let timePart: string;
      if (timeFormat === 24) {
        if (time.type === 'midnight') {
          timePart = `0:${time.minutes.toString().padStart(2, '0')}`;
        } else {
          timePart = `${time.hour}:${time.minutes.toString().padStart(2, '0')}`;
        }
      } else {
        let displayHour: number;
        let period: string;

        if (locale === 'ja') {
          if (time.type === 'midnight') {
            displayHour = 0;
            period = t('time.am');
          } else if (time.type === 'noon') {
            displayHour = 0;
            period = t('time.pm');
          } else {
            displayHour = time.hour % 12;
            period = time.hour < 12 ? t('time.am') : t('time.pm');
          }
        } else {
          if (time.type === 'midnight') {
            displayHour = 12;
            period = t('time.am');
          } else if (time.type === 'noon') {
            displayHour = 12;
            period = t('time.pm');
          } else {
            displayHour = time.hour > 12 ? time.hour - 12 : time.hour;
            period = time.hour < 12 ? t('time.am') : t('time.pm');
            if (displayHour === 0) displayHour = 12;
          }
        }

        timePart = t('time.timeFormat', {
          hour: displayHour.toString(),
          minutes: time.minutes.toString().padStart(2, '0'),
          period,
        });
      }

      return `${datePart} ${timePart}`;
    });
  }, [event.surveyType, dayLabels, hourLabels, timeFormat, t, locale]);

  // list of available participants and unavailable participants to be used in each slot's tooltip
  const [availableParticipantsPerSlot, unavailableParticipantsPerSlot] = useMemo(() => {
    return generateParticipantLists(allParticipants, numSlots);
  }, [allParticipants, numSlots]);

  //  used to define colorScale
  const numParticipants: number = allParticipants.length;

  // the color scale legend in that would be used if MAX_VISIBLE_COLORS did not exist
  // the literal color scale
  const colorScale: string[] = generateColorScale(numParticipants, theme);

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

  function handleLoadSelectedTimeSlots(participant: Participant): void {
    if (participant.availability.length !== 0) {
      setSelectedTimeSlots(participant.availability);
    }
  }

  function clearSelectedTimeslots() {
    setSelectedTimeSlots(new Array(numSlots).fill(0));
  }

  async function handleSaveAvailability(participant: Participant) {
    try {
      setIsLoading(true);
      await updateAvailability(participant.id, selectedTimeSlots);
      setAllParticipants((prevParticipants) =>
        prevParticipants.map((p) =>
          p.id === participant.id ? { ...p, availability: selectedTimeSlots } : p,
        ),
      );
      setMode('view');
      clearSelectedTimeslots();
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancelEditing() {
    setMode('view');
    clearSelectedTimeslots();
  }

  return (
    <div className="flex flex-col items-center w-full space-y-8">
      <Heading title={event.title} createdAt={event.createdAt} />
      <SubHeading
        mode={mode}
        selectedParticipant={selectedParticipant}
        getColorRangeText={getColorRangeText}
        selectedColorScaleIndex={selectedColorScaleIndex}
        editingParticipant={editingParticipant}
      />
      {mode === 'view' && (
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
        dateType={event.surveyType}
        dayLabels={dayLabels}
      >
        {mode === 'edit' ? (
          <AvailabilityEditor
            selectedTimeSlots={selectedTimeSlots}
            setSelectedTimeSlots={setSelectedTimeSlots}
            numDays={numDays}
            numHours={numHours}
          />
        ) : mode === 'view' ? (
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
            isParticipantSelected={selectedParticipant !== null}
            participantHeatMap={selectedParticipant?.availability || []}
            isColorScaleIndexSelected={selectedColorScaleIndex !== null}
            colorScaleHeatMap={getColorScaleHeatMap()}
          />
        ) : (
          mode === 'delete' && (
            <AvailabilityDeleteViewer
              selectedTimeSlots={selectedParticipant?.availability || []}
              numDays={numDays}
              numHours={numHours}
            />
          )
        )}
      </AvailabilityChart>
      <div
        className="w-full flex flex-col sm:flex-row items-end sm:items-center sm:justify-between 
          gap-4"
      >
        <TimezoneDisplay timezone={event.timezone} />
        <ParticipantEditor
          mode={mode}
          setMode={setMode}
          allParticipants={allParticipants}
          editingParticipant={editingParticipant}
          setEditingParticipant={setEditingParticipant}
          setIsLoading={setIsLoading}
          eventId={event.id}
          setAllParticipants={setAllParticipants}
          selectedParticipant={selectedParticipant}
          setSelectedParticipant={setSelectedParticipant}
          onSaveAvailability={handleSaveAvailability}
          onCancelEditing={handleCancelEditing}
          onLoadSelectedTimeSlots={handleLoadSelectedTimeSlots}
        />
      </div>
      {(mode === 'view' || mode === 'delete') && (
        <ParticipantsList
          mode={mode}
          allParticipants={allParticipants}
          selectedParticipant={selectedParticipant}
          setSelectedParticipant={setSelectedParticipant}
          setSelectedColorScaleIndex={setSelectedColorScaleIndex}
        />
      )}
      {mode === 'view' && <EventLinkSharer link={`${SITE_URL}/e/${event.id}`} />}
    </div>
  );
}
