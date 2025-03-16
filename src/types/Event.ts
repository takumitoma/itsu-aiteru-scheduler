interface Event {
  title: string;
  surveyType: 'specific' | 'week';
  timezone: string;
  timeRangeStart: number;
  timeRangeEnd: number;
  dates: string[] | null;
  daysOfWeek: number[] | null;
}

export interface EventGet extends Event {
  id: string;
  createdAt: Date;
}

export interface EventPost extends Event {
  id?: string; // not required for event post, required for event history post
  createdAt?: Date; // not required for event post, required only for event history post
  password?: string;
}
