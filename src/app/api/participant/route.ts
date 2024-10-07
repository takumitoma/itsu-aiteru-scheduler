import { NextRequest } from 'next/server';
import { get } from './get';
import { ParticipantData } from '@/types/ParticipantData';

export async function GET(request: NextRequest) {
  return get(request);
}

export async function getParticipantsByEventId(eventId: string): Promise<ParticipantData[]> {
  const response = await fetch(`/api/participant?eventId=${encodeURIComponent(eventId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data.participants || [];
}
