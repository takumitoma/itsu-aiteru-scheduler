import { NextResponse, NextRequest } from 'next/server';
import supabase from '@/lib/supabase/client';
import { z } from 'zod';

const UpdateAvailabilityInput = z.object({
  participantId: z.string().uuid(),
  availability: z.array(z.array(z.number().int().nonnegative())),
});

export async function post(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantId, availability } = UpdateAvailabilityInput.parse(body);

    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .select('*, events(*)')
      .eq('id', participantId)
      .single();

    if (participantError || !participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    const event = participant.events;

    // the length of availability array should equal length of dates or daysOfWeek array
    const expectedLength =
      event.survey_type === 'specific' ? event.dates?.length : event.days_of_week?.length;
    if (availability.length !== expectedLength) {
      return NextResponse.json({ error: 'Invalid availability array length' }, { status: 400 });
    }

    // the max value in each array should be (timeRangeEnd - timeRangeStart) * 4 - 1
    // * 4 because the time chart is split into 15 minute intervals so, 4 intervals in 1 hour
    // - 1 for offset
    const maxIndex = (event.time_range_end - event.time_range_start) * 4 - 1;
    const isValidRowValues = availability.every((row) =>
      row.every((index) => index >= 0 && index <= maxIndex),
    );

    if (!isValidRowValues) {
      return NextResponse.json({ error: 'Invalid availability index values' }, { status: 400 });
    }

    // Update participant's availability
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
