import { Participant } from '@/types/Participant';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const ONE_MINUTE = 60;

export async function getParticipants(eventId: string): Promise<Participant[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/participant?eventId=${eventId}`, {
      method: 'GET',
      next: { revalidate: ONE_MINUTE },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.participants;
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
}

export async function createParticipant(eventId: string, name: string): Promise<{ id: string }> {
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

    return { id: data.id };
  } catch (error) {
    console.error('Error creating participant:', error);
    throw error;
  }
}
