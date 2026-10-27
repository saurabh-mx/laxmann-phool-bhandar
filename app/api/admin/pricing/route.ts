import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getStoreData, saveStoreData, PricingConfig } from '@/lib/store';

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = getStoreData();
  return NextResponse.json({ pricing: data.pricing });
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const pricing: PricingConfig = body.pricing;

    if (!pricing || !Array.isArray(pricing.eventTypes) || !Array.isArray(pricing.addons)) {
      return NextResponse.json(
        { error: 'Valid pricing structure is required.' },
        { status: 400 }
      );
    }

    const updated = saveStoreData({ pricing });
    return NextResponse.json({ success: true, pricing: updated.pricing });
  } catch (err) {
    console.error('Error saving pricing:', err);
    return NextResponse.json({ error: 'Failed to save pricing configuration' }, { status: 500 });
  }
}
