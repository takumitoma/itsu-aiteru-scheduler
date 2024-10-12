import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import supabase from '@/lib/supabase/client';
import { Participant } from '@/types/Participant';

const GetParticipantsSchema = z.object({
  eventId: z.string().uuid(),
});

const PostParticipantSchema = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(1).max(100),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const { eventId: validatedEventId } = GetParticipantsSchema.parse({ eventId });

    const { data: participants, error } = await supabase
      .from('participants')
      .select('id, name, availability')
      .eq('event_id', validatedEventId);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { message: 'No participants found for this event', participants: [] },
          { status: 200 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (participants.length === 0) {
      return NextResponse.json(
        { message: 'No participants found for this event', participants: [] },
        { status: 200 },
      );
    }

    const compressedParticipants: Participant[] = participants.map((participant) => ({
      id: participant.id,
      eventId: validatedEventId,
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { eventId, name } = PostParticipantSchema.parse(body);

    const { data: existingParticipant, error: checkError } = await supabase
      .from('participants')
      .select('id')
      .eq('event_id', eventId)
      .eq('name', name)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingParticipant) {
      return NextResponse.json(
        { id: existingParticipant.id, message: 'Participant already exists' },
        { status: 200 },
      );
    }

    const { data, error } = await supabase
      .from('participants')
      .insert({ event_id: eventId, name })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Participant created successfully', id: data.id },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 },
    );
  }
}
