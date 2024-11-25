import { NextResponse, NextRequest } from 'next/server';
import { withRateLimit } from '@/lib/middleware/rate-limit';
import { supabase } from '@/lib/supabase/client';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';

const UpdateAvailabilitySchema = z.object({
  participantId: z.string().uuid(),
  availability: z.array(z.number().int().min(0).max(1)),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withRateLimit(request, async (req) => {
    try {
      const body = await req.json();
      const { participantId, availability } = UpdateAvailabilitySchema.parse(body);

      const { data: participant, error: participantError } = await supabase
        .from('participants')
        .select('*, events(*)')
        .eq('id', participantId)
        .single();

      if (participantError || !participant) {
        return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
      }

      const event = participant.events;

      let expectedLength: number;
      if (event.survey_type === 'specific') {
        expectedLength = event.dates.length;
      } else {
        expectedLength = (event.days_of_week as number[]).filter((value) => value === 1).length;
      }

      const slotsPerDay = (event.time_range_end - event.time_range_start) * 4;
      const expectedTotalSlots = expectedLength * slotsPerDay;

      if (availability.length !== expectedTotalSlots) {
        return NextResponse.json({ error: 'Invalid availability array length' }, { status: 400 });
      }

      const { error: updateError } = await supabase
        .from('participants')
        .update({ availability })
        .eq('id', participantId);

      if (updateError) throw updateError;

      revalidateTag(`participants-${participant.event_id}`);

      return NextResponse.json({ message: 'Availability updated successfully' }, { status: 200 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input data', details: error.errors },
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
