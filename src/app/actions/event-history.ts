'use server';

import { cookies } from 'next/headers';
import { Event } from '@/types/Event';

const COOKIE_NAME = 'event-history';
const MAX_HISTORY = 10;
const TWO_MONTHS = 60 * 24 * 60 * 60;

export async function addEventToHistory(event: Event) {
  const cookieStore = cookies();

  const existingCookie = cookieStore.get(COOKIE_NAME);
  let history: Event[] = [];

  if (existingCookie) {
    try {
      history = JSON.parse(existingCookie.value);

      // remove event if it matches the event that will be inserted
      history = history.filter((e) => e.id !== event.id);
    } catch (error) {
      console.error('Event history cookie is broken', error);
    }
  }

  history.push(event);

  // keep just the 10 most recent events
  if (history.length > MAX_HISTORY) {
    history = history.slice(history.length - MAX_HISTORY);
  }

  cookieStore.set(COOKIE_NAME, JSON.stringify(history), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TWO_MONTHS,
  });
}
