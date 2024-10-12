import { Event } from '@/types/Event';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const ONE_DAY = 86400;

export async function getEvent(id: string): Promise<Event> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/event?id=${id}`, {
      method: 'GET',
      next: { revalidate: ONE_DAY },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Event not found');
      }
      throw new Error('An error occurred while fetching the event');
    }

    const data = await response.json();
    return data.event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
}

export async function createEvent(eventData: Omit<Event, 'id'>): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create event');
    }

    return data.eventId;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}
