import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const SALT_ROUNDS = 10;

const HashPasswordSchema = z.object({
  password: z.string().max(16),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json();
    const { password } = HashPasswordSchema.parse(data);

    const hashedPassword = await hash(password, SALT_ROUNDS);

    return NextResponse.json({ hashedPassword }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 },
    );
  }
}
