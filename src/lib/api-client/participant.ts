import { Participant } from '@/types/Participant';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function getParticipants(eventId: string): Promise<Participant[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/participant?eventId=${eventId}`, {
      method: 'GET',
      next: {
        tags: [`participants-${eventId}`],
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { participants: Participant[] } = await response.json();
    return data.participants;
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
}

export async function createParticipant(
  eventId: string,
  name: string,
): Promise<{ id: string; new: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/participant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create participant');
    }

    return { id: data.id, new: data.new };
  } catch (error) {
    console.error('Error creating participant:', error);
    throw error;
  }
}

export async function deleteParticipant(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/participant?id=${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete participant');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting participant: ', error);
    throw error;
  }
}
