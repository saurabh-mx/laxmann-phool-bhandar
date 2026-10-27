import { NextResponse } from 'next/server';
import { getStoreDataAsync } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getStoreDataAsync();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve data' },
      { status: 500 }
    );
  }
}
