import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

const NUM_SALT_ROUNDS = 10;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { password } = await request.json();

    const hashedPassword = await hash(password, NUM_SALT_ROUNDS);

    return NextResponse.json({ hashedPassword }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to hash password' },
      { status: 500 },
    );
  }
}
