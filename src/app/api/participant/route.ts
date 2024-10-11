import { NextRequest } from 'next/server';
import { get } from './get';
import { post } from './post';

export async function GET(request: NextRequest) {
  return get(request);
}

export async function POST(request: NextRequest) {
  return post(request);
}
