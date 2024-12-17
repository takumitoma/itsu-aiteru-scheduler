import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withRateLimit } from '@/lib/middleware/rate-limit';
import { supabaseAdmin } from '@/lib/supabase/client';
import { Event } from '@/types/Event';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const GetEventSchema = z.object({
  id: z.string().length(12),
});

const PostEventSchema = z.object({
  title: z.string().min(1).max(100),
  surveyType: z.enum(['specific', 'week']),
  dates: z.array(z.string().datetime()).nullable(),
  daysOfWeek: z.array(z.number().min(0).max(1)).length(7).nullable(),
  timeRangeStart: z.number().min(0).max(23),
  timeRangeEnd: z.number().min(1).max(24),
  timezone: z.string(),
});

const PatchEventSchema = z.object({
  operation: z.literal('updateLastAccessed'),
  id: z.string().length(12),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ error: 'Event ID not specified' }, { status: 400 });
      }

      const { id: validatedId } = GetEventSchema.parse({ id });

      const { data: event, error } = await supabaseAdmin
        .from('events')
        .select(
          `id, title, survey_type, timezone, time_range_start, 
          time_range_end, created_at, dates, days_of_week`,
        )
        .eq('id', validatedId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        throw error;
      }

      const eventData: Event = {
        id: event.id,
        title: event.title,
        surveyType: event.survey_type,
        timezone: event.timezone,
        timeRangeStart: event.time_range_start,
        timeRangeEnd: event.time_range_end,
        createdAt: event.created_at,
        dates: event.dates,
        daysOfWeek: event.days_of_week,
      };

      return NextResponse.json({ event: eventData }, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid event ID' }, { status: 404 });
      }
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'An unknown error occurred' },
        { status: 500 },
      );
    }
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(request, async (req) => {
    try {
      const eventData = await req.json();
      const validatedData = PostEventSchema.parse(eventData);

      if (validatedData.timeRangeStart >= validatedData.timeRangeEnd) {
        return NextResponse.json(
          { error: 'Start time cannot be before end time' },
          { status: 400 },
        );
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
          return NextResponse.json({ error: 'Past dates cannot be selected' }, { status: 400 });
        }

        // dates could be valid but not in order, don't error and just sort
        validatedData.dates.sort();
      } else {
        if (!validatedData.daysOfWeek || validatedData.daysOfWeek.every((day) => day === 0)) {
          return NextResponse.json(
            { error: 'At least one day of week must be selected' },
            { status: 400 },
          );
        }
      }

      const { data, error } = await supabaseAdmin
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

      const createdEvent = data[0];
      return NextResponse.json(
        { message: 'Event created successfully', eventId: createdEvent.id },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'An unknown error occurred' },
        { status: 500 },
      );
    }
  });
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(request, async (req) => {
    try {
      const body = await req.json();
      const { id } = PatchEventSchema.parse(body);

      const { error } = await supabaseAdmin
        .from('events')
        .update({ last_accessed: 'now()' })
        .eq('id', id);

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        throw error;
      }

      return NextResponse.json({ message: 'Last accessed timestamp updated' }, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid event ID or invalid request format' },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'An unknown error occurred' },
        { status: 500 },
      );
    }
  });
}

export const runtime = 'edge';
