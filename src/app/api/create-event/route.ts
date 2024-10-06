import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase/client';
import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const EventSchema = z.object({
  title: z.string().min(1).max(100),
  surveyType: z.enum(['specific', 'week']),
  dates: z.array(z.string().datetime()).optional(),
  daysOfWeek: z.array(z.number().min(0).max(1)).length(7).optional(),
  timeRange: z.object({
    start: z.number().min(0).max(23),
    end: z.number().min(1).max(24),
  }),
  timezone: z.string(),
});

export async function POST(request: Request) {
  try {
    const eventData = await request.json();

    // validation using zod
    const validatedData = EventSchema.parse(eventData);

    // more validation
    if (validatedData.timeRange.start >= validatedData.timeRange.end) {
      return NextResponse.json({ error: 'Start time can not be before end time' }, { status: 400 });
    }

    if (validatedData.surveyType === 'specific') {
      if (
        !validatedData.dates ||
        validatedData.dates.length === 0 ||
        validatedData.dates.length > 31
      ) {
        return NextResponse.json({ error: 'Invalid date selection' }, { status: 400 });
      }

      const now = dayjs().tz(validatedData.timezone);
      if (
        validatedData.dates.some((date) =>
          dayjs(date).tz(validatedData.timezone).isBefore(now, 'day'),
        )
      ) {
        return NextResponse.json({ error: 'Past dates can not be selected' }, { status: 400 });
      }
    } else {
      if (!validatedData.daysOfWeek || validatedData.daysOfWeek.length !== 7) {
        return NextResponse.json({ error: 'Invalid date selection' }, { status: 400 });
      }
      if (validatedData.daysOfWeek.every((day) => day === 0)) {
        return NextResponse.json(
          { error: 'At least one day of week must be selected' },
          { status: 400 },
        );
      }
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        title: validatedData.title,
        survey_type: validatedData.surveyType,
        timezone: validatedData.timezone,
        time_range_start: validatedData.timeRange.start,
        time_range_end: validatedData.timeRange.end,
        dates: validatedData.surveyType === 'specific' ? validatedData.dates : null,
        days_of_week: validatedData.surveyType === 'week' ? validatedData.daysOfWeek : null,
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ message: 'Event created successfully', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 },
    );
  }
}

export async function createEvent(eventData: z.infer<typeof EventSchema>) {
  const response = await fetch('/api/create-event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create event');
  }

  return response.json();
}
