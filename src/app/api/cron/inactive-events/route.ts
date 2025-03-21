import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin-client';

// 2 months -> 60 days -> round up one day because its a daily cron job
const DAYS_UNTIL_DELETE = 61;
const CRON_SECRET = process.env.CRON_SECRET;
const DEMO_EVENTS = ['102c19619c9e', '88945b5ff1c8'];

export async function DELETE(request: NextRequest) {
  if (!CRON_SECRET) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  }

  const authHeader = request.headers.get('x-cron-secret');

  if (authHeader !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - DAYS_UNTIL_DELETE);

    const { data, error } = await supabaseAdmin
      .from('events')
      .delete()
      .lt('last_accessed', pastDate.toISOString())
      .not('id', 'in', `(${DEMO_EVENTS.join(',')})`)
      .select('id');

    if (error) throw error;

    const count = data?.length || 0;

    return NextResponse.json({
      message: 'Cleanup successful',
      count,
      date: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}

export const runtime = 'edge';
