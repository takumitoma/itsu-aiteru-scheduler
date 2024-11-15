import { Participant } from '@/types/Participant';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface TimeData {
  hour: number;
  minutes: number;
  type: 'regular' | 'noon' | 'midnight';
}

interface DateData {
  type: 'specific' | 'week';
  value: string | { year: string; month: string; day: string };
}

const LIGHT_NO_PARTICIPANT_COLOR: RGB = { r: 255, g: 255, b: 255 };
const DARK_NO_PARTICIPANT_COLOR: RGB = { r: 10, g: 10, b: 10 };
const MAX_PARTICIPANT_COLOR: RGB = { r: 74, g: 144, b: 226 };

// creates heat map, adds up the availabilities of all participants for each time slot.
export function calculateHeatMap(participants: Participant[], numSlots: number): number[] {
  const result: number[] = new Array(numSlots).fill(0);
  for (const participant of participants) {
    for (let i = 0; i < participant.availability.length; ++i) {
      result[i] += participant.availability[i];
    }
  }
  return result;
}

// generate date time labels that will be displayed on timeslot tooltips
export function generateDateTimeLabels(
  dateType: 'specific' | 'week',
  dayLabels: string[],
  hourLabels: number[],
): Array<{ date: DateData; time: TimeData }> {
  const dateTimeLabels: Array<{ date: DateData; time: TimeData }> = [];

  for (let i = 0; i < dayLabels.length; ++i) {
    let dateData: DateData;

    if (dateType === 'specific') {
      const [year, month, day] = dayLabels[i].split('-');
      dateData = {
        type: 'specific',
        value: {
          year,
          month: String(Number(month)),
          day: String(Number(day)),
        },
      };
    } else {
      dateData = {
        type: 'week',
        value: dayLabels[i],
      };
    }

    for (let j = 0; j < hourLabels.length; ++j) {
      const hour = hourLabels[j];

      for (const minutes of [0, 15, 30, 45]) {
        let timeData: TimeData;

        if (hour === 12 && minutes === 0) {
          timeData = { hour: 12, minutes: 0, type: 'noon' };
        } else if ((hour === 0 || hour === 24) && minutes === 0) {
          timeData = { hour: 0, minutes: 0, type: 'midnight' };
        } else {
          timeData = { hour, minutes, type: 'regular' };
        }

        dateTimeLabels.push({
          date: dateData,
          time: timeData,
        });
      }
    }
  }

  return dateTimeLabels;
}

// available: 2D array of size number of timeslots. Each index is an array of participant names
// that are available in the respective timeslot index.
// unavailable: the opposite
export function generateParticipantLists(
  participants: Participant[],
  numSlots: number,
): [string[][], string[][]] {
  const available: string[][] = Array.from({ length: numSlots }, () => []);
  const unavailable: string[][] = Array.from({ length: numSlots }, () => []);

  for (const participant of participants) {
    for (let i = 0; i < numSlots; ++i) {
      if (participant.availability[i]) {
        available[i].push(participant.name);
      } else {
        unavailable[i].push(participant.name);
      }
    }
  }

  return [available, unavailable];
}

// create a gradient between NO_PARTICIPANT_COLOR and MAX_PARTICIPANT_COLOR based on number of
// participants
export function generateColorScale(numParticipants: number, theme: string | undefined): string[] {
  const numColors = numParticipants + 1;
  const colorScale: string[] = [];
  const NO_PARTICIPANT_COLOR =
    theme === 'light' ? LIGHT_NO_PARTICIPANT_COLOR : DARK_NO_PARTICIPANT_COLOR;

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

  return colorScale;
}

function rgbToString(rgb: RGB): string {
  return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
}
