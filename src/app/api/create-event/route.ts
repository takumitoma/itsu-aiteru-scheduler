import supabase from '@/supabase/client';
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
      return new Response(JSON.stringify({ error: 'Start time can not be before end time' }), {
        status: 400,
      });
    }

    if (validatedData.surveyType === 'specific') {
      validatedData.daysOfWeek = undefined;
      if (
        !validatedData.dates ||
        validatedData.dates.length === 0 ||
        validatedData.dates.length > 31
      ) {
        return new Response(JSON.stringify({ error: 'Invalid date selection' }), { status: 400 });
      }

      const now = dayjs().tz(validatedData.timezone);
      if (
        validatedData.dates.some((date) =>
          dayjs.tz(date, validatedData.timezone).isBefore(now, 'day'),
        )
      ) {
        return new Response(JSON.stringify({ error: 'Past dates can not be selected' }), {
          status: 400,
        });
      }
    } else {
      validatedData.dates = undefined;
      if (!validatedData.daysOfWeek || validatedData.daysOfWeek.length !== 7) {
        return new Response(JSON.stringify({ error: 'Invalid date selection' }), { status: 400 });
      }
      if (validatedData.daysOfWeek.every((day) => day === 0)) {
        return new Response(
          JSON.stringify({ error: 'At least one day of week must be selected' }),
          { status: 400 },
        );
      }
    }

    const { data, error } = await supabase.from('events').insert([validatedData]).select();

    if (error) throw error;

    return new Response(JSON.stringify({ message: 'Event created successfully', data }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }),
      { status: 400 },
    );
  }
}
