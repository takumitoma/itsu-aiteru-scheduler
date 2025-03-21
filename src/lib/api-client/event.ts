import { type EventGet, type EventPost } from '@/types/Event';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const ONE_DAY = 86400;

export async function getEvent(id: string, password?: string): Promise<EventGet> {
  try {
    if (id.length !== 12) {
      throw new Error('Event not found');
    }

    const requestTime = Date.now();

    const url = `${API_BASE_URL}/api/event?id=${id}`;

    const options: RequestInit = {
      method: 'GET',
      next: { revalidate: ONE_DAY },
      headers: {},
    };

    if (password) {
      options.headers = {
        ...options.headers,
        'X-Event-Password': password,
      };
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Event not found');
      }

      // if 403 try to throw the same error from endpoint
      const data = await response.json();
      if (response.status === 403 && data.error) {
        throw new Error(data.error);
      }

      throw new Error('An error occurred while fetching the event');
    }

    const dateHeader = response.headers.get('date');
    const responseTime = dateHeader ? new Date(dateHeader).getTime() : Date.now();
    const isFromCache = responseTime < requestTime;

    const data = await response.json();

    // update last_accessed timestamp if the response wasn't from cache
    // don't throw error because this part is not a critical operation
    if (!isFromCache) {
      updateLastAccessed(id).catch((error) => {
        console.error('Failed to update last_accessed timestamp:', error);
      });
    }

    return data.event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
}

async function updateLastAccessed(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/event`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, operation: 'updateLastAccessed' }),
  });

  if (!response.ok) {
    throw new Error('Failed to update last accessed timestamp');
  }
}

export async function createEvent(eventData: EventPost): Promise<string> {
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
