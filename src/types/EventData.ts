export interface EventData {
  id: string;
  title: string;
  surveyType: 'specific' | 'week';
  timezone: string;
  timeRangeStart: number;
  timeRangeEnd: number;
  dates: string[] | null;
  daysOfWeek: number[] | null;
}
