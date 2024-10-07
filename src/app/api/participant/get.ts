import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase/client';

export async function get(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('participants')
    .select('id, name')
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
  if (data.length === 0) {
    return NextResponse.json(
      { message: 'No participants found for this event', participants: [] },
      { status: 200 },
    );
  }

  return NextResponse.json({ participants: data });
}
