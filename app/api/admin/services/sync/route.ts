import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getStoreData, saveStoreData } from '@/lib/store';
import {
  isSupabaseConfigured,
  syncAllServicesToSupabase,
  fetchSupabaseServices,
} from '@/lib/supabase-services';

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Supabase is not configured yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.',
      },
      { status: 400 }
    );
  }

  try {
    const { action } = await request.json().catch(() => ({ action: 'push' }));
    const data = getStoreData();

    if (action === 'pull') {
      // Pull services from Supabase into local store
      const dbServices = await fetchSupabaseServices();
      if (!dbServices || dbServices.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No services found in Supabase to import.' },
          { status: 404 }
        );
      }
      saveStoreData({ services: dbServices });
      return NextResponse.json({
        success: true,
        message: `Successfully imported ${dbServices.length} services from Supabase!`,
        services: dbServices,
      });
    }

    // Default action: Push/Seed local services to Supabase
    const ok = await syncAllServicesToSupabase(data.services);
    if (!ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Failed to sync with Supabase. Ensure you ran the SQL schema in supabase-schema.sql to create the "services" table.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${data.services.length} services to Supabase database!`,
      services: data.services,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Sync operation failed' },
      { status: 500 }
    );
  }
}
