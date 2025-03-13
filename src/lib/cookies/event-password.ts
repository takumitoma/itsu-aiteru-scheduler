import { cookies } from 'next/headers';

const EVENT_PASSWORD_PREFIX = 'event_pw_';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function setEventPassword(eventId: string, password: string) {
  cookies().set({
    name: `${EVENT_PASSWORD_PREFIX}${eventId}`,
    value: password,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export function getEventPassword(eventId: string): string | null {
  const cookie = cookies().get(`${EVENT_PASSWORD_PREFIX}${eventId}`);
  return cookie ? cookie.value : null;
}
