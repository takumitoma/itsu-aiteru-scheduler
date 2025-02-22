'use server';

import { cookies } from 'next/headers';
import { Event } from '@/types/Event';

import { EVENT_HISTORY_COOKIE_NAME } from '@/constants/event-history-cookie';
const MAX_HISTORY = 10;
const TWO_MONTHS = 60 * 24 * 60 * 60;

export async function addEventToHistory(event: Event) {
  const cookieStore = cookies();

  const historyCookie = cookieStore.get(EVENT_HISTORY_COOKIE_NAME);
  let eventHistory: Event[] = [];

  if (historyCookie) {
    try {
      eventHistory = JSON.parse(historyCookie.value);
    } catch (error) {
      console.error('Event history cookie is broken', error);
    }
  }

  // remove event if it matches the event that will be inserted
  eventHistory = eventHistory.filter((e) => e.id !== event.id);

  eventHistory.push(event);

  // keep just the MAX_HISTORY most recent events
  if (history.length > MAX_HISTORY) {
    eventHistory = eventHistory.slice(history.length - MAX_HISTORY);
  }

  cookieStore.set(EVENT_HISTORY_COOKIE_NAME, JSON.stringify(history), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TWO_MONTHS,
  });
}

export async function clearEventHistory() {
  const cookieStore = cookies();

  cookieStore.set(EVENT_HISTORY_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
  });
}
