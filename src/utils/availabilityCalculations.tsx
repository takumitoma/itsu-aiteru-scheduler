import { Participant } from '@/types/Participant';

interface RGB {
  r: number;
  g: number;
  b: number;
}

const NO_PARTICIPANT_COLOR: RGB = { r: 255, g: 255, b: 255 };
const MAX_PARTICIPANT_COLOR: RGB = { r: 74, g: 144, b: 226 };

export function calculateHeatMap(participants: Participant[], numSlots: number): number[] {
  const result: number[] = new Array(numSlots).fill(0);
  for (const participant of participants) {
    for (let i = 0; i < participant.availability.length; ++i) {
      result[i] += participant.availability[i];
    }
  }
  return result;
}

export function generateDateTimeLabels(dayLabels: string[], hourLabels: number[]): string[] {
  const dateTimeLabels: string[] = [];
  for (let i = 0; i < dayLabels.length; ++i) {
    for (let j = 0; j < hourLabels.length; ++j) {
      dateTimeLabels.push(`${dayLabels[i]}曜日 ${hourLabels[j]}:00`);
      dateTimeLabels.push(`${dayLabels[i]}曜日 ${hourLabels[j]}:15`);
      dateTimeLabels.push(`${dayLabels[i]}曜日 ${hourLabels[j]}:30`);
      dateTimeLabels.push(`${dayLabels[i]}曜日 ${hourLabels[j]}:45`);
    }
  }
  return dateTimeLabels;
}

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
