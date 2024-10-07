import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import supabase from '@/lib/supabase/client';

const PostParticipantInput = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(1).max(100),
});

export async function post(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, name } = PostParticipantInput.parse(body);

    // check if participant already exists
    const { data: existingParticipant, error: checkError } = await supabase
      .from('participants')
      .select('id')
      .eq('event_id', eventId)
      .eq('name', name)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    // if participant exists return
    if (existingParticipant) {
      return NextResponse.json(
        { id: existingParticipant.id, message: 'Participant already exists' },
        { status: 200 },
      );
    }

    // otherwise create new participant
    const { data, error } = await supabase
      .from('participants')
      .insert({ event_id: eventId, name })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { id: data.id, message: 'Participant created successfully' },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
