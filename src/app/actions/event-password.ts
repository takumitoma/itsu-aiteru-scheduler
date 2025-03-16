'use server';

import { setEventPassword } from '@/lib/cookies/event-password';
import { getEvent } from '@/lib/api-client/event';

export async function submitEventPassword(eventId: string, password: string) {
  try {
    await getEvent(eventId, password);

    setEventPassword(eventId, password);

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
