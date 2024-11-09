import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const LOCALHOST_IP = '127.0.0.1';

// only rate limit in production for faster compile time in dev mode
const ratelimit =
  process.env.NODE_ENV === 'production'
    ? new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(10, '10s'),
      })
    : null;

export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
): Promise<NextResponse> {
  // only rate limit in production for faster compile time in dev mode
  if (process.env.NODE_ENV !== 'production') {
    return handler(request);
  }

  try {
    const ip = request.ip ?? LOCALHOST_IP;
    const { success, limit, reset, remaining } = await ratelimit!.limit(ip);

    // if remaining === 0
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        },
      );
    }

    const response = await handler(request);

    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
