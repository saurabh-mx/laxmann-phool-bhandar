import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getStoreData, saveStoreData } from '@/lib/store';
import {
  isSupabaseConfigured,
  fetchSupabaseServices,
  upsertSupabaseService,
  deleteSupabaseService,
  syncAllServicesToSupabase,
} from '@/lib/supabase-services';
import { Service } from '@/lib/data';

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isSupabaseConfigured()) {
    const dbServices = await fetchSupabaseServices();
    if (dbServices && dbServices.length > 0) {
      return NextResponse.json({ services: dbServices, source: 'supabase' });
    }
  }

  const data = getStoreData();
  return NextResponse.json({ services: data.services, source: 'local' });
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = getStoreData();
    const supabaseActive = isSupabaseConfigured();

    // If body contains an array of services (bulk update / reordering)
    if (Array.isArray(body.services)) {
      const updated = saveStoreData({ services: body.services });

      if (supabaseActive) {
        await syncAllServicesToSupabase(body.services);
      }

      return NextResponse.json({
        success: true,
        services: updated.services,
        syncedToSupabase: supabaseActive,
      });
    }

    // Single service create or update
    const service: Service = body.service;
    if (!service || !service.id || !service.title) {
      return NextResponse.json(
        { error: 'Valid service ID and title are required.' },
        { status: 400 }
      );
    }

    const currentServices = [...data.services];
    const index = currentServices.findIndex((s) => s.id === service.id);

    if (index >= 0) {
      currentServices[index] = service;
    } else {
      currentServices.push(service);
    }

    const updated = saveStoreData({ services: currentServices });

    if (supabaseActive) {
      try {
        await upsertSupabaseService(service, index >= 0 ? index : currentServices.length - 1);
        const dbServices = await fetchSupabaseServices();
        if (dbServices && dbServices.length > 0) {
          saveStoreData({ services: dbServices });
          return NextResponse.json({
            success: true,
            services: dbServices,
            syncedToSupabase: true,
          });
        }
      } catch (sbErr) {
        console.warn('Supabase upsert warning:', sbErr);
      }
    }

    return NextResponse.json({
      success: true,
      services: updated.services,
      syncedToSupabase: supabaseActive,
    });
  } catch (err: any) {
    console.error('Error saving service:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save service' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const data = getStoreData();
    const filtered = data.services.filter((s) => s.id !== id);
    const updated = saveStoreData({ services: filtered });

    let finalServices = updated.services;

    if (isSupabaseConfigured()) {
      try {
        await deleteSupabaseService(id);
        const dbServices = await fetchSupabaseServices();
        if (dbServices !== null) {
          finalServices = dbServices;
          saveStoreData({ services: dbServices });
        }
      } catch (sbErr) {
        console.warn('Supabase delete warning:', sbErr);
      }
    }

    return NextResponse.json({
      success: true,
      services: finalServices,
      syncedToSupabase: isSupabaseConfigured(),
    });
  } catch (err: any) {
    console.error('Error deleting service:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete service' }, { status: 500 });
  }
}
