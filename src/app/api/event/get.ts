import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase/client';
import { z } from 'zod';
import { EventData } from '@/types/EventData';
import { ParticipantData } from '@/types/ParticipantData';

const GetEventInput = z.object({
  id: z.string().uuid(),
});

export async function get(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID not specified' }, { status: 400 });
    }

    const validatedData = GetEventInput.parse({ id });

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(
        'id, title, survey_type, timezone, time_range_start, time_range_end, dates, days_of_week',
      )
      .eq('id', validatedData.id)
      .single();

    if (eventError) {
      // if no rows returned
      if (eventError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event was not found' }, { status: 404 });
      }

      return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }

    if (!event) {
      return NextResponse.json({ error: 'Event was not found' }, { status: 404 });
    }

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

    // Fetch participants data
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('id, name, availability')
      .eq('event_id', validatedData.id);

    if (participantsError) {
      return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
    }

    // example: [{1, 1, 1, 0 ..... 0, 1, 0, 0}] becomes [{0, 1, 2, 93}]
    // this is necessary bc PostreSQL only stores perfectly square 2d arrays
    const formattedParticipants: ParticipantData[] = participants.map((participant) => ({
      id: participant.id,
      eventId: validatedData.id,
      name: participant.name,
      availability: participant.availability.map((day: number[]) => {
        const timeslots: number[] = [];
        day.forEach((timeslot, index) => {
          if (timeslot === 1) {
            timeslots.push(index);
          }
        });
        return timeslots;
      }),
    }));

    // Update last_accessed
    await supabase
      .from('events')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', validatedData.id);

    return NextResponse.json(
      { event: eventData, participants: formattedParticipants || [] },
      { status: 200 },
    );
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
