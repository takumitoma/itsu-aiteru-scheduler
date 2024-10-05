import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase/client';
import { z } from 'zod';

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

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 },
    );
  }
}
