export async function updateAvailability(
  participantId: string,
  newAvailability: number[],
): Promise<{ success: boolean }> {
  try {
    const response = await fetch('/api/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participantId, availability: newAvailability }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update availability');
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
}
