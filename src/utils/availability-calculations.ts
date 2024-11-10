import { Participant } from '@/types/Participant';

interface RGB {
  r: number;
  g: number;
  b: number;
}

const NO_PARTICIPANT_COLOR: RGB = { r: 255, g: 255, b: 255 };
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
  timeFormat: 12 | 24,
): string[] {
  const dateTimeLabels: string[] = [];

  function formatTimeDisplay(hour: number, minutes: number): string {
    if (timeFormat === 24) {
      return `${hour}:${minutes.toString().padStart(2, '0')}`;
    }

    if (hour === 0 || hour === 24) {
      return `午前0:${minutes.toString().padStart(2, '0')}`;
    }
    if (hour === 12 && minutes === 0) {
      return '正午';
    }

    const period = hour < 12 ? '午前' : '午後';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${period}${displayHour}:${minutes.toString().padStart(2, '0')}`;
  }

  for (let i = 0; i < dayLabels.length; ++i) {
    for (let j = 0; j < hourLabels.length; ++j) {
      let dayLabel: string = dayLabels[i];

      if (dateType === 'specific') {
        // '2024-12-01' -> '2024年12月1日'
        const [year, month, day] = dayLabel.split('-');
        const formattedMonth = String(Number(month));
        const formattedDay = String(Number(day));
        dayLabel = `${year}年${formattedMonth}月${formattedDay}日`;
      } else {
        dayLabel = `${dayLabel}曜日`;
      }

      const hour = hourLabels[j];
      dateTimeLabels.push(`${dayLabel} ${formatTimeDisplay(hour, 0)}`);
      dateTimeLabels.push(`${dayLabel} ${formatTimeDisplay(hour, 15)}`);
      dateTimeLabels.push(`${dayLabel} ${formatTimeDisplay(hour, 30)}`);
      dateTimeLabels.push(`${dayLabel} ${formatTimeDisplay(hour, 45)}`);
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
export function generateColorScale(numParticipants: number): string[] {
  const numColors = numParticipants + 1;
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

  return colorScale;
}

function rgbToString(rgb: RGB): string {
  return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
}
