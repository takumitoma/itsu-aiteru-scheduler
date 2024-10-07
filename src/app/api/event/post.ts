import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase/client';
import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { EventData } from '@/types/EventData';

dayjs.extend(utc);
dayjs.extend(timezone);

const PostEventInput = z.object({
  title: z.string().min(1).max(100),
  surveyType: z.enum(['specific', 'week']),
  dates: z.array(z.string().datetime()).nullable(),
  daysOfWeek: z.array(z.number().min(0).max(1)).length(7).nullable(),
  timeRangeStart: z.number().min(0).max(23),
  timeRangeEnd: z.number().min(1).max(24),
  timezone: z.string(),
});

export async function post(request: NextRequest) {
  try {
    const eventData = await request.json();

    // validation using zod
    const validatedData = PostEventInput.parse(eventData);

    // more validation
    if (validatedData.timeRangeStart >= validatedData.timeRangeEnd) {
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
        time_range_start: validatedData.timeRangeStart,
        time_range_end: validatedData.timeRangeEnd,
        dates: validatedData.surveyType === 'specific' ? validatedData.dates : null,
        days_of_week: validatedData.surveyType === 'week' ? validatedData.daysOfWeek : null,
      })
      .select();

    if (error) throw error;

    const createdEvent: EventData = {
      id: data[0].id,
      title: data[0].title,
      surveyType: data[0].survey_type,
      timezone: data[0].timezone,
      timeRangeStart: data[0].time_range_start,
      timeRangeEnd: data[0].time_range_end,
      dates: data[0].dates,
      daysOfWeek: data[0].days_of_week,
    };

    return NextResponse.json(
      { message: 'Event created successfully', event: createdEvent },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 },
    );
  }
}