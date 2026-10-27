import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getStoreData, saveStoreData, PricingConfig } from '@/lib/store';
import { isSupabaseConfigured } from '@/lib/supabase-services';
import { fetchSupabasePricing, upsertSupabasePricing } from '@/lib/supabase-pricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isSupabaseConfigured()) {
    const dbPricing = await fetchSupabasePricing();
    if (dbPricing) {
      return NextResponse.json({ pricing: dbPricing, source: 'supabase' });
    }
  }

  const data = getStoreData();
  return NextResponse.json({ pricing: data.pricing, source: 'local' });
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
    let finalPricing = updated.pricing;

    if (isSupabaseConfigured()) {
      try {
        await upsertSupabasePricing(pricing);
        finalPricing = pricing;
      } catch (sbErr) {
        console.warn('Supabase upsert pricing warning:', sbErr);
      }
    }

    try {
      revalidatePath('/', 'page');
      revalidatePath('/services', 'page');
      revalidatePath('/book', 'page');
      revalidatePath('/api/data');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({
      success: true,
      pricing: finalPricing,
      syncedToSupabase: isSupabaseConfigured(),
    });
  } catch (err: any) {
    console.error('Error saving pricing:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to save pricing configuration' },
      { status: 500 }
    );
  }
}
