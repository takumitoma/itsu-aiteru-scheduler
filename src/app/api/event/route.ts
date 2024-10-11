import { NextRequest } from 'next/server';
import { get } from './get';
import { post } from './post';
import { Event } from '@/types/Event';

const ONE_DAY = 86400;

export async function GET(request: NextRequest) {
  return get(request);
}

export async function POST(request: NextRequest) {
  return post(request);
}

export async function getEvent(id: string): Promise<Event> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${apiBaseUrl}/api/event?id=${id}`, {
    method: 'GET',
    next: { revalidate: ONE_DAY },
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Event not found');
    } else {
      throw new Error(data.error || 'An error occurred while fetching the event');
    }
  }

  return data.event;
}

export async function createEvent(eventData: Omit<Event, 'id'>): Promise<{ event: Event }> {
  // backup: const response = await fetch('/api/event', {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${apiBaseUrl}/api/event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create event');
  }

  return response.json();
}
