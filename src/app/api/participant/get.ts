import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase/client';
import { ParticipantData } from '@/types/ParticipantData';

export async function get(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  const { data: participants, error } = await supabase
    .from('participants')
    .select('id, name, availability')
    .eq('event_id', eventId);

  if (error) {
    // if no rows returned check 1
    if (error.code === 'PGRST116') {
      return NextResponse.json(
        { message: 'No participants found for this event', participants: [] },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // if no rows returned check 2
  if (participants.length === 0) {
    return NextResponse.json(
      { message: 'No participants found for this event', participants: [] },
      { status: 200 },
    );
  }

  // example: [{1, 1, 1, 0 ..... 0, 1, 0, 0}] becomes [{0, 1, 2, 93}]
  // this is bc PostreSQL only stores perfectly square 2d arrays but i want to compress the data
  // for client
  const compressedParticipants: ParticipantData[] = participants.map((participant) => ({
    id: participant.id,
    eventId: eventId,
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

  return NextResponse.json({ participants: compressedParticipants }, { status: 200 });
}
