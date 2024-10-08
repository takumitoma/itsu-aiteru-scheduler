import { NextRequest } from 'next/server';
import { post } from './post';

export async function POST(request: NextRequest) {
  return post(request);
}

export async function updateAvailability(
  participantId: string,
  newAvailability: number[][],
): Promise<{ success: boolean }> {
  const response = await fetch('/api/availability', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      participantId,
      availability: newAvailability,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update availability');
  }

  return { success: true };
}
