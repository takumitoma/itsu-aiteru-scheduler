export const daysOfWeekKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export type DaysOfWeekKey = (typeof daysOfWeekKeys)[number];
