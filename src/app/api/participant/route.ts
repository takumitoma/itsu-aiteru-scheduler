import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withRateLimit } from '@/lib/middleware/rate-limit';
import { supabaseAdmin } from '@/lib/supabase/admin-client';
import { Participant } from '@/types/Participant';
import { revalidateTag } from 'next/cache';

const GetParticipantsSchema = z.object({
  eventId: z.string().length(12),
});

const PostParticipantSchema = z.object({
  eventId: z.string().length(12),
  name: z.string().min(2).max(20),
});

const DeleteParticipantSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(request, async (req) => {
    try {
      const searchParams = req.nextUrl.searchParams;
      const eventId = searchParams.get('eventId');

      if (!eventId) {
        return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
      }

      const { eventId: validatedEventId } = GetParticipantsSchema.parse({ eventId });

      const { data, error } = await supabaseAdmin
        .from('participants')
        .select('id, name, availability')
        .eq('event_id', validatedEventId);

      if (error) throw error;

      if (data.length === 0) {
        return NextResponse.json(
          { message: 'No participants found for this event', participants: [] },
          { status: 200 },
        );
      }

      const participants: Participant[] = data.map((participant) => ({
        id: participant.id,
        name: participant.name,
        availability: participant.availability,
      }));

      return NextResponse.json({ participants }, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Name must be between 2 to 20 characters or the event id is not an uuid' },
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(request, async (req) => {
    try {
      const body = await req.json();
      const { eventId, name } = PostParticipantSchema.parse(body);

      const { data: existingParticipant, error: checkExistenceError } = await supabaseAdmin
        .from('participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('name', name)
        .single();

      if (checkExistenceError && checkExistenceError.code !== 'PGRST116') {
        throw checkExistenceError;
      }

      if (existingParticipant) {
        return NextResponse.json(
          { id: existingParticipant.id, message: 'Participant already exists', new: false },
          { status: 200 },
        );
      }

      const { data, error } = await supabaseAdmin
        .from('participants')
        .insert({ event_id: eventId, name })
        .select('id')
        .single();

      if (error) throw error;

      revalidateTag(`participants-${eventId}`);

      return NextResponse.json(
        { message: 'Participant created successfully', id: data.id, new: false },
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
  });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(request, async (req) => {
    try {
      const searchParams = req.nextUrl.searchParams;
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
      }

      const { id: validatedId } = DeleteParticipantSchema.parse({ id });

      // get the event_id before deleting, used for validation after deletion
      const { data: participant } = await supabaseAdmin
        .from('participants')
        .select('event_id')
        .eq('id', validatedId)
        .single();

      const { error } = await supabaseAdmin.from('participants').delete().eq('id', validatedId);

      if (error) throw error;

      if (participant?.event_id) {
        revalidateTag(`participants-${participant.event_id}`);
      }

      return NextResponse.json({ message: 'Participant deleted successfully' }, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'An unknown error occurred' },
        { status: 500 },
      );
    }
  });
}

export const runtime = 'edge';
