import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase/client';
import { z } from 'zod';
import { EventData } from '@/types/EventData';

const EventIdInput = z.object({
  id: z.string().uuid(),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID not specified' }, { status: 400 });
    }

    const validatedData = EventIdInput.parse({ id });

    const { data: event, error } = await supabase
      .from('events')
      .select(
        'id, title, survey_type, timezone, time_range_start, time_range_end, dates, days_of_week',
      )
      .eq('id', validatedData.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }

    if (!event) {
      return NextResponse.json({ error: 'Event was not found' }, { status: 404 });
    }

    // todo: add logic to update "last accessed" column

    const eventData: EventData = {
      id: event.id,
      title: event.title,
      surveyType: event.survey_type,
      timezone: event.timezone,
      timeRangeStart: event.time_range_start,
      timeRangeEnd: event.time_range_end,
      dates: event.dates,
      daysOfWeek: event.days_of_week,
    };

    return NextResponse.json({ event: eventData }, { status: 200 });
  } catch (error) {
    // return 404 even if id is in bad format ie not uuid
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 },
    );
  }
}

export async function getEvent(id: string): Promise<{ event: EventData }> {
  const response = await fetch(`/api/get-event?id=${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Event not found');
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An error occurred while fetching the event');
    }
  }

  return response.json();
}
