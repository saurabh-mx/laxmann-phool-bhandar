import { NextResponse } from 'next/server';
import { getStoreDataAsync } from '@/lib/store';

export const revalidate = 3600;

export async function GET() {
  try {
    const data = await getStoreDataAsync();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve data' },
      { status: 500 }
    );
  }
}
