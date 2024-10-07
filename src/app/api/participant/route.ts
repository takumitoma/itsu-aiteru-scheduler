import { NextRequest } from 'next/server';
import { get } from './get';
import { post } from './post';
import { ParticipantData } from '@/types/ParticipantData';

export async function GET(request: NextRequest) {
  return get(request);
}

export async function POST(request: NextRequest) {
  return post(request);
}

export async function getParticipantsByEventId(eventId: string): Promise<ParticipantData[]> {
  const response = await fetch(`/api/participant?eventId=${eventId}`, {
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

export async function createParticipant(eventId: string, name: string): Promise<ParticipantData> {
  const response = await fetch('/api/participant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ eventId, name }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create participant');
  }

  const data = await response.json();
  return {
    id: data.id,
    eventId,
    name,
  };
}
