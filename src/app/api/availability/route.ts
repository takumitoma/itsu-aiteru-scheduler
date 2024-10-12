import { NextResponse, NextRequest } from 'next/server';
import supabase from '@/lib/supabase/client';
import { z } from 'zod';

const UpdateAvailabilitySchema = z.object({
  participantId: z.string().uuid(),
  availability: z.array(z.number().int().min(0).max(1)),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
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

    const numDaysOfWeek = (event.days_of_week as number[]).filter((value) => value === 1).length;
    const expectedLength = event.survey_type === 'specific' ? event.dates?.length : numDaysOfWeek;
    const slotsPerDay = (event.time_range_end - event.time_range_start) * 4;
    const expectedTotalSlots = expectedLength * slotsPerDay;

    if (availability.length !== expectedTotalSlots) {
      return NextResponse.json({ error: 'Invalid availability array length' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('participants')
      .update({ availability })
      .eq('id', participantId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
    }

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
}
