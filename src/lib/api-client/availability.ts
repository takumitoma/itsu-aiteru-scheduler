export async function updateAvailability(
  participantId: string,
  newAvailability: Set<number>[],
  numSlots: number,
): Promise<{ success: boolean }> {
  // example: [{0, 1, 2, 93}] becomes
  // [{1, 1, 1, 0 ..... 0, 1, 0, 0}]
  // this is necessary bc PostreSQL only stores perfectly square 2d arrays
  const decompressedAvailability = newAvailability.map((day) => {
    const dayArray = new Array(numSlots).fill(0);
    day.forEach((timeslot) => {
      if (timeslot >= 0 && timeslot < numSlots) {
        dayArray[timeslot] = 1;
      }
    });
    return dayArray;
  });

  try {
    const response = await fetch('/api/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participantId, availability: decompressedAvailability }),
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
