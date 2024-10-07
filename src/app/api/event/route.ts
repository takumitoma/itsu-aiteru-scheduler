import { NextRequest, NextResponse } from 'next/server';
import { get } from './get';
import { post } from './post';
import { EventData } from '@/types/EventData';

export async function GET(request: NextRequest) {
  return get(request);
}

export async function POST(request: NextRequest) {
  return post(request);
}

export async function getEvent(id: string): Promise<{ event: EventData }> {
  const response = await fetch(`/api/event?id=${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Event not found');
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An error occurred while fetching the event');
    }
  }

  return response.json();
}

export async function createEvent(eventData: Omit<EventData, 'id'>): Promise<{ event: EventData }> {
  const response = await fetch('/api/event', {
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