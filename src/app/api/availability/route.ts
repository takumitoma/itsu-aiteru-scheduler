import { NextRequest } from 'next/server';
import { post } from './post';

export async function POST(request: NextRequest) {
  return post(request);
}

export async function updateAvailability(
  participantId: string,
  newAvailability: Set<number>[],
  numSlots: number,
): Promise<{ success: boolean }> {
  // example: [{0, 1, 2, 93}] becomes
  // [{1, 1, 1, 0 ..... 0, 1, 0, 0}]
  // this is necessary bc PostreSQL only stores perfectly square 2d arrays
  const formattedAvailability = newAvailability.map((day) => {
    const dayArray = new Array(numSlots).fill(0);
    day.forEach((timeslot) => {
      if (timeslot >= 0 && timeslot <= 95) {
        dayArray[timeslot] = 1;
      }
    });
    return dayArray;
  });

  console.log(formattedAvailability);

  const response = await fetch('/api/availability', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      participantId,
      availability: formattedAvailability,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update availability');
  }

  return { success: true };
}
