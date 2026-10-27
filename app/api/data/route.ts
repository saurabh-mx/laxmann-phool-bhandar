import { NextResponse } from 'next/server';
import { getStoreData } from '@/lib/store';

export async function GET() {
  try {
    const data = getStoreData();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve data' },
      { status: 500 }
    );
  }
}
