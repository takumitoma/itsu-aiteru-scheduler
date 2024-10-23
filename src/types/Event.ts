export interface Event {
  id: string;
  title: string;
  surveyType: 'specific' | 'week';
  timezone: string;
  timeRangeStart: number;
  timeRangeEnd: number;
  createdAt: Date;
  dates: string[] | null;
  daysOfWeek: number[] | null;
}
