import { Event } from '@/types/Event';

import { EVENT_HISTORY_STORAGE_NAME } from '@/constants/event-history-storage';
const MAX_HISTORY = 10;

export function addEventToHistory(event: Event) {
  try {
    let eventHistory: Event[] = [];

    const historyLocalStorage = localStorage.getItem(EVENT_HISTORY_STORAGE_NAME);
    if (historyLocalStorage) {
      eventHistory = JSON.parse(historyLocalStorage);
    }

    // remove event if it matches the event that will be inserted
    eventHistory = eventHistory.filter((e) => e.id !== event.id);

    eventHistory.push(event);

    // keep just the MAX_HISTORY most recent events
    if (eventHistory.length > MAX_HISTORY) {
      eventHistory = eventHistory.slice(eventHistory.length - MAX_HISTORY);
    }

    localStorage.setItem(EVENT_HISTORY_STORAGE_NAME, JSON.stringify(eventHistory));
  } catch (error) {
    console.error('failed to update event history', error);
  }
}

export function getEventHistory(): Event[] {
  let eventHistory: Event[] = [];
  try {
    const storedHistory = localStorage.getItem(EVENT_HISTORY_STORAGE_NAME);
    eventHistory = storedHistory ? JSON.parse(storedHistory) : [];
    eventHistory = eventHistory.map((event) => ({
      ...event,
      createdAt: new Date(event.createdAt),
    }));
    eventHistory = eventHistory.reverse();
  } catch (error) {
    console.error('failed to get event history', error);
  }
  return eventHistory;
}

export function clearEventHistory(): boolean {
  try {
    localStorage.setItem(EVENT_HISTORY_STORAGE_NAME, '[]');
    return true;
  } catch (error) {
    console.error('failed to clear event history', error);
    return false;
  }
}
