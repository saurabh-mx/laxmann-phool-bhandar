import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function GET() {
  const authenticated = await isAuthenticatedAdmin();
  return NextResponse.json({ authenticated });
}
