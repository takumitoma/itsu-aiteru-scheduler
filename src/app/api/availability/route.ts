import { NextRequest } from 'next/server';
import { post } from './post';

export async function POST(request: NextRequest) {
  return post(request);
}
